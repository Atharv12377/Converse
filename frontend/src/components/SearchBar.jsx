import React, { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import useConversationListStore from "../store/useConversationListStore";

function SearchBar() {
  const user = useAuthStore((state) => state.user);
  const updateChat = useConversationListStore((state) => state.updateChat)
  const [query, setQuery] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [searchList, setSearchList] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const handleCreateConversation = async (secondParticipantUserId) => {
    try {
      const secondParticipant = secondParticipantUserId
      const res = await axios.post(
        `${BACKEND_URL}/messages/createConversation`,
        { secondParticipant },
        { withCredentials: true }
      );
      updateChat(res.data.conversation)
      console.log(res)
      if (res.status === 201 || res.status === 200) {
        setQuery("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchUser = async () => {
    const words = query.trim().split(/\s+/);
    const firstName = words[0] || "";
    const lastName = words[1] || "";

    if (!firstName) return; //This means if no word was written just return dont execute the fxn ahead 

    try {
      const res = await axios.post(
        `${BACKEND_URL}/messages/search`,
        { firstName, lastName },
        { withCredentials: true }
      );
      console.log(res);
      setSearchList(res.data.userData || []);
    } catch (err) {
      setSearchList([]);
    } finally {
      setShowUser(true);
    }
  };

  return (
    <div className="h-15 relative flex bg-white rounded-xl items-center p-3 shadow-sm border border-gray-100">

      <input
        type="text"
        placeholder="Search by name"
        className="h-full bg-transparent w-full rounded-xl p-3 text-lg font-medium outline-none placeholder:text-gray-400"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowUser(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearchUser();
        }}
      />

      <Search
        size={28}
        className="cursor-pointer text-indigo-500 transition-all duration-150 hover:scale-110 hover:text-indigo-600"
        onClick={handleSearchUser}
      />

      {showUser && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50">
          {searchList.length === 0 ? (
            <p className="p-3 text-gray-500 text-center">
              No users found
            </p>
          ) : (
            searchList.map((u) => (
              <div
                key={u._id}
                className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors duration-150"
                onClick={() => {
                  handleCreateConversation(u._id);
                  setShowUser(false)
                }}
              >
                <p className="font-semibold">
                  {u.firstName} {u.lastName}
                </p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
