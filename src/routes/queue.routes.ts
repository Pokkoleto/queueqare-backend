import { Department } from "./../entity/Department";
import { Router } from "express";
import QueueController from "../controller/QueueController";
import extractJWT from "../middleware/extractJWT";

const router = Router();
const controller = new QueueController();

router.get("/", controller.all);
router.post("/add", controller.add);
router.post("/call", controller.call);
router.post("/skip", controller.skip);
router.post("/callskip", controller.callSkip);
router.post("/reset", controller.reset);
router.delete("/del/:queueNumber", controller.deleteByNumber);
router.get("/department/:id", controller.getQueueByDepartmentId);
router.get("/:token", controller.getQueueInfoByToken);

export default router;
