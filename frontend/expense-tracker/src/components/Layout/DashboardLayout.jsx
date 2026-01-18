import React, { useContext } from 'react'
import {UserContext} from '../../context/UserContext'
import Navbar from './Navbar';
import SideMenu from './SideMenu';
const DashboardLayout = ({ children, active }) => {
    const { user } = useContext(UserContext);

    
  return (
    <div className=''>
        <Navbar />
        {user &&(
           <div className='flex'>
            <div className='max-[1080px]:hidden'>
              <SideMenu />
            </div>
            <div className='grow mx-5 '>
              {children}
            </div>
           </div>
        )}
    </div>
  )
}

export default DashboardLayout