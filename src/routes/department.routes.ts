import { Department } from "./../entity/Department";
import { Router } from "express";
import DepartmentController from "../controller/DepartmentController";
import extractJWT from "../middleware/extractJWT";

const router = Router();
const controller = new DepartmentController();

router.get("/", controller.all);
router.post("/add", controller.add);
router.delete("/delete/:id", controller.deleteById);
router.get("/:id", controller.one);
// router.post('/', controller.save);

export default router;
