import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../redux/userSlice";
import { Link } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      currentState === "Login"
        ? "https://teamdocs-backend.onrender.com/api/auth/login"
        : "https://teamdocs-backend.onrender.com/api/auth/register";

    try {
      const res = await axios.post(url, userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (currentState === "Login") {
        const userData = res.data.user;
        const token = res.data.refreshToken;

        dispatch(login({ user: userData, token }));
        toast.success("Login Successful");
        setUserData({
          name: "",
          email: "",
          password: "",
        });
        navigate("/");
      } else {
        toast.success("Signup successful! Please login.");
        setUserData({
          email: "",
          password: "",
          name: "",
        });
        setCurrentState("Login");
      }
    } catch (error) {
      console.log("err", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-3.5rem)] bg-amber-100">
      <div className="flex flex-col items-center justify-center w-1/3 bg-amber-200 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{currentState}</h1>
        <div>
          {currentState === "Login" ? (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                required
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full p-2 border border-amber-500 outline-none rounded mb-4"
              />
              <input
                type="password"
                placeholder="Password"
                value={userData.password}
                required
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                className="w-full p-2 border border-amber-500 outline-none rounded mb-4"
              />
              <button
                type="submit"
                className="w-full p-2 bg-amber-300 hover:bg-amber-400 cursor-pointer text-black rounded"
              >
                Login
              </button>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-black border-b border-blue-600">
                  Don't have an account?{" "}
                  <span
                    onClick={() => setCurrentState("Sign Up")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Login
                  </span>
                </p>
                <Link to="/forgot-password">
                  <p className="mt-1 ml-auto max-w-max text-xs text-blue-600 border-b border-blue-600 pb-[1px] ">
                    Forgot Password
                  </p>
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                required
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="w-full p-2 border border-amber-300 outline-none rounded mb-4"
              />
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                required
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full p-2 border border-amber-300 outline-none rounded mb-4"
              />
              <input
                type="password"
                placeholder="Password"
                value={userData.password}
                required
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                className="w-full p-2 border border-amber-300 outline-none rounded mb-4"
              />
              <button
                type="submit"
                className="w-full p-2 bg-amber-300 hover:bg-amber-400 cursor-pointer text-black rounded"
              >
                Sign Up
              </button>
              <p className="mt-4 text-sm text-black">
                Already have an account?{" "}
                <span
                  onClick={() => setCurrentState("Login")}
                  className="text-blue-600 cursor-pointer"
                >
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
