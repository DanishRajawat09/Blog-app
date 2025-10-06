import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { assets } from "../assets/assets";
import Moment from "moment";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const Blog = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [data, setData] = useState(null);
  const [commets, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`);

      data.success ? setData(data.data) : toast.error("something went wrong");
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong");
      }
    }
  };
  const fetchComments = async () => {
    try {
      const { data } = await axios.post("/api/v1/blog/comments", {
        blogId: id,
      });
      data.success ? setComments(data.comments) : setComments(data.comments);
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong");
      }
    }
  };
  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/blog/add-comment", {
        blog: id,
        name,
        content,
      });

      if (data.success) {
        toast.success("Comment added");
        setName("");
        setContent("");
      } else {
        toast.error("error while adding comment");
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
    fetchBlogData();
    fetchComments();
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
          {data?.author?.username}
        </p>
      </div>
      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} alt={data.title} className="rounded-3xl mb-5" />
        <div
          className="rich-text max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>

        {/* COMMENTS SECTION */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({commets.length})</p>
          <div className="flex flex-col gap-4">
            {commets.map((item, index) => (
              <div
                className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
                key={index}
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="userIcon" className="w-6" />
                  <p className="font-medium">{item.name}</p>
                </div>
                <p className="text-sm max-w-md ml-8">{item.content}</p>
                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Add Comments Section */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>
          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              required
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />
            <textarea
              placeholder="Comment"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="w-full p-2 border border-gray-300 rounded outline-none h-48"
              required
            ></textarea>
            <button
              className="bg-primary text-white rounded p-2 px-8 hover:scale-105 transition-all cursor-pointer"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
        {/* Share Buttons */}
        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex">
            <img src={assets.facebook_icon} alt="facebook icon" />
            <img src={assets.twitter_icon} alt="twitter icon" />
            <img src={assets.googleplus_icon} alt="google icon" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default Blog;
