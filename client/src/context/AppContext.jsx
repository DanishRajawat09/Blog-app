import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry &&  !originalRequest.url.includes("/api/v1/admin/reset-tokens")) {
      originalRequest._retry = true;

      try {
        // refresh token request (cookies sent automatically)
        await axios.post("/api/v1/admin/reset-tokens");

        // retry the original request
        return axios(originalRequest);
      } catch (err) {
        // refresh failed → redirect to login
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchBlog = async () => {
    try {
      const { data } = await axios.get("/api/v1/blog/all");
      data.success ? setBlogs(data.blogs) : toast.error("do not have blogs");
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchAdminInfo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/admin/info");
      data.success && setAdmin(data.adminInfo);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchAdminInfo();
  }, []);

  const value = {
    navigate,
    blogs,
    axios,
    setBlogs,
    input,
    setInput,
    admin,
    setAdmin,
    fetchAdminInfo,
    fetchBlog,
    loading,
    setLoading,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(AppContext);
};
