import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { assets, blog_data } from "../assets/assets";
import Moment from "moment";
import Navbar from "../components/Navbar";
const Blog = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const fetchBlogData = async () => {
    const data = blog_data.find((item) => item._id === id);

    setData(data);
  };

  useEffect(() => {
    fetchBlogData();
  }, []);
  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt="gradientBackground"
        className="absolute -top-50 -z-10 opacity-50"
      />
      <Navbar />
      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createAt).format("MMMM Do YYYY")}
        </p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800 ">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          Danish
        </p>
      </div>
      <div className="">

      </div>
    </div>
  ) : (
    <div>Loading..</div>
  );
};

export default Blog;
