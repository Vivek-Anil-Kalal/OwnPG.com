import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout, setLoggedInUser } from "../state/userSlice";

const Navbar = ({ isTopOfPage, setIsActive, isActive }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userRed)
  const dispatch = useDispatch();


  // states
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userProfile")));
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

  const navbarBackground = isTopOfPage ? "" : "backdrop-blur-sm bg-white/30 drop-shadow";

  const logout = () => {
    // dispatch({ type: LOGOUT });
    dispatch(setLogout());
    navigate("/");

    setUser(null);
  };


  // useEffect(() => {
  //   setUser(JSON.parse(localStorage.getItem("userProfile")))
  //   setToken(JSON.parse(localStorage.getItem("token")))

  //   console.log(user);
  //   console.log(token)
  //   dispatch(setLoggedInUser({ user, token }))

  //   if (token) {
  //     const decodedToken = jwtDecode(token);

  //     if (decodedToken.exp * 1000 < new Date().getTime()) logout();
  //   }

  //   //JWT
  //   setUser(JSON.parse(localStorage.getItem("userProfile")));
  // },[]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userProfile")));
    setToken(JSON.parse(localStorage.getItem("token")));
  }, []);

  useEffect(() => {
    dispatch(setLoggedInUser({ user, token }));

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
  }, [dispatch, user, token]);


  const menuItems = ["Home", "Guide", "Suggest Me", "My Profile"];
  return (
    <div className={`fixed top-0 w-full ${navbarBackground} h-20 flex z-40 items-center justify-between px-8 pb-2`}>
      <div
        className="logo text-[#05386B] text-3xl font-medium cursor-pointer"
        onClick={() => navigate("/")}
      >
        OwnPG.com
      </div>
      <div className="navItems w-2/5">
        <ul className="flex items-center justify-between">
          {menuItems.map((item, index) => {
            return (
              <li className={`text-xl tracking-wider font-bold text-${item.toLowerCase() === isActive ? 'white' : '[#05386B]'} cursor-pointer hover:scale-110 hover:font-bold`}
                onClick={() => {
                  setIsActive(`${item.toLowerCase().replace(" ", "")}`)
                  navigate(`/${item === 'Home' ? '' : item.toLowerCase().replace(" ", "")}`);
                }
                }
                key={index}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
      <div
        className="authBtn flex items-center justify-end px-8 py-2 rounded-lg bg-[#002B5C] hover:scale-110 transition ease-in-out delay-150 cursor-pointer"
        onClick={() => navigate("/auth")}
      >
        <p className="text-white">
          {userData.user ? userData?.user.name : "Login/Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default Navbar;
