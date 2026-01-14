import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Navbar from "../components/Navbar";

export const ChatLayout = () => {
  return (
    <div className="h-screen w-full min-w-md bg-gray-50 flex flex-col">
      <div className="h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 flex justify-center items-center shadow-md">
        <Navbar />
      </div>
      {/* This page is the main layout, like the body component, and other component render inside it. This will also contain the sidebar component which will show our chats on the left side. And in outlet we will get the chat window of every user according to their conversation ID */}
      <div className="h-full flex flex-1 w-full bg-gray-50">
        <div className="h-full w-1/3 ">
          <SideBar></SideBar>
        </div>
        <div className="flex-1 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
