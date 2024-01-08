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
      where: { departmentId: request.params.departmentId, status: "waiting" },
    });
    response.status(200).json(department);
  }

  async add(req: Request, res: Response, next: NextFunction) {
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
    await AppDataSource.getRepository(Variable).update(
      { name: "last" },
      { int: info.queueNumber + 1 }
    );
    await AppDataSource.getRepository(Queue).save(info);
    res.status(200).json(info);
  }

  async call(req: Request, res: Response, next: NextFunction) {
    const queuenum = await AppDataSource.getRepository(Variable)
      .findOne({ where: { name: "queue" } })
      .then((value) => value.int);
    const queue = await AppDataSource.getRepository(Queue).findOne({
      where: { queueNumber: queuenum },
    });
    await AppDataSource.getRepository(Variable).update(
      { name: "queue" },
      { int: queuenum + 1 }
    );
    queue.status = "called";
    await AppDataSource.getRepository(Queue).save(queue);
    res.status(200).json(queue);
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
    const queuenum = await AppDataSource.getRepository(Variable)
      .findOne({ where: { name: "queue" } })
      .then((value) => value.int);
    const queue = await AppDataSource.getRepository(Queue).findOne({
      where: { queueNumber: queuenum },
    });
    await AppDataSource.getRepository(Variable).update(
      { name: "queue" },
      { int: queuenum + 1 }
    );
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
    const queue = await AppDataSource.getRepository(Queue).findOne({
      where: { status: "skip" },
      order: { queueNumber: "ASC" },
    });
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
  }
}
