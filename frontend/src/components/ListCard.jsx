import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useConversationStore from "../store/useConversationStore";
import axios from "axios";

function ListCard({ chats }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setActiveConversation = useConversationStore(
    (state) => state.setActiveConversation
  );
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const userId = user?.userId;
  const participant = chats.participants.find((p) => p._id !== userId);

  const handleClick = async () => {
    const res = await axios.post(`${BACKEND_URL}/messages/createConversation`,
      { secondParticipant: participant?._id },
      { withCredentials: true });
    console.log(res);
    // Save this conversation as active
    setActiveConversation(res.data.conversation);
    // Navigate to the chat page
    navigate(`/chat/${res.data.conversation._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="h-16 sm:h-20 w-full bg-white rounded-xl p-2 sm:p-3 flex items-center gap-3 sm:gap-5 hover:bg-gray-50 hover:shadow-md cursor-pointer transition-all duration-200"
    >
      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <p className="text-lg sm:text-2xl font-semibold text-white">
          {participant?.firstName?.[0] || "?"}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-sm sm:text-base font-medium truncate">
          {participant
            ? `${participant.firstName} ${participant.lastName}`
            : "Loading..."}
        </p>
      </div>
    </div>
  );
}

export default ListCard;
