import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import authService from '../Services/Auth/auth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState(1); // Default: 1 = user, 2 = admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!phoneNumber || !password) {
      setError('Vui lòng nhập đầy đủ số điện thoại và mật khẩu');
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      // Gọi API login
      const response = await authService.login(phoneNumber, password, roleId);
      
      // Lấy thông tin user sau khi đăng nhập thành công
      const userDetails = await authService.getUserDetails();
      
      // Cập nhật context
      await login(userDetails, roleId);
      
      // Redirect dựa vào vai trò
      if (roleId === 2) {
        // Nếu là admin, chuyển đến trang quản trị
        navigate('/admin/orders');
      } else {
        // Nếu là user thường, chuyển về trang chủ hoặc trang giỏ hàng nếu có redirect
        const redirectPath = localStorage.getItem('cart_redirect_path') || '/';
        localStorage.removeItem('cart_redirect_path');
        navigate(redirectPath);
      }
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
          <p className="mt-2 text-gray-600">Nhập thông tin đăng nhập của bạn</p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Lựa chọn vai trò */}
          <div className="flex gap-4 mb-4">
            <button 
              type="button"
              className={`flex-1 py-2 px-4 rounded-md border ${roleId === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => setRoleId(1)}
            >
              Người dùng
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 px-4 rounded-md border ${roleId === 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => setRoleId(2)}
            >
              Quản trị viên
            </button>
          </div>
          
          {/* Số điện thoại */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
          
          {/* Mật khẩu */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mật khẩu"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Nút đăng nhập */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
          
          {/* Liên kết đăng ký */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 