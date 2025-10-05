import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { axios } = useAppContext();

  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const deleteBlog = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirm) {
      return;
    }
    try {
      const { data } = await axios.delete(
        `/api/v1/blog/delete-blog/${blog._id}`
      );

      if (data.success) {   
        toast.success("blog deleted successfully");
        await fetchBlogs();
      } else {
        toast.error("error while deleting blog");
      }
    } catch (error) {
    if (error.response.status >= 400 && error.response.status < 500) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong");
      }
    }
  };

  const togglePublished = async () => {
    try {
      const { data } = await axios.patch("/api/v1/blog/ispublished", {
        id: blog._id,
      });
      if (data.success) {
        await fetchBlogs();
      } else {
        toast.error("error while deleting blog");
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
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4 "> {title} </td>
      <td className="px-2 py-4 max-sm:hidden"> {BlogDate.toDateString()} </td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button
          onClick={togglePublished}
          className="border px-2 py-0.5 mt-1 rounded cursor-pointer"
        >
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>
        <img
          onClick={deleteBlog}
          src={assets.cross_icon}
          alt=""
          className="w-8 hover:scale-110 transition-all cursor-pointer"
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
