import React from "react";
import useAuthStore from "../store/useAuthStore";

const MessageBox = ({ msg }) => {
  const user = useAuthStore((state) => state.user);

  // senderId can be string or obj id
  const senderId =
    typeof msg.senderId === "string" ? msg.senderId : msg.senderId?._id;
//backend se userId aa rahi hai not _id remmenmber it
  const isMe = senderId === user?.userId;

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`min-h-fit max-w-[85%] md:max-w-[70%] rounded-2xl p-2 md:p-3 text-base md:text-lg ${isMe
        ? 'bg-indigo-500 text-white rounded-br-sm'
        : 'bg-gray-200 text-gray-800 rounded-bl-sm'
        }`}>
        {msg.type === "image" ? (
          <img
            src={msg.imageUrlCloudinary}
            alt="sent image"
            className="max-w-full rounded-lg"
          />
        ) : (
          <p>{msg.message}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
