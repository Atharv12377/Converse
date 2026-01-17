import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useConversationStore from "../store/useConversationStore";
import useAuthStore from "../store/useAuthStore";

const ChatPage = () => {
    const { conversationId } = useParams();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const user = useAuthStore((state) => state.user);
    const activeConversation = useConversationStore(
        (state) => state.activeConversation
    );

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get the other participant's name
    const myEmail = user?.email;
    const participant = activeConversation?.participants?.find(
        (p) => p.email !== myEmail
    );

    // Fetch messages when conversationId changes
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${BACKEND_URL}/messages/getMessages/${conversationId}`,
                    { withCredentials: true }
                );
                console.log(res.data)
                setMessages(res.data.messages || []);
            } catch (error) {
                console.log("Error fetching messages:", error.message);
            } finally {
                setLoading(false);
            }
        };

        if (conversationId) {
            fetchMessages();
        }
    }, [conversationId]);

    const handleSendMessage = async () =>{
        try {
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="h-full w-full flex flex-col bg-white">
            {/* Header - Shows participant name */}
            <div className="h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center px-4 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <p className="text-lg font-semibold text-white">
                        {participant?.firstName?.[0] || null}
                    </p>
                </div>
                <p className="ml-3 text-lg font-semibold text-white">
                    {participant
                        ? `${participant.firstName} ${participant.lastName}`
                        : "Select a chat"}
                </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400 text-lg">
                            Send the first message 👋
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col-reverse gap-2">
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`max-w-[70%] p-3 rounded-xl ${msg.senderId === user?._id
                                    ? "self-end bg-indigo-500 text-white"
                                    : "self-start bg-white shadow-sm"
                                    }`}
                            >
                                <p>{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Input - Placeholder for now */}
            <div className="h-16 bg-white border-t border-gray-100 flex items-center px-4 gap-3">
                <button className="text-2xl h-10  hover:h-12  transition-all "> + </button>
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 h-10 px-4 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                />
                <button className="h-10 px-6 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-colors">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;