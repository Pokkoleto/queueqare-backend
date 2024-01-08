import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Department } from "../entity/Department";
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
    let { name2, floor, name, isDefault } = req.body;
    const username = name2;
    const password = makeid(8);
    const hashpassword = await hash(password, 10);

    const info = new Department();
    if (name == null) {
      info.departmentName = name;
    }
    info.departmentName2 = name2;
    info.Floor = floor;
    info.isDefault = isDefault;

    const department = await AppDataSource.getRepository(Department).save(info);

    const infouser = new User();
    infouser.username = username;
    infouser.password = hashpassword;
    if (name != null) {
      infouser.name = name;
    }
    infouser.name2 = name2;
    infouser.isActive = 0;
    infouser.role = "department";
    infouser.departmentId = department.departmentId;

    const users = await AppDataSource.getRepository(User).save(infouser);
    res.status(200).json({ username, password });
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
}
