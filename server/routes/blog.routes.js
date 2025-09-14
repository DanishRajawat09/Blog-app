import { Router } from "express";
import {
  addBlog,
  deleteBlogById,
  getAdminBlogs,
  getAllBlogs,
  getBlogById,
  togglePublished,
} from "../controllers/blog.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.route("/create-blog").post(verifyJWT, upload.single("image"), addBlog);

router.route("/all").get(getAllBlogs);

router.route("/get-blog/:id").get(getBlogById);

router.route("/delete-blog/:id").delete(verifyJWT, deleteBlogById);

router.route("/admin").get(verifyJWT, getAdminBlogs);

router.route("/ispublished").patch(verifyJWT, togglePublished);

export default router;
