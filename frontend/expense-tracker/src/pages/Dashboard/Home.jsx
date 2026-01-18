import React from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth';

const Home = () => {
  useUserAuth();

  return (
    <DashboardLayout active="Dashboard">
      <div className='my-5 mx-auto'>Homnbnm,e</div>
    </DashboardLayout>
  )
}

export default Home