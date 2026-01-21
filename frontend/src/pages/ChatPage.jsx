import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useConversationStore from "../store/useConversationStore";
import useAuthStore from "../store/useAuthStore";
import useMessageStore from "../store/useMessagesStore";
import MessageList from "../components/MessageList";




const ChatPage = () => {
  const messages = useMessageStore((state) => state.messages)
  const setMessages = useMessageStore((state) => state.setMessages);
  const addMessage = useMessageStore((state) => state.addMessage);
  const { conversationId } = useParams();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const user = useAuthStore((state) => state.user);
  const activeConversation = useConversationStore(
    (state) => state.activeConversation
  );

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  // Get the other participant's name
  const myEmail = user?.email;
  const participant = activeConversation?.participants?.find(
    (p) => p.email !== myEmail
  );
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/messages/getMessages/${conversationId}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setMessages(res.data.messages || [])
    } catch (error) {
      console.log("Error fetching messages:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      fetchMessages();

     

      // return() => clearInterval(interval);
    }
  }, [BACKEND_URL, conversationId, setMessages]);

    // setInterval(() => {
    //     fetchMessages();
    //   }, 2000)


  const handleSendMessage = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/messages/send/${conversationId}`,
        {
          textMessage: message,
        },
        { withCredentials: true }
      );
      console.log(res.data)
      addMessage(res.data.message)
    } catch (error) {
      console.log(error);
    }
  };
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
      <MessageList messages={messages} loading={loading} />

      {/* Message Input - Placeholder for now */}
      <div className="h-16 bg-white border-t border-gray-100 flex items-center px-4 gap-3">
        <button className="text-2xl h-10  hover:h-12  transition-all ">
          {" "}
          +{" "}
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 h-10 px-4 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            console.log(message)
          }}
        />
        <button
          className="h-10 px-6 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-colors"
          onClick={() => {
            handleSendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
