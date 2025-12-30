import React, { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

function SearchBar() {
const user = useAuthStore((state)=> state.user)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showUser, setShowUser] = useState(false);
  const [searchList , setSearchList] = useState([])
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const handleSearchUser = async () => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/messages/search`,
      { firstName, lastName },
      { withCredentials: true }
    );

    setSearchList(res.data.userData || []);
  } catch (err) {
    // when user not found / 404 / 400
    setSearchList([]);
  } finally {
    setShowUser(true); // 👈 ALWAYS open dropdown
    setFirstName("");
    setLastName("");
  }
};

  return (
    <div className="h-15 relative flex bg-gray-200 rounded-xl justify-center items-center p-3">
        <input
          type="text"
          className="h-full bg-gray-200 w-full rounded-xl p-3 py-4 text-lg font-semibold outline-red-50"
          
          onChange={(e)=>{
            setShowUser(false)
            const str = e.target.value
            const words = str.trim().split(/\s+/) 
            if(words.length === 1){
              setFirstName(str)
            }
            else{
              setFirstName(words[0])
              setLastName(words[1])
            }
            console.log(firstName, lastName)
          }}
        />
        <Search
          color="red"
          size={32}
          className="pl-1 cursor-pointer transition-transform duration-150 hover:scale-110"
          onClick={()=>{
            handleSearchUser()
          }}
        />
        {showUser === true ? <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
          {searchList.length === 0 ? (
            <p className="p-3 text-gray-500 text-center">
              No users found 
            </p>
          ) : (
            searchList.map((u) => (
              <div
                key={u._id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
              >
                <p className="font-semibold">
                  {u.firstName} {u.lastName}
                </p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            ))
          )}
        </div> : null}
      </div>
  )
}

export default SearchBar