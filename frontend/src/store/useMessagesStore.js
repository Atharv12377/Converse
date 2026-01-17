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
//THis messaeg store is dn. Now -
//1) Create a messagebox component. Call the send message api in the Chat page component.