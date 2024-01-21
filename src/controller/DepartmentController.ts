import { Department } from "./../entity/Department";
import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import makeid from "../function/randomString";
import { hash, compareSync, compare } from "bcryptjs";
import config from "../config/config";
import signJWT from "../function/signJWT";
import UserController from "./UserController";
import { User } from "../entity/User";

export default class DepartmentController {
  async all(request: Request, response: Response, next: NextFunction) {
    const department = await AppDataSource.getRepository(Department).find();
    response.status(200).json(department);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const department = await AppDataSource.getRepository(Department).findOne({
      where: { departmentId: request.params.id },
    });
    response.status(200).json(department);
  }

  async validateToken(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
      message: "Token(s) validated",
    });
  }

  async add(req: Request, res: Response, next: NextFunction) {
    let { departmentId, departmentName, departmentName2, floor } = req.body;
    if (departmentId != null) {
      const department = await AppDataSource.getRepository(Department).update(
        { departmentId: departmentId },
        {
          departmentName: departmentName,
          departmentName2: departmentName2,
          floor: floor,
        }
      );
      res.status(200).json({ message: "update success" });
    } else {
      const username = departmentName2;
      const password = makeid(8);
      const hashpassword = await hash(password, 10);

      const info = new Department();
      info.departmentName = departmentName;
      info.departmentName2 = departmentName2;
      info.floor = floor;
      info.isDefault = 0;

      const department = await AppDataSource.getRepository(Department).save(
        info
      );

      const infouser = new User();
      infouser.username = username;
      infouser.password = hashpassword;
      if (departmentName != null) {
        infouser.name = departmentName;
      }
      infouser.name2 = departmentName2;
      infouser.isActive = 0;
      infouser.role = "department";
      infouser.departmentId = department.departmentId;

      const users = await AppDataSource.getRepository(User).save(infouser);
      res.status(200).json({ info, username, password });
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    const department = await AppDataSource.getRepository(Department).findOne({
      where: { departmentId: req.params.id },
    });
    await AppDataSource.getRepository(Department).delete({
      departmentId: req.params.id,
    });

    await AppDataSource.getRepository(User).delete({
      username: department.departmentName2,
    });
    res.status(200).json({ message: "delete success" });
  }

  async setDefault(req: Request, res: Response, next: NextFunction) {
    const department = await AppDataSource.getRepository(Department).findOne({
      where: { departmentId: req.params.id },
    });
    await AppDataSource.getRepository(Department).update(
      { isDefault: 1 },
      { isDefault: 0 }
    );
    await AppDataSource.getRepository(Department).update(
      { departmentId: req.params.id },
      { isDefault: 1 }
    );
    res.status(200).json({ message: "set default success" });
  }

  async getActiveDoctor(req: Request, res: Response, next: NextFunction) {
    const user = await AppDataSource.getRepository(User).find({
      where: { departmentId: req.params.id, isActive: 1, role: "doctor" },
    });
    const count = user.length;
    res.status(200).json({ user, count });
  }

  async getReadyDoctor(req: Request, res: Response, next: NextFunction) {
    const user = await AppDataSource.getRepository(User).find({
      where: { departmentId: req.params.id, isReady: 1, role: "doctor" },
    });
    const count = user.length;
    res.status(200).json({ user, count });
  }
}
