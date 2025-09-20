import { Outlet } from "react-router";
import Sidebar from "../../components/adminComponents/Sidebar";
import { useAppContext } from "../../context/appContext";
import toast from "react-hot-toast";

const Layout = () => {
  const { axios, navigate } = useAppContext();
  const logout = async () => {
    try {
      const { data } = await axios.post("/api/v1/admin/logout");

      data.success
        ? toast.success("admin logout")
        : toast.error("something went wrong");
      data.success && navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
        <p className="text-primary text-4xl font-bold">D-BLOG</p>
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
