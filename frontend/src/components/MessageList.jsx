import React from 'react'
import MessageBox from './MessageBox'

const MessageList = ({ messages, loading }) => {
  return (
    <div className=' flex-1 overflow-y-auto '>
      <div className="h-full w-full p-4 bg-gray-50">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-lg">Send the first message 👋</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <MessageBox key={msg._id} msg={msg} />
              //   <div
              //     key={msg._id}
              //     className={`max-w-[70%] p-3 rounded-xl ${
              //       msg.senderId === user?._id
              //         ? "self-end bg-indigo-500 text-white"
              //         : "self-start bg-white shadow-sm"
              //     }`}
              //   >
              //     <p>{msg.message}</p>
              //   </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageList