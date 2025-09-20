import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/appContext.jsx";
const Navbar = () => {
  const { navigate, admin } = useAppContext();
  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <p className="text-primary text-4xl font-bold">D-BLOG</p>
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
      >
        {admin.email ? "Dashboard" : "Login"}
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
    </div>
  );
};

export default Navbar;
