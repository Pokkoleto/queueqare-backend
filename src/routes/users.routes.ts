import { Router } from "express";
import UserController from "../controller/UserController";
import extractJWT from "../middleware/extractJWT";

const router = Router();
const controller = new UserController();

router.get("/", extractJWT, controller.all);
router.get("/active", controller.getActiveUser);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.delete("/delete/:id", controller.deleteById);
router.get("/:id", controller.one);
// router.post('/', controller.save);

export default router;
