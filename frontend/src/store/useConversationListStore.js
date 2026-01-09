import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useConversationListStore = create(
  devtools(
    persist(
      (set) => ({
        chats: [],

        setChats: (chats) =>
          set(
            { chats },
            false,
            "conversation/setChats"
          ),

        updateChat: (updatedChat) =>
          set(
            (state) => {
              const filteredChats = state.chats.filter(
                (chat) => chat._id !== updatedChat._id
              );

              return {
                chats: [updatedChat, ...filteredChats],
              };
            },
            false,
            "conversation/updateChat"
          ),

        clearChats: () =>
          set(
            { chats: [] },
            false,
            "conversation/clearChats"
          ),
      }),
      {
        name: "conversation-list-store",
      }
    )
  )
);

export default useConversationListStore;
