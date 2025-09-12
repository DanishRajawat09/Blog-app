import { Router } from "express";
import { adminLogin, registerAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(adminLogin);

export default router;
