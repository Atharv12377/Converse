import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useConversationStore = create(
    devtools((set) => ({
        activeConversation: null,

        setActiveConversation: (conversation) =>
            set(
                { activeConversation: conversation },
                false,
                "conversation/setActive"
            ),

        clearActiveConversation: () =>
            set(
                { activeConversation: null },
                false,
                "conversation/clearActive"
            ),
    }))
);

export default useConversationStore;
