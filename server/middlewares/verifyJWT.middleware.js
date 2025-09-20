import { Admin } from "../models/admin.model.js";
import { throwError } from "../utils/errorHelper.js";
import jwt from "jsonwebtoken";
const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

console.log(token);

    if (!token) {
      throwError("Unauthorized Request, login first", 401);
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESSTOKEN_SECRET);
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

    req.user = admin;
    next();
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
export default verifyJWT;
