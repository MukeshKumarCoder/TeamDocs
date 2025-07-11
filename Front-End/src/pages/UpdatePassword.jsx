import axios from "axios";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = location.pathname.split("/").at(-1);
      const res = await axios.post(
        `http://localhost:8080/api/auth/reset-password/${token}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Password Reset Successfully");
      navigate("/login");
    } catch (error) {
      console.log("err", error);
      toast.error("Failed To Reset password");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-3.5rem)] bg-amber-100">
      <div className="max-w-[500px] p-4 lg:p-8 bg-amber-200 rounded-md">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-black">
          Choose new password
        </h1>
        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-black">
          Almost done. Enter your new password and you're all set.
        </p>
        <form onSubmit={handleOnSubmit}>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-black">
              New Password <sup className="text-black">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full p-2 border border-amber-500 outline-none rounded mb-4"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-[8px] bg-amber-300 py-[12px] px-[12px] font-medium text-black"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between">
          <Link to="/login">
            <p className="flex items-center gap-x-2 text-richBlack-5">
              <BiArrowBack /> Back To Login
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
