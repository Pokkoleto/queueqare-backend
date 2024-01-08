import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Department } from "./entity/Department";
import { Queue } from "./entity/Queue";
import { NavigatePoint } from "./entity/NavigatePoint";
import { Variable } from "./entity/Variable";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "earth4102",
  database: "queueqare",
  synchronize: true,
  logging: false,
  entities: [User, Department, Queue, NavigatePoint, Variable],
  migrations: [],
  subscribers: [],
});
