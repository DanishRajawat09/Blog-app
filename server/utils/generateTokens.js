import { Admin } from "../models/admin.model.js";

export const generateTokens = async (id) => {
  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      throwError("couldn't find Account for session", 500);
    }

    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefreshToken();

    if (!accessToken || !refreshToken) {
            throwError("error: could not sessions", 500);
    }

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};
