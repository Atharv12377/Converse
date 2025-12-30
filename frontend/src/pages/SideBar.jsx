import React from "react";
import SearchBar from "../components/SearchBar";

function SideBar() {

  return (
    <div className="h-full w-full bg-white p-3 flex flex-col ">
      <SearchBar/>
      <div className="h-full flex-1 mt-2 rounded-2xl bg-indigo-200">
        ChatList
      </div>
    </div>
  );
}

export default SideBar;
