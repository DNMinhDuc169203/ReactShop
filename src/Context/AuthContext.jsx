import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../Services/Auth/auth.jsx';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        try {
          const userDetails = await authService.getUserDetails();
          setUserName(userDetails.fullname || "Người dùng");
          setUser(userDetails);
          // Kiểm tra vai trò admin
          setIsAdmin(userDetails.role_id === 2);
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Nếu có lỗi khi lấy thông tin user, coi như chưa đăng nhập
          setIsLoggedIn(false);
          setUserName("");
          setUser(null);
          setIsAdmin(false);
        }
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  const login = async (userData, roleId = 1) => {
    setIsLoggedIn(true);
    setUserName(userData.fullname || "Người dùng");
    setUser(userData);
    setIsAdmin(roleId === 2);
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserName("");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, user, login, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 