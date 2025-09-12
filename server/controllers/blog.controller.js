import { throwError } from "../utils/errorHelper.js";
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } =
      req.body?.blog;

    const userId = req.user?._id;

    const imageFile = req.file;

    if ([title, description, category, imageFile].some((item) => !item)) {
      throwError("Fill all the required fields", 400);
    }

    if (!userId) {
      throwError("Unauthorized Request, check you are login or not");
    }
  } catch (error) {}
};
