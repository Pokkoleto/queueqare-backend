import { Department } from "./entity/Department";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import UserRoutes from "./routes/users.routes";
import DepartmentRoutes from "./routes/department.routes";
import QueueRoutes from "./routes/queue.routes";
import { User } from "./entity/User";
import { Queue } from "./entity/Queue";
// import { usertest } from "./controller/UserController"

AppDataSource.initialize()
  .then(async () => {
    const userRepository = AppDataSource.getRepository(User);
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // app.get("/test4",(req,res,next)=>{console.log("dsfsdsfs"); next();}, usertest)

    // register express routes from defined application routes

    app.use("/users", UserRoutes);
    app.use("/department", DepartmentRoutes);
    app.use("/queue", QueueRoutes);

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));
