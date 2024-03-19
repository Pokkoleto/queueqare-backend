import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Department } from "../entity/Department";
import makeid from "../function/randomString";
import { hash, compareSync, compare } from "bcryptjs";
import config from "../config/config";
import signJWT from "../function/signJWT";
import UserController from "./UserController";
import { User } from "../entity/User";
import { Queue } from "../entity/Queue";
import { Variable } from "../entity/Variable";

export default class DepartmentController {
  async all(request: Request, response: Response, next: NextFunction) {
    const department = await AppDataSource.getRepository(Queue).find();
    response.status(200).json(department);
  }

  async getQueueByDepartmentId(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const department = await AppDataSource.getRepository(Queue).find({
      where: { departmentId: request.params.id, status: "waiting" },
    });
    response.status(200).json(department);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    let { tel } = req.body;
    const defaultDepartment = await AppDataSource.getRepository(
      Department
    ).findOne({ where: { isDefault: 1 } });

    let token = makeid(8);
    while (
      (await AppDataSource.getRepository(Queue).findOne({
        where: { token: token },
      })) != null
    ) {
      token = makeid(8);
    }

    const info = new Queue();
    info.token = makeid(8);
    info.departmentId = defaultDepartment.departmentId;
    info.status = "waiting";
    info.queueNumber = await AppDataSource.getRepository(Variable)
      .findOne({ where: { name: "last" } })
      .then((value) => value.int);
    if (tel != null) {
      info.tel = tel;
    }
    await AppDataSource.getRepository(Variable).update(
      { name: "last" },
      { int: info.queueNumber + 1 }
    );
    await AppDataSource.getRepository(Queue).save(info);
    res.status(200).json(info);
  }

  async call(req: Request, res: Response, next: NextFunction) {
    let cnt;
    await AppDataSource.getRepository(User)
      .find({
        where: { role: "doctor", departmentId: req.params.id, isReady: 1 },
      })
      .then((value) => {
        cnt = value.length;
      });
    if (cnt == 0) {
      res.status(200).json({ message: "no doctor" });
    } else {
      const queue = await AppDataSource.getRepository(Queue).findOne({
        where: { departmentId: req.params.id, status: "waiting" },
        order: { queueNumber: "ASC" },
      });
      if (queue != null) {
        queue.status = "called";
        await AppDataSource.getRepository(Queue).save(queue);
        const doc = await AppDataSource.getRepository(User).findOne({
          where: { departmentId: req.params.id, role: "doctor", isReady: 1 },
        });
        doc.check = queue.queueNumber;
        doc.isReady = 0;
        await AppDataSource.getRepository(User).save(doc);
        res.status(200).json({ queue, doc });
      } else {
        res.status(200).json({ message: "no queue" });
      }
    }
  }

  async getQueueInfoByToken(req: Request, res: Response, next: NextFunction) {
    const queue = await AppDataSource.getRepository(Queue).findOne({
      where: { token: req.params.token },
    });
    const temp = await AppDataSource.getRepository(Variable).findOne({
      where: { name: "queue" },
    });
    const add = { queueBefore: queue.queueNumber - temp.int };
    res.status(200).json({ ...queue, ...add });
  }

  async skip(req: Request, res: Response, next: NextFunction) {
    const queue = await AppDataSource.getRepository(Queue).findOne({
      where: { departmentId: req.params.id, status: "waiting" },
      order: { queueNumber: "ASC" },
    });
    queue.status = "skip";
    await AppDataSource.getRepository(Queue).save(queue);
    res.status(200).json(queue);
  }

  async deleteByNumber(req: Request, res: Response, next: NextFunction) {
    const result = await AppDataSource.getRepository(Queue).delete({
      queueNumber: req.params.queueNumber,
    });
    res.status(200).json(result);
  }

  async callSkip(req: Request, res: Response, next: NextFunction) {
    let { departmentId, queueNumber } = req.body;
    let cnt;
    await AppDataSource.getRepository(User)
      .find({
        where: { role: "doctor", departmentId: req.params.id, isReady: 1 },
      })
      .then((value) => {
        cnt = value.length;
      });
    if (cnt == 0) {
      res.status(200).json({ message: "no doctor" });
    } else {
      const queue = await AppDataSource.getRepository(Queue).findOne({
        where: {
          departmentId: departmentId,
          queueNumber: queueNumber,
        },
      });
      if (queue.status != "skip") {
        res.status(200).json({ message: "this queue not skip" });
      }
      queue.status = "called";
      await AppDataSource.getRepository(Queue).save(queue);
      const doc = await AppDataSource.getRepository(User).findOne({
        where: { departmentId: req.params.id, role: "doctor", isReady: 1 },
      });
      doc.check = queue.queueNumber;
      doc.isReady = 0;
      await AppDataSource.getRepository(User).save(doc);
      res.status(200).json({ queue, doc });
    }
  }

  async move(req: Request, res: Response, next: NextFunction) {
    let { departmentId, queueNumber, newDepartmentId } = req.body;
    const queue = await AppDataSource.getRepository(Queue).findOne({
      where: { queueNumber: queueNumber },
    });
    queue.status = "waiting";
    queue.departmentId = newDepartmentId;
    await AppDataSource.getRepository(Queue).save(queue);
    const doc = await AppDataSource.getRepository(User).findOne({
      where: {
        departmentId: departmentId,
        role: "doctor",
        isReady: 0,
        check: queueNumber,
      },
    });
    doc.check = 0;
    doc.isReady = 1;
    await AppDataSource.getRepository(User).save(doc);
    res.status(200).json(queue);
  }

  async reset(req: Request, res: Response, next: NextFunction) {
    await AppDataSource.getRepository(Variable).update(
      { name: "queue" },
      { int: 1 }
    );
    await AppDataSource.getRepository(Variable).update(
      { name: "last" },
      { int: 1 }
    );
    await AppDataSource.getRepository(Queue).delete({});
    res.status(200).json({ message: "reset success" });
  }
}
