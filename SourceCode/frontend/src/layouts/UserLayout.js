import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Home from '../pages/user/Home'
import Footer from '../components/footer/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '50px' }}>
        <Outlet />
      </div>
      <Footer />
    </>

  )
}

export default UserLayout