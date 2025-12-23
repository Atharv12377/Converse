import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'

export const ChatLayout = () => {
  return (
    <div>ChatLayout
        {/* This page is the main layout, like the body component, and other component render inside it. This will also contain the sidebar component which will show our chats on the left side. And in outlet we will get the chat window of every user according to their conversation ID */}
        
        <SideBar>
        </SideBar>
        <Outlet>
        </Outlet>


    </div>

  )
}
