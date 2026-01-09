import React, { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

function SearchBar() {
  const user = useAuthStore((state) => state.user);

  const [query, setQuery] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [searchList, setSearchList] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const handleCreateConversation = async(secondParticipantUserId) => {
    try {
      const secondParticipant = secondParticipantUserId
      const res = await axios.post(
        `${BACKEND_URL}/messages/createConversation`,
        { secondParticipant},
        { withCredentials: true }
      );
      console.log(res)
      if(res.status === 201 || res.status === 200){
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
    <div className="h-15 relative flex bg-gray-200 rounded-xl items-center p-3">

      <input
        type="text"
        placeholder="Search by name"
        className="h-full bg-transparent w-full rounded-xl p-3 text-lg font-semibold outline-none"
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
        className="cursor-pointer text-red-500 transition-transform duration-150 hover:scale-110"
        onClick={handleSearchUser}
      />
    
      {showUser && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
          {searchList.length === 0 ? (
            <p className="p-3 text-gray-500 text-center">
              No users found
            </p>
          ) : (
            searchList.map((u) => (
              <div
                key={u._id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                onClick={()=>{
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
