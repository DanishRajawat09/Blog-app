import { Link, Outlet } from "react-router";
import Sidebar from "../../components/adminComponents/Sidebar";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Layout = () => {
  const { axios, navigate, fetchAdminInfo, fetchBlog } = useAppContext();
  const logout = async () => {
    try {
      const { data } = await axios.post("/api/v1/admin/logout");

      if (data.success) {
        toast.success("admin logout");
        await fetchAdminInfo();
        await fetchBlog();
        navigate("/");
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
        <Link to="/" className="text-primary text-4xl font-bold">
          D-BLOG
        </Link>
        <button
          onClick={logout}
          className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="flex h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
