import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful!");
    navigate("/");
    window.location.reload();
  };
  return (
    <header className="w-full h-14 flex justify-center items-center bg-amber-200 ">
      <nav className="w-11/12 flex justify-between">
        <NavLink to={"/"}>
          <h1 className="lg:text-3xl text-2xl font-bold italic w-fit">
            TeamDoc
          </h1>
        </NavLink>
        <ul className="flex gap-x-6 items-center font-bold">
          <NavLink to={"/"}>
            {" "}
            <li>Home</li>
          </NavLink>
          {token ? (
            <NavLink to={"/login"}>
              {" "}
              <li
                className="bg-amber-300 hover:bg-amber-400 py-2 px-4 rounded-md text-xl italic"
                onClick={handleLogout}
              >
                Logout
              </li>
            </NavLink>
          ) : (
            <NavLink to={"/login"}>
              {" "}
              <li className="bg-amber-300 hover:bg-amber-400 py-2 px-4 rounded-md text-xl italic">
                Login
              </li>
            </NavLink>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
