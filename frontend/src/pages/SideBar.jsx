import React from "react";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { useEffect } from "react";
import useConversationListStore from "../store/useConversationListStore";
import ListCard from "../components/ListCard";

function SideBar() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const setChats = useConversationListStore((state) => state.setChats)
  const Chats = useConversationListStore((state) => state.chats)
  const fetchChats = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/messages/chats`, { withCredentials: true })
      console.log(res)
      setChats(res.data.Chats || []);
    }
    catch (error) {
      console.log(error.message)
    }

  }
  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <div className="h-full w-full bg-white p-3 flex flex-col ">
      <SearchBar />
      <div className="h-full flex-1 mt-2 rounded-2xl bg-gradient-to-b from-indigo-100 to-indigo-200 p-3 overflow-y-auto space-y-2">
        {Chats?.length === 0 ? (<div className="h-full w-full flex justify-center items-center">
          <p className="text-gray-400 font-medium text-lg">
            Start Chatting !
          </p>
        </div>) : (
          Chats?.map((c) => <ListCard key={c._id} chats={c} />)
        )
        }
      </div>
    </div>
  );
}

export default SideBar;
