import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../../Services/Auth/auth.jsx'

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    retypePassword: '',
    dateOfBirth: '',
    address: '',
    roleId: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.retypePassword) {
      setError('Mật khẩu không khớp');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      
      if (response) {
        // Đăng ký thành công, chuyển hướng đến trang đăng nhập
        navigate('/login');
      }
    } catch (error) {
      setError(error.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng Ký</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Họ và Tên:</label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required 
            placeholder="Nhập họ và tên"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Số Điện Thoại:</label>
          <input 
            type="tel" 
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required 
            placeholder="Nhập số điện thoại"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email:</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
            placeholder="Nhập email của bạn"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Mật khẩu:</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required 
            placeholder="Nhập mật khẩu"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Nhập lại mật khẩu:</label>
          <input 
            type="password" 
            name="retypePassword"
            value={formData.retypePassword}
            onChange={handleChange}
            required 
            placeholder="Nhập lại mật khẩu"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Ngày sinh:</label>
          <input 
            type="date" 
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Địa chỉ:</label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleChange}
            required 
            placeholder="Nhập địa chỉ của bạn"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>
        <p className="text-gray-600 text-sm mt-4 text-center">
          Đã có tài khoản? <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập ngay</Link>
        </p>
      </form>
    </div>
  </div>
  )
}

export default Register
