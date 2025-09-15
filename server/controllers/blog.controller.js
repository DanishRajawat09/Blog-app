import { throwError } from "../utils/errorHelper.js";
import fs from "fs";
import imagekit from "../config/imagekit.config.js";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
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

    const adminBlogs = await Blog.find({ author: userId }).sort({
      createdAt: -1,
    });

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

export const togglePublished = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      throwError("could not get id for toggle published", 404);
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      throwError("cannot find blog by this id", 404);
    }

    blog.isPublished = !blog.isPublished;
    await blog.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ message: "blog isPublished value is change", success: true });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    if ([blog, name, content].some((item) => !item)) {
      throwError("blog, name, content, is required", 400);
    }
    const blogData = await Blog.findById(blog);
    if (!blogData) {
      throwError("Blog not found", 404);
    }

    const comment = await Comment.create({
      blog,
      name,
      content,
      blogAuthor: blogData.author,
    });

    if (!comment) {
      throwError("could not create Comment in database, try again", 500);
    }

    res
      .status(200)
      .json({ message: "Comment added for review", success: true });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    if (!blogId) {
      throwError("plz provide the blog id", 402);
    }

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    if (comments.length === 0) {
      res.status(200).json({ message: "No Cmments" });
    }

    res.status(200).json({
      success: true,
      message: "get all comments of this blog",
      comments: comments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getAllAdminComments = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      throwError("UnAuthorized Request, cannot get adminId", 401);
    }
    const comments = await Comment.find({ blogAuthor: userId })
      .populate("blog")
      .sort({ createdAt: -1 });

    if (!comments || comments.length === 0) {
      throwError("No comments found on your blogs", 404);
    }

    res.status(200).json({ message: "get admin comments", comments: comments });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
