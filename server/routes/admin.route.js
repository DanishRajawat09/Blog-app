import { Router } from "express";
import {
  adminData,
  adminLogin,
  adminLogout,
  approvedCommentByID,
  deleteCommentById,
  getDashboard,
  registerAdmin,
  checkUserName,
  resetAccessToken,
  notApprovedCommentByID,
} from "../controllers/admin.controller.js";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";
import refreshJWT from "../middlewares/refreshJWT.middleware.js"
const router = Router();

router.route("/info").get(verifyJWT, adminData);
router.route("/register").post(registerAdmin);
router.route("/username").get(checkUserName);
router.route("/login").post(adminLogin);
router.route("/logout").post(verifyJWT, adminLogout);
router.route("/dashboard").get(verifyJWT, getDashboard);
router.route("/delete-comment/:commentId").delete(verifyJWT, deleteCommentById);
router
  .route("/approved-comment/:commentId")
  .patch(verifyJWT, approvedCommentByID);
router
  .route("/not-approved-comment/:commentId")
  .patch(verifyJWT, notApprovedCommentByID);

  router.route("/reset-tokens").post(refreshJWT , resetAccessToken)
export default router;
