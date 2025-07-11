import axios from "axios";
import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgatPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("err", error);
      toast.error("Failed To Send Reset Email");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-3.5rem)] bg-amber-100">
      <div className="max-w-[500px] p-4 lg:p-8 bg-amber-200 rounded-md">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-black">
          {!emailSent ? "Reset your password" : "Check email"}
        </h1>
        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-black">
          {!emailSent
            ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery"
            : `We have sent the reset email to ${email}`}
        </p>
        <form onSubmit={handleOnSubmit}>
          {!emailSent && (
            <label className="w-full">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-black">
                Email Address <sup className="text-black">*</sup>
              </p>
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full p-2 border border-amber-500 outline-none rounded mb-4"
              />
            </label>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-[8px] bg-amber-300 py-[12px] px-[12px] font-medium text-black"
          >
            {!emailSent ? "Submit" : "Resend Email"}
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

export default ForgatPassword;
