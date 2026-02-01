import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import useConversationStore from "../store/useConversationStore";
import useAuthStore from "../store/useAuthStore";
import useMessageStore from "../store/useMessagesStore";
import MessageList from "../components/MessageList";
import  { getSocket } from "../socket";
import Preview from "../components/Preview";



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
  const [isTyping, setIsTyping] = useState("");
  const typingTimeoutRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
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
    if (!conversationId) return;

    if (conversationId) {
      setMessages([]); // We do this to clear the old msg before fetching new ones to avoid the stale old msgs in local storage which will 
      // conflict with the socket adding new messages.
      fetchMessages();
      const socket = getSocket();
      if (!socket) {
        console.warn("Socket Not Connected");
        return;
      }
      socket.emit("joinRoom", conversationId);

      socket.on("receiveMessage", (newMessage) => {
        addMessage(newMessage);
      });

      socket.on("userTyping", (data) => {
        if (data.isTyping) {
          setIsTyping(`${data.firstName} ${data.lastName} is Typing ...`)
        } else {
          setIsTyping("")  // Clear when they stop typing
        }
      })

      return () => {
        socket.emit("leaveRoom", conversationId);
        socket.off("receiveMessage");
        socket.emit("stopTyping", {
          conversationId: conversationId,
          firstName: "",
          lastName: ""
        })
      }
    }
  }, [BACKEND_URL, conversationId, setMessages]);

  const handleFileChange = (e) =>{
    const file = e.target.files[0];
    if(file){
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file))
    }
  }
  const handleSendMessage = async () => {
    const formdata = new FormData() //-> Form data contianer bana diya then -
    if(message.trim()){
      formdata.append("textMessage", message);
    }
  
    if(selectedFile){
      formdata.append("image", selectedFile)
    }
    try {
      const res = await axios.post(
        `${BACKEND_URL}/messages/send/${conversationId}`,
        
          formdata
        ,
        { withCredentials: true }
      );
      setSelectedFile(null)
      setPreview(null)
      const savedMessage = res.data.message;
      console.log(savedMessage);


      const socket = getSocket();
      if (socket) {
        socket.emit("sendMessage", {
          conversationId,
          message: savedMessage
        });
      }
      setMessage("");
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
          {/* this is the logo of the name */}
        </div>
        <p className="ml-3 text-lg font-semibold text-white flex flex-col">
          {participant
            ? `${participant.firstName} ${participant.lastName}`
            : "Select a chat"}
          <span className="text-sm">
          {isTyping}
        </span>
        </p>
      </div>
      {
        preview ? <Preview preview = {preview} setPreview = {setPreview} setSelectedFile = {setSelectedFile}/> : <MessageList messages={messages} loading={loading} />
      }
  
      {/* Message Input - Placeholder for now */}
      <div className="h-16 bg-white border-t border-gray-100 flex items-center px-4 gap-3">
        <input type="file" id="imageInput" accept="image/jpeg, image/png, image/webp" style={{display: "none"}} onChange={handleFileChange}/>
        <button className="text-2xl h-10  hover:h-12  transition-all " onClick={()=> document.getElementById("imageInput").click()}>
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
            const socket = getSocket();
            if (!socket) return

            // Emit typing
            socket.emit("typing", {
              conversationId: conversationId,
              firstName: user.firstName,
              lastName: user.lastName
            })

            // Clear previous timeout
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }

            // Set new timeout - emit stopTyping after 2 seconds of no typing. AGAR 2 sec me no one typed anything that is nothing changed then emit the stop typing event. 
            typingTimeoutRef.current = setTimeout(() => {
              socket.emit("stopTyping", {
                conversationId: conversationId,
                firstName: user.firstName,
                lastName: user.lastName
              })
            }, 2000);
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
