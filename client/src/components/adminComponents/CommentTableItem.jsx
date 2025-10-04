import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const apprevedComment = async () => {
    try {
      const { data } = await axios.patch(
        `/api/v1/admin/approved-comment/${_id}`
      );

      if (data.success) {
        fetchComments();
      } else {
        toast.error(data.message || "Something Went Wrong");
      }
    } catch (error) {
       if (error.response.status >= 400 && error.response.status < 500) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong");
      }
    }
  };
  const notApprevedComment = async () => {
    try {
      const { data } = await axios.patch(
        `/api/v1/admin/not-approved-comment/${_id}`
      );

      if (data.success) {
        fetchComments();
      } else {
        toast.error(data.message || "Something Went Wrong");
      }
    } catch (error) {
          if (error.response.status >= 400 && error.response.status < 500) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong");
      }
    }
  };
  const deleteComment = async () => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (!confirm) return;

      const { data } = await axios.delete(
        `/api/v1/admin/delete-comment/${_id}`
      );

      if (data.success) {

        toast.success("comment is deleted");
        fetchComments();
      } else {
        toast.error(data.message || "Something Went Wrong");
      }
    } catch (error) {
         if (error.response.status >= 400 && error.response.status < 500) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong");
      }
    }
  };

  return (
    <tr className="order-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {comment.content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
              onClick={apprevedComment}
              src={assets.tick_icon}
              className="w-5 hover:scale-110 transition-all cursor-pointer"
            />
          ) : (
            <img
              src={assets.cross_icon}
              onClick={notApprevedComment}
              className="w-8 hover:scale-110 transition-all cursor-pointer"
            ></img>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt=""
            className="w-5 hover:scale-110 transition-all cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
