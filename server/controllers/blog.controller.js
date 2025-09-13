import { throwError } from "../utils/errorHelper.js";
import fs from "fs";
import imagekit from "../config/imagekit.config.js";
import { Blog } from "../models/blog.model.js";
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = req.body;

    const userId = req.user?._id;

    const imageFile = req.file;

    if ([title, description, category].some((item) => !item)) {
      throwError("Fill all the required fields", 400);
    }

    if (!userId) {
      throwError("Unauthorized Request, check you are login or not", 401);
    }
    if (!imageFile) {
      throwError("Image file is required", 400);
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    if (!fileBuffer) {
      throwError("error while buffer the file", 400);
    }
    // upload image to imageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    if (!response) {
      throwError("error while upload the image on imageKit", 500);
    }

    // optimization through imagekit URL transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });
    if (!optimizedImageUrl) {
      throwError("error while creating URL in imageKit", 500);
    }
    const image = optimizedImageUrl;

    const blog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
      author: userId,
    });
    if (!blog) {
      throwError("could not create blog, database error", 500);
    }

    res.status(200).json({
      success: true,
      message: "Blog Created SuccessFully",
      data: blog,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
