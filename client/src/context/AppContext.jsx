import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [admin  , setAdmin] = useState([])
const [loading , setLoading] = useState(false)
  const fetchBlog = async () => {
    try {
      const { data } = await axios.get("/api/v1/blog/all");
      data.success ? setBlogs(data.blogs) : toast.error("do not have blogs");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAdminInfo = async() => { 
    try {
      setLoading(false)
      setLoading(true)
      const {data} = await axios.get("/api/v1/admin/info")
      data.success && setAdmin(data.adminInfo)
      setLoading(false) 
    } catch (error) {
      toast.error(error.message)
    }
   }

  useEffect(() => {
    fetchBlog();
    fetchAdminInfo()
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
  loading,
  setLoading
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(AppContext);
};
