import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import DefaultLogo from "../assets/DefaultLogo.jpg"
function DropdownMenu() {
  const logout = useAuthStore((state) => state.logout)
    const user = useAuthStore((state)=> state.user)
  const [showDropdown, setShowDropDown] = useState(false);
  const navigate = useNavigate()
  
  const handleLogOut = async() =>{
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    const res = await axios.get(`${BACKEND_URL}/auth/logout`, {withCredentials:true})
    logout()
    console.log(res)
    navigate("/login")
  }
  return (
    <div className="w-15 bg-red-500 rounded-full h-15 relative">
      <div className="h-full w-full rounded-full ">
        <img
          src={user?.photoUrl?.length ===0 ?  DefaultLogo : user?.photoUrl}
          alt=""    
          className="rounded-full "
          onClick={() => {
            if (showDropdown === false) {
              setShowDropDown(true);
            } else {
              setShowDropDown(false);
            }
          }}
        />
      </div>
      {showDropdown ? (
        <div className="absolute  top-full right-0 mt-4 w-40 bg-white shadow-lg rounded-md">
          <ul className="flex flex-col">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{
                handleLogOut()
            }}>
              Logout
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default DropdownMenu;
