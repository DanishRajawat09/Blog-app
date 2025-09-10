import { Admin } from "../models/admin.model.js";

export const generateTokens = async (id) => {
  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      throw new Error("cannot generate token , couldn't find Account ");
    }

    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error("error: could not generate tokens ");
    }

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};
