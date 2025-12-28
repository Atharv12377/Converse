import React, { useState } from "react";
import Dummyimage from "../assets/ConverseLogo1.PNG";
function DropdownMenu() {
  const [showDropdown, setShowDropDown] = useState(false);
  return (
    <div className="w-15 bg-red-500 rounded-full h-15 relative">
      <div className="h-full w-full rounded-full ">
        <img
          src={Dummyimage}
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
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Logout
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default DropdownMenu;
