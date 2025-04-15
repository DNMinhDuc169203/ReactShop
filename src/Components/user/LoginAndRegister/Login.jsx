import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../../Services/Auth/auth.jsx';
import { useAuth } from '../../../Context/AuthContext';
import { useCart } from '../../../Context/CartContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToCart } = useCart();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    roleId: 1 // Mặc định roleId là 1 (user)
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy trang redirect sau khi đăng nhập (nếu có)
  const from = location.state?.from || localStorage.getItem('cart_redirect_path') || '/';

  // Xử lý sản phẩm đang chờ thêm vào giỏ hàng (nếu có)
  useEffect(() => {
    const handlePendingProduct = () => {
      const pendingProductStr = localStorage.getItem('pending_product');
      if (pendingProductStr) {
        try {
          const { product, quantity } = JSON.parse(pendingProductStr);
          if (product && quantity) {
            // Sẽ thêm vào giỏ hàng sau khi đăng nhập
            localStorage.removeItem('pending_product');
          }
        } catch (error) {
          console.error('Error parsing pending product:', error);
          localStorage.removeItem('pending_product');
        }
      }
    };

    handlePendingProduct();
  }, []);

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

    // Kiểm tra dữ liệu đầu vào
    if (!formData.phoneNumber || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(
        formData.phoneNumber, 
        formData.password,
        formData.roleId
      );
      
      if (response) {
        // Lấy thông tin user sau khi đăng nhập thành công
        const userDetails = await authService.getUserDetails();
        // Cập nhật trạng thái đăng nhập trong context
        login(userDetails);

        // Xử lý sản phẩm đang chờ sau khi đăng nhập
        const pendingProductStr = localStorage.getItem('pending_product');
        if (pendingProductStr) {
          try {
            const { product, quantity } = JSON.parse(pendingProductStr);
            if (product && quantity) {
              addToCart(product, quantity);
              localStorage.removeItem('pending_product');
            }
          } catch (error) {
            console.error('Error adding pending product to cart:', error);
          }
        }

        // Xóa đường dẫn redirect
        localStorage.removeItem('cart_redirect_path');
        
        // Chuyển hướng đến trang trước đó hoặc trang chính
        navigate(from);
      }
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng Nhập</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Số Điện Thoại:</label>
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required 
              placeholder="Nhập số điện thoại của bạn"
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
              placeholder="Nhập mật khẩu của bạn"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
          <p className="text-gray-600 text-sm mt-4 text-center">
            Bạn chưa có tài khoản? <Link to="/register" className="text-blue-500 hover:underline">Đăng ký ngay</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
