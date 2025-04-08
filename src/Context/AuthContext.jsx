import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../Services/Auth/auth.jsx';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        try {
          const userDetails = await authService.getUserDetails();
          setUserName(userDetails.fullname || "Người dùng");
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Nếu có lỗi khi lấy thông tin user, coi như chưa đăng nhập
          setIsLoggedIn(false);
          setUserName("");
        }
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  const login = async (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.fullname || "Người dùng");
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout, isLoading }}>
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