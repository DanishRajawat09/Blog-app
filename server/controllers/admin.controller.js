import { Admin } from "../models/admin.model.js";
import { emailRegex } from "../utils/regex.js";
import { cookieOptions } from "../utils/cookieOptions.js";
import { throwError } from "../utils/errorHelper.js";
import { generateTokens } from "../utils/generateTokens.js";

export const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !emailRegex.test(email)) {
      throwError("Email is required. Please provide a valid email.", 400);
    }

    if (!password) {
      throwError("Password is required.", 400);
    }

    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) {
      throwError(
        "Admin already exists with this email. Please login instead.",
        409
      );
    }

    const admin = await Admin.create({ email, password });
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
      .json({ message: "Admin registered successfully", data: admin });
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
      throwError(400, "User ID not found, cannot log out");
    }

    const admin = await Admin.findById(userId);
    if (!admin) {
      throwError(400, "Cannot find your account for logout");
    }

    const accessCookieOption = cookieOptions("JWT_ACCESSTOKEN_EXPIRY");
    const refreshCookieOption = cookieOptions("JWT_REFRESHTOKEN_EXPIRY");

    if (!accessCookieOption) throwError(500, "Access cookie options not found");
    if (!refreshCookieOption)
      throwError(500, "Refresh cookie options not found");

    res
      .clearCookie("accessToken", accessCookieOption)
      .clearCookie("refreshToken", refreshCookieOption)
      .status(200)
      .json({ message: "Logout successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
