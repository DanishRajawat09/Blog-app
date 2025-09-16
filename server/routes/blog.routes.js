import { Router } from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  getAdminBlogs,
  getAllAdminComments,
  getAllBlogs,
  getBlogById,
  getBlogComments,
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

// comments route
router.route("/add-comment").post(verifyJWT, addComment);

router.route("/comments").get(getBlogComments);

router.route("/admin-comments").get(verifyJWT, getAllAdminComments);
export default router;
