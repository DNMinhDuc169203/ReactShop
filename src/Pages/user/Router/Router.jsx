import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext';

import Navbar from '../../../Components/user/Navbar/Navbar'

import HomePage from '../HomePage/HomePage'
import Login from '../../../Components/Login'
import Register from '../../../Components/user/LoginAndRegister/Register'
import ProductDetail from '../../../Components/user/Product/ProductDetail'
import Cart from '../../../Components/user/Cart/Cart'
import Product from '../../../Components/user/Product/Product'

const AppRouter = () => {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Product />} />
        <Route path="/trainers" element={<Product />} />
      </Routes>
    </div>
  )
}

export default AppRouter