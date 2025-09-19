import { Admin } from "../models/admin.model.js";
import { throwError } from "../utils/errorHelper.js";
import jwt from "jsonwebtoken";
const refreshJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throwError("Unauthorized Request, login first", 401);
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESHTOKEN_SECRET);
    } catch (error) {
      throwError("cannot decode token, user is Unauthorized", 401);
    }

    if (!decoded || !decoded._id) {
      throwError("cannot decode properly", 400);
    }

    const admin = await Admin.findById(decoded._id);

    if (!admin) {
      throwError("admin not found, register first", 404);
    }
    if (admin.refreshToken !== token) {
      throwError("Refresh token mismatch. Please login again", 401);
    }

    req.user = admin;
    next();
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
export default refreshJWT;
