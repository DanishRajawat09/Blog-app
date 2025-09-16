import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  approvedCommentByID,
  deleteCommentById,
  getDashboard,
  registerAdmin,
} from "../controllers/admin.controller.js";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";
const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(adminLogin);
router.route("/logout").post(verifyJWT, adminLogout);
router.route("/dashboard").get(verifyJWT, getDashboard);
router.route("/delete-comment/:commentId").delete(verifyJWT, deleteCommentById);
router
  .route("/approved-comment/:commentId")
  .patch(verifyJWT, approvedCommentByID);

export default router;
