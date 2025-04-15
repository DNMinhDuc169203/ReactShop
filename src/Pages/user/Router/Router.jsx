import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Navbar from '../../../Components/user/Navbar/Navbar'

import HomePage from '../HomePage/HomePage'
import Login from '../../../Components/user/LoginAndRegister/Login'
import Register from '../../../Components/user/LoginAndRegister/Register'
import ProductDetail from '../../../Components/user/Product/ProductDetail'
import Cart from '../../../Components/user/Cart/Cart'
import Product from '../../../Components/user/Product/Product'

const AppRouter = () => {
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
          <Route path="/trainers" element={<Product />} /> {/* Assuming "trainers" is also a product page */}
        </Routes>
      </div>
    
  )
}

export default AppRouter