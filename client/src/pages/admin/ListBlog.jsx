import React, { useState } from "react";
import { useEffect } from "react";
import BlogTableItem from "../../components/adminComponents/BlogTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const { axios, fetchBlog } = useAppContext();
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/v1/blog/admin");
      if (data.success) {
        setBlogs(data.data);
        await fetchBlog();
      } else {
        toast.error("could not get admin blogs");
      }
    } catch (error) {
        if (error.response.status >= 400 && error.response.status < 500) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong");
      }
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <h1>All blogs</h1>
      <div className="relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-500 ">
          <thead className="text-xs text-gray-600 text-left uppercase">
            <tr>
              <th scope="col" className="px-2 py-4 xl:px-6">
                {" "}
                #{" "}
              </th>
              <th scope="col" className="px-2 py-4 ">
                {" "}
                Blog Title{" "}
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                {" "}
                Date{" "}
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                {" "}
                Status{" "}
              </th>
              <th scope="col" className="px-2 py-4 ">
                {" "}
                Actions{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <BlogTableItem
                key={blog._id}
                blog={blog}
                fetchBlogs={fetchBlogs}
                index={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
