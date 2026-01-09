import React from "react";
import useAuthStore from "../store/useAuthStore";

function ListCard({ chats }) {
  const user = useAuthStore((state) => state.user);
  const loggedInUserId = user._id;

  const participant = chats.participants.find(
    (p) => p._id !== loggedInUserId
  );

  return (
    <div
      className="
        h-16 sm:h-20
        w-full
        bg-white
        rounded-xl
        p-2 sm:p-3
        flex items-center
        gap-3 sm:gap-5
        hover:bg-gray-100
        cursor-pointer
        transition-colors
      "
    >

      <div
        className="
          h-10 w-10 sm:h-12 sm:w-12
          rounded-full
          bg-red-100
          flex items-center justify-center
          flex-shrink-0
        "
      >
        <p className="text-lg sm:text-2xl font-semibold">
          {participant?.firstName?.[0]}
        </p>
      </div>


      <div className="min-w-0">
        <p className="text-sm sm:text-base font-medium truncate">
          {participant?.firstName} {participant?.lastName}
        </p>
      </div>
    </div>
  );
}

export default ListCard;
