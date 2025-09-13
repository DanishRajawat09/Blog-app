import { Router } from "express";
import { addBlog } from "../controllers/blog.controller";
import upload from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.route("/create-blog").post(verifyJWT, upload.single("image"), addBlog);

export default router;
