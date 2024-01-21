import { Router } from "express";
import UserController from "../controller/UserController";
import extractJWT from "../middleware/extractJWT";

const router = Router();
const controller = new UserController();

router.get("/", controller.all);
router.get("/doctor", controller.getDoctor);
router.get("/active", controller.getActiveUser);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/manualRegister", controller.manualRegister);
router.post("/logout/:id", controller.logout);
router.delete("/delete/:id", controller.deleteById);
router.get("/:id", controller.one);
// router.post('/', controller.save);

export default router;
