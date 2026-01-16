import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useConversationStore = create(
    devtools(
        persist(
            (set) => ({
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

            }
            ), { name: "conversation-store" }
        )
    ),
);

export default useConversationStore;
