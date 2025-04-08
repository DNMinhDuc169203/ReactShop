import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Navbar from '../../../Components/user/Navbar/Navbar'

import HomePage from '../HomePage/HomePage'
import Login from '../../../Components/user/LoginAndRegister/Login'
import Register from '../../../Components/user/LoginAndRegister/Register'

const AppRouter = () => {
  return (
    
      <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    
  )
}

export default AppRouter