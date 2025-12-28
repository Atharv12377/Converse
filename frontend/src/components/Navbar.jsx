import React from 'react'
import logo from "../assets/ConverseLogo2-removebg-preview.png";
import DropdownMenu from './DropdownMenu';
function Navbar() {
  
  return (
    <div className='w-full h-full flex justify-between items-center'>
      <div className='w-1/12 bg-transparent'>
        <img src= {logo} className='h-full w-full' />
      </div>
      <div>
        <DropdownMenu/> 
      </div>
    </div>
  )
}

export default Navbar