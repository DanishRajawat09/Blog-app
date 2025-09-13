import React from "react";

import { Outlet, useNavigate } from "react-router";
import Sidebar from "../../components/adminComponents/Sidebar";

const Layout = () => {
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
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
