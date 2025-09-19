import { Admin } from "../models/admin.model.js";
import { emailRegex } from "../utils/regex.js";
import { cookieOptions } from "../utils/cookieOptions.js";
import { throwError } from "../utils/errorHelper.js";
import { generateTokens } from "../utils/generateTokens.js";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";

export const adminData = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      throwError("Unauthorized Request login r register first", 401);
    }

    const adminInfo = await Admin.findById(_id);
    if (!adminInfo) {
      throwError("user not found, register first", 401);
    }
    res
      .status(200)
      .json({ success: true, message: "got admin info", adminInfo });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
export const registerAdmin = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    if (!email || !emailRegex.test(email)) {
      throwError("Email is required. Please provide a valid email.", 400);
    }

    if (!username) {
      throwError("UserName is required,", 400);
    }

    if (!password) {
      throwError("Password is required.", 400);
    }

    const existedAdmin = await Admin.findOne({ email, username });
    if (existedAdmin) {
      throwError(
        "Admin already exists with this email. Please login instead.",
        409
      );
    }

    const admin = await Admin.create({ email, password, username });
    if (!admin) {
      throwError("Server error while creating admin.", 500);
    }

    const { accessToken, refreshToken } = await generateTokens(admin._id);
    if (!accessToken || !refreshToken) {
      throwError("Could not generate tokens.", 500);
    }

    const accessCookieOption = await cookieOptions("JWT_ACCESSTOKEN_EXPIRY");
    const refreshCookieOption = await cookieOptions("JWT_REFRESHTOKEN_EXPIRY");
    if (!accessCookieOption)
      throwError("Access cookie options not found.", 500);
    if (!refreshCookieOption)
      throwError("Refresh cookie options not found.", 500);

    res
      .status(201)
      .cookie("accessToken", accessToken, accessCookieOption)
      .cookie("refreshToken", refreshToken, refreshCookieOption)
      .json({
        success: true,
        message: "Admin registered successfully",
        data: admin,
      });
  } catch (error) {
    console.log(error.message);
    console.log(error);

    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const checkUserName = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      console.log(req.query);

      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    // findOne is faster than find for a single match
    const admin = await Admin.findOne({ username });

    if (admin) {
      return res.status(200).json({
        success: false,
        message: "Username is already taken",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !emailRegex.test(email)) {
      throwError("Please enter a valid email to login.", 400);
    }

    if (!password) {
      throwError("Password is required.", 400);
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throwError("Admin not found. Please register first.", 404);
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throwError("Incorrect password. Please try again.", 401);
    }

    const { accessToken, refreshToken } = await generateTokens(admin._id);
    if (!accessToken || !refreshToken) {
      throwError("Could not generate tokens.", 500);
    }

    const accessCookieOption = await cookieOptions("JWT_ACCESSTOKEN_EXPIRY");
    const refreshCookieOption = await cookieOptions("JWT_REFRESHTOKEN_EXPIRY");
    if (!accessCookieOption)
      throwError("Access cookie options not found.", 500);
    if (!refreshCookieOption)
      throwError("Refresh cookie options not found.", 500);

    res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOption)
      .cookie("refreshToken", refreshToken, refreshCookieOption)
      .json({ message: "Admin logged in successfully", data: admin });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const adminLogout = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throwError("User ID not found, cannot log out", 400);
    }

    const admin = await Admin.findById(userId);
    if (!admin) {
      throwError("Cannot find your account for logout", 400);
    }

    const accessCookieOption = cookieOptions("JWT_ACCESSTOKEN_EXPIRY");
    const refreshCookieOption = cookieOptions("JWT_REFRESHTOKEN_EXPIRY");

    if (!accessCookieOption) throwError("Access cookie options not found", 500);
    if (!refreshCookieOption)
      throwError("Refresh cookie options not found", 500);

    res
      .clearCookie("accessToken", accessCookieOption)
      .clearCookie("refreshToken", refreshCookieOption)
      .status(200)
      .json({ message: "Logout successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throwError("Unauthorized Request, cannot get admin Id", 401);
    }
    const recentBlog = await Blog.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!recentBlog) {
      throwError("error while getting recent blogs", 500);
    }

    const blogs = await Blog.countDocuments({ author: userId });

    const comments = await Comment.countDocuments({ blogAuthor: userId });

    const draft = await Blog.countDocuments({
      author: userId,
      isPublished: false,
    });

    const dashBoardData = {
      blogs,
      comments,
      draft,
      recentBlog,
    };

    res.status(200).json({ message: "Dashboard Data", dashBoardData });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    if (!commentId) {
      throwError("could not get BlogId ", 402);
    }
    if (!userId) {
      throwError("Unauthorized Request, cannot get admin Id", 401);
    }

    const deleteComment = await Comment.findOneAndDelete({
      _id: commentId,
      blogAuthor: userId,
    });

    if (!deleteComment) {
      throwError("could not delete the comment, try again", 500);
    }

    res.status(200).json({ message: "comment is deleted" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const approvedCommentByID = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    if (!commentId) {
      throwError("could not get BlogId ", 402);
    }
    if (!userId) {
      throwError("Unauthorized Request, cannot get admin Id", 401);
    }

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, blogAuthor: userId },
      { isApproved: true }
    );

    if (!comment) {
      throwError("could not update is approved , try again", 500);
    }
    res
      .status(200)
      .json({ message: "comment isApproved property wil be true" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const resetAccessToken = async (req, res) => {
  try {
    const id = req.user._id;
    if (!id) {
      throwError("could not get admin Id, try again", 400);
    }
    const { accessToken, refreshToken } = await generateTokens(id);

    if (!accessToken || !refreshToken) {
      throw new Error("error: could not generate tokens ");
    }

    const accessCookieOption = await cookieOptions("JWT_ACCESSTOKEN_EXPIRY");
    const refreshCookieOption = await cookieOptions("JWT_REFRESHTOKEN_EXPIRY");

    res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOption)
      .cookie("refreshToken", refreshToken, refreshCookieOption)
      .json({ success: true, message: "token updated" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
