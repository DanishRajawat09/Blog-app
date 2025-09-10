import ms from "ms";
import { Admin } from "../models/admin.model.js";
import { emailRegex } from "../utils/regex.js";

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

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: ms(process.env.JWT_ACCESSTOKEN_EXPIRY),
        sameSite: "none",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: ms(process.env.JWT_REFRESHTOKEN_EXPIRY),
        sameSite: "none",
      })
      .json({ message: "user register successfully", data: admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
