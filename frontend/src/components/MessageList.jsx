import React, { useRef, useEffect } from 'react'
import MessageBox from './MessageBox'

const MessageList = ({ messages, loading }) => {
  // Ref for scrolling to bottom
  const bottomRef = useRef(null);

  // Scroll to bottom only when a new message is added (not on every render)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);  // Only trigger when count changes

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
            ))}
            {/* Invisible element to scroll to */}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageList