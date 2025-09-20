import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import toast from "react-hot-toast";

const Signp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [username, setUsername] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const { axios, setLoading, navigate } = useAppContext();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usernameSuccess) {
        setLoading(false);
        setLoading(true);
        const { data } = await axios.post("/api/v1/admin/register", {
          email,
          username,
          password,
        });
        data.success
          ? toast.success("registerd")
          : toast.error("something went wrong");

        if (data.success === true) {
          navigate("/");
        }
      } else {
        toast.error("error please enter proper user name");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!username) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/username", {
          params: { username },
        });
        setUsernameError(!data.success);
        setUsernameSuccess(data.success);
      } catch (error) {
        toast.error(error.message);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Admin</span>Register
            </h1>
            <p className="font-light">
              Enter your credentials to access he admin panel
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            <div className="flex flex-col">
              <label htmlFor="">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="Your email id"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>
            <div className="flex mb-6 flex-col">
              <label
                htmlFor=""
                className={`${usernameError ? "text-red-500" : ""}`}
              >
                User Name
              </label>
              <div className="flex items-center">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  required
                  placeholder="Your username"
                  className={`${
                    usernameError
                      ? "border-b-2 border-red-500 p-2 outline-none  flex-1"
                      : "border-b-2 border-gray-300 p-2 outline-none  flex-1"
                  }`}
                />
                {typeof usernameError === "boolean" && (
                  <p
                    className={
                      usernameError ? "text-red-500" : "text-green-500"
                    }
                  >
                    {usernameError ? "✕" : "✓"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                required
                placeholder="Your password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signp;
