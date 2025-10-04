import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";
const Navbar = () => {
  const { navigate, admin } = useAppContext();
  console.log(admin);

  return (
    <div className="flex justify-between items-center py-5 mx-4 sm:mx-20 xl:mx-32">
      <p className="text-primary text-4xl max-sm:text-3xl  font-bold">D-BLOG</p>
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 max-sm:px-6  py-2.5"
      >
        {admin.email ? "Dashboard" : "Login"}
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
    </div>
  );
};

export default Navbar;
