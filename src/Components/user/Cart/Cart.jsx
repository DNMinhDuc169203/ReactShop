import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaMinus, FaPlus, FaUserCircle } from 'react-icons/fa';
import { useCart } from '../../../Context/CartContext';
import { useAuth } from '../../../Context/AuthContext';
import cartService from '../../../Services/Cart/cart';
import CartItem from './CartItem';

const Cart = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isLoggedIn, userName, user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    note: ''
  });

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = () => {
    // Lưu đường dẫn hiện tại để redirect sau khi đăng nhập
    localStorage.setItem('cart_redirect_path', '/cart');
    navigate('/login');
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }

    if (cartItems.length === 0) {
      setError('Giỏ hàng trống, vui lòng thêm sản phẩm vào giỏ hàng.');
      return;
    }

    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Tạo đơn hàng
      const orderData = {
        user_id: user?.id || 1, // Lấy từ thông tin người dùng đã đăng nhập
        fullname: shippingInfo.fullName,
        email: "",
        phone_number: shippingInfo.phoneNumber,
        address: shippingInfo.address,
        note: shippingInfo.note,
        status: "PENDING",
        total_money: totalPrice
      };

      const orderResponse = await cartService.createOrder(orderData);
      
      // Tạo chi tiết đơn hàng cho từng sản phẩm
      for (const item of cartItems) {
        const orderDetailData = {
          order_id: orderResponse.id,
          product_id: item.id,
          price: item.price,
          number_of_products: item.quantity,
          total_money: item.price * item.quantity
        };
        
        await cartService.createOrderDetail(orderDetailData);
      }

      // Xóa giỏ hàng sau khi đặt hàng thành công
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Hiển thị thông báo đặt hàng thành công
  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
          </p>
          <button
            onClick={handleContinueShopping}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Giỏ hàng của bạn</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-6">Giỏ hàng của bạn đang trống.</p>
          <button
            onClick={handleContinueShopping}
            className="flex items-center justify-center mx-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
          >
            <FaArrowLeft className="mr-2" /> Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin đơn hàng</h2>
              
              <div className="mb-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm):</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {!isLoggedIn ? (
                <div className="border-t pt-4 mb-4">
                  <div className="text-center p-4">
                    <FaUserCircle className="text-6xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">
                      Vui lòng đăng nhập để tiếp tục thanh toán
                    </p>
                    <button
                      onClick={handleLogin}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Thông tin giao hàng */}
                  <div className="border-t pt-4 mb-4">
                    <h3 className="font-bold text-gray-800 mb-3">Thông tin giao hàng</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingInfoChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={shippingInfo.phoneNumber}
                          onChange={handleShippingInfoChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Địa chỉ giao hàng <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingInfoChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Ghi chú
                        </label>
                        <textarea
                          name="note"
                          value={shippingInfo.note}
                          onChange={handleShippingInfoChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Nút đặt hàng */}
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 