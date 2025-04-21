import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaUsers, FaSignOutAlt, FaList, FaBox, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../Context/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, userName, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Kiểm tra quyền admin
  if (!isLoggedIn || !isAdmin) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <FaHome className="text-gray-400 group-hover:text-white mr-3" />
    },
    {
      path: '/admin/orders',
      name: 'Quản lý đơn hàng',
      icon: <FaShoppingBag className="text-gray-400 group-hover:text-white mr-3" />
    }
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-indigo-950 lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <span className="text-white text-xl font-semibold">Shop Admin</span>
          </div>
          <button 
            onClick={closeSidebar}
            className="text-gray-300 hover:text-white focus:outline-none focus:text-white lg:hidden"
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="mt-10">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-6 py-3 text-gray-300 ${isActive ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-900'} group`
              }
              onClick={closeSidebar}
            >
              {item.icon}
              <span className="mx-3">{item.name}</span>
            </NavLink>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 text-gray-300 hover:bg-indigo-900 group"
          >
            <FaSignOutAlt className="text-gray-400 group-hover:text-white mr-3" />
            <span className="mx-3">Đăng xuất</span>
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="text-gray-500 focus:outline-none lg:hidden"
              >
                <FaBars />
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <span className="text-sm font-medium text-gray-700">
                  Xin chào, {userName}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;