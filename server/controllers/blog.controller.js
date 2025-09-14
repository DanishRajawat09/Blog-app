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

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });

    if (blogs.length === 0) {
      return res.status(200).json({
        message: "No blogs for now",
        data: [],
      });
    }

    res.status(200).json({
      message: "Getting blogs successfully",
      data: blogs,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throwError("blog id not found", 400);
    }

    const blog = await Blog.findById({ _id: id });

    if (!blog) {
      throwError("give me a valid id for blog", 500);
    }
    res
      .status(200)
      .json({ message: "get blog by id successfully", data: blog });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      throwError("blog id is not found", 400);
    }

    if (!userId) {
      throwError("Unauthorized Request, cannot delete blog", 401);
    }

    const deletedBlog = await Blog.deleteOne({ _id: id, author: userId });

    if (deletedBlog.deletedCount === 0) {
      throwError("Blog not found or could not be deleted", 404);
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

 export const getAdminBlogs = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      throwError("Unauthorized Request, login first", 401);
    }

    const adminBlogs = await Blog.find({ author: userId });

    if (adminBlogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this admin" });
    }

    res.status(200).json({
      message: "get admin blogs successfully",
      data: adminBlogs,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};


export const togglePublished = async (req ,res) => {
  try {
    
  } catch (error) {
    
  }
}