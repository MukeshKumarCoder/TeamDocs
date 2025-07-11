import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { token } = useSelector((state) => state.user);
  return (
    <div className="w-full flex justify-center bg-amber-100 h-[calc(100vh-3.5rem)]">
      <div className="w-11/12 h-full flex flex-col gap-y-4 items-center">
        <h1 className="font-extrabold text-4xl mt-7 italic">
          Hey there, welcome to TeamDoc! 📚
        </h1>
        <p className="text-2xl font-bold">
          Start writing, share with your team, and keep everyone aligned.
        </p>
        <p className="font-bold text-xl">Your docs, your way.</p>
        {token && (
          <div className="flex justify-center items-center gap-x-5">
            <Link
              to={"/document"}
              className="bg-amber-300 py-2 px-3 rounded-md font-bold text-xl"
            >
              📄 My Documents
            </Link>
            <Link
              to={"/document/create"}
              className="bg-green-400 py-2 px-3 rounded-md font-bold text-gray-100 text-xl"
            >
              📝 Create Document
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
