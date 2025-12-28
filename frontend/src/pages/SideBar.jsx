import React from 'react'
import {Search} from "lucide-react"
function SideBar() {
  return (
    <div className='h-full w-full bg-white p-3 flex flex-col '>
      <div  className='h-15  flex bg-gray-200 rounded-xl justify-center items-center p-3'>
        <input type="text" className='h-full bg-gray-200 w-full rounded-xl p-3 py-4 text-lg font-semibold outline-red-50' />
        <Search color='red' size={32} className='pl-1 hover: ov'/>
      </div>

      <div className='h-full flex-1 mt-2 rounded-2xl bg-indigo-200'>
        ChatList
      </div>
    </div>
  )
}

export default SideBar