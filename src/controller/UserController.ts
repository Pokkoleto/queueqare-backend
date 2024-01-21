import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import makeid from "../function/randomString";
import { hash, compareSync, compare } from "bcryptjs";
import config from "../config/config";
import signJWT from "../function/signJWT";
import { Department } from "../entity/Department";

export default class UserController {
  async getRepository() {
    const users = await AppDataSource.getRepository(User);
    return users;
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const users = await AppDataSource.getRepository(User).find();
    response.status(200).json(users);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { userId: request.params.id },
    });
    response.status(200).json(user);
  }

  async getDoctor(request: Request, response: Response, next: NextFunction) {
    const user = await AppDataSource.getRepository(User).find({
      where: { role: "doctor" },
    });
    response.status(200).json(user);
  }

  async getActiveUser(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    console.log("getActiveUser");
    const user = await AppDataSource.getRepository(User).find({
      where: { isActive: 1 },
    });
    console.log(user);
    response.status(200).json(user);
  }

  async validateToken(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
      message: "Token(s) validated",
    });
  }

  async register(req: Request, res: Response, next: NextFunction) {
    let { userId, name, name2, departmentId, role } = req.body;
    if (userId != null) {
      const user = await AppDataSource.getRepository(User).update(
        { userId: userId },
        {
          name: name,
          name2: name2,
          departmentId: departmentId,
          role: role,
        }
      );
      res.status(200).json({ message: "update success" });
      return;
    } else {
      const arr = name2.split(" ");
      const username =
        arr[0].toLowerCase() + "." + arr[1].slice(0, 3).toLowerCase();
      // const username = name2;
      const password = makeid(8);

      const hashpassword = await hash(password, 10);

      const info = new User();
      info.username = username;
      info.password = hashpassword;
      if (name != null) {
        info.name = name;
      }
      info.name2 = name2;
      info.isActive = 1;
      info.role = role;
      info.departmentId = departmentId;

      const users = await AppDataSource.getRepository(User).save(info);
      const num = await AppDataSource.getRepository(Department)
        .findOne({ where: { departmentId: departmentId } })
        .then((value) => value.member);
      await AppDataSource.getRepository(Department).update(
        { departmentId: departmentId },
        { member: num + 1 }
      );
      res.status(200).json({ username, password });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    let { username, password } = req.body;
    const user = await AppDataSource.getRepository(User).findOne({
      where: { username: username },
    });
    if (!user) {
      return res.status(404).json({
        message: "No User Found",
      });
    }
    compare(password, user.password, (error, result) => {
      if (error) {
        return res.status(402).json({
          message: "error",
        });
      } else if (result) {
        signJWT(user, (_error, token) => {
          if (_error) {
            return res.status(401).json({
              message: "Unable to Sign JWT",
              error: _error,
            });
          } else if (token) {
            AppDataSource.getRepository(User).update(user.userId, {
              isActive: 1,
            });
            return res.status(200).json({
              message: "Auth Successful",
              token,
              user: user,
              status: 200,
            });
          }
        });
      } else {
        return res.status(406).json({
          message: "Password Mismatch",
        });
      }
    });
    const role = user.role;
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { userId: req.params.id },
    });
    const department = await AppDataSource.getRepository(Department).findOne({
      where: { departmentId: user.departmentId },
    });
    await AppDataSource.getRepository(Department).update(
      { departmentId: user.departmentId },
      { member: department.member - 1 }
    );
    await AppDataSource.getRepository(User).delete({ userId: req.params.id });
    res.status(200).json({ message: "delete success" });
  }

  async getPassword(req: Request, res: Response, next: NextFunction) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { userId: req.params.id },
    });
    const password = user.password;
    res.status(200).json({ password: user.password });
  }

  async manualRegister(req: Request, res: Response, next: NextFunction) {
    let { username, password, name, name2, role } = req.body;
    const hashpassword = await hash(password, 10);

    const info = new User();
    info.username = username;
    info.password = hashpassword;
    if (name != null) {
      info.name = name;
    }
    info.name2 = name2;
    info.isActive = 1;
    info.role = role;
    info.departmentId = 0;

    const users = await AppDataSource.getRepository(User).save(info);
    res.status(200).json({ username, password });
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { userId: req.params.id },
    });
    AppDataSource.getRepository(User).update(user.userId, { isActive: 0 });
    res.status(200).json({ message: "logout success" });
  }
}
