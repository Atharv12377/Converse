import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useMessageStore = create(
    devtools(
        persist(
            (set) => ({
                messages: [],
                setMessages: (messages) => set({ messages: messages }),
                addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
                clearMessages: () => set({ messages: [] })
            }),
            { name: "Message-Store" }
        )
    )
)
export default useMessageStore;