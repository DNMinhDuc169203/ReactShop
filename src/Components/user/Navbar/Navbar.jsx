import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaDumbbell, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";
import { useAuth } from "../../../Context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar bg-gray-100 text-black">
      {/* Desktop navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full mr-3"
              src="https://cdn.pixabay.com/photo/2023/03/06/20/57/barbell-7834315_1280.jpg"
              alt="Gym Logo"
            />
            <span className="font-bold text-xl">FitnessPro</span>
          </div>

          {/* Desktop menu items */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded hover:bg-gray-700 transition">Trang chủ</Link>
            <Link to="/trainers" className="px-3 py-2 rounded hover:bg-gray-700 transition">Dụng cụ</Link>
            <Link to="/pricing" className="px-3 py-2 rounded hover:bg-gray-700 transition">Bảng giá</Link>
            <Link to="/contact" className="px-3 py-2 rounded hover:bg-gray-700 transition">Liên hệ</Link>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Xin chào, {userName}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
                  Đăng nhập
                </Link>
                <Link to="/register" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-black focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-700 px-2 pt-2 pb-4">
          <Link to="/" className="block px-3 py-2 rounded text-white hover:bg-gray-600 transition mb-1">
            Trang chủ
          </Link>
          <Link to="/classes" className="block px-3 py-2 rounded text-white hover:bg-gray-600 transition mb-1">
            Lớp học
          </Link>
          <Link to="/trainers" className="block px-3 py-2 rounded text-white hover:bg-gray-600 transition mb-1">
            Dụng Cụ
          </Link>
          <Link to="/pricing" className="block px-3 py-2 rounded text-white hover:bg-gray-600 transition mb-1">
            Bảng giá
          </Link>
          <Link to="/contact" className="block px-3 py-2 rounded text-white hover:bg-gray-600 transition mb-1">
            Liên hệ
          </Link>
          <div className="mt-4 flex flex-col space-y-2">
            {isLoggedIn ? (
              <>
                <span className="text-white text-center mb-2">Xin chào, {userName}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-center flex items-center justify-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition text-center">
                  Đăng nhập
                </Link>
                <Link to="/register" className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition text-center">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
