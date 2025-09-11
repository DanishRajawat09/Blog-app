import ms from "ms";
import { Admin } from "../models/admin.model.js";
import { emailRegex } from "../utils/regex.js";
import { cookieOptions } from "../utils/cookieOptions.js";

export const registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !emailRegex.test(email)) {
      throw new Error("Email is Required, please provide valid email");
    }
    if (!password) {
      throw new Error("password is required");
    }

    const existedAdmin = await Admin.findOne({ email: email });

    if (existedAdmin) {
      throw new Error(
        "Admin is Already Existed, With same email please login or register with another email"
      );
    }

    const admin = await Admin.create({ email: email, password: password });

    if (!admin) {
      throw new Error("Server Error , while creating admin");
    }

    const { accessToken, refreshToken } = await generateTokens(admin._id);

    if (!accessToken || !refreshToken) {
      throw new Error("error: could not generate tokens ");
    }
    const accessCookieOption = await cookieOptions("JWT_ACCESSTOKEN_EXPIRY");
    const refreshCookieOption = await cookieOptions("JWT_REFRESHTOKEN_EXPIRY");

    if (!accessCookieOption) {
      throw new Error("access cookie opion not found");
    }
    if (!refreshCookieOption) {
      throw new Error("refresh cookie opion not found");
    }
    res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOption)
      .cookie("refreshToken", refreshToken, refreshCookieOption)
      .json({ message: "user register successfully", data: admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !emailRegex.test(email)) {
      throw new Error("Enter valid email for login");
    }
    if (!password) {
      throw new Error("Password is required");
    }

    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      throw new Error("admin not found , register first");
    }
    const isPasswordCorrect = await admin.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new Error("incorrect password , try again");
    }

    const { accessToken, refreshToken } = await generateTokens(admin._id);

    if (!accessToken || !refreshToken) {
      throw new Error("could not generate tokens");
    }

    const accessCookieOption = await cookieOptions("JWT_ACCESSTOKEN_EXPIRY");
    const refreshCookieOption = await cookieOptions("JWT_REFRESHTOKEN_EXPIRY");

    if (!accessCookieOption) {
      throw new Error("access cookie opion not found for login");
    }
    if (!refreshCookieOption) {
      throw new Error("refresh cookie opion not found for login");
    }

    res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOption)
      .cookie("refreshToken", refreshToken, refreshCookieOption)
      .json({ message: "user log in successfull", data: admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
