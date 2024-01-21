import { Department } from "./../entity/Department";
import { Router } from "express";
import QueueController from "../controller/QueueController";
import extractJWT from "../middleware/extractJWT";

const router = Router();
const controller = new QueueController();

router.get("/", controller.all);
router.post("/reset", controller.reset);
router.delete("/del/:queueNumber", controller.deleteByNumber);
router.post("/add", controller.add);
router.post("/move", controller.move);
router.post("/callSkip/", controller.callSkip);
router.post("/call/:id", controller.call);
router.post("/skip/:id", controller.skip);
router.get("/department/:id", controller.getQueueByDepartmentId);
router.get("/:token", controller.getQueueInfoByToken);

export default router;
