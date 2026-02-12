import React, { useContext } from 'react'
import {UserContext} from '../../context/UserContext'
import Navbar from './Navbar';
import SideMenu from './SideMenu';
const DashboardLayout = ({ children, active }) => {
    const { user } = useContext(UserContext);

    
  return (
    <div className='min-h-screen'>
        <Navbar />
        {user &&(
           <div className='flex'>
            <div className='max-[1080px]:hidden w-64 fixed left-0 top-[61px] h-[calc(100vh-61px)] z-20'>
              <SideMenu />
            </div>
            <div className='grow ml-0 max-[1080px]:ml-0 lg:ml-64 mx-5 p-4'>
              {children}
            </div>
           </div>
        )}
    </div>
  )
}

export default DashboardLayout