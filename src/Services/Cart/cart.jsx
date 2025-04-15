import axios from 'axios';

const API_BASE_URL = 'http://localhost:8088/api/v1';

const cartService = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để đặt hàng');
      }

      const response = await axios.post(
        `${API_BASE_URL}/orders`, 
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Không thể tạo đơn hàng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Thêm chi tiết đơn hàng
  createOrderDetail: async (orderDetailData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để đặt hàng');
      }

      const response = await axios.post(
        `${API_BASE_URL}/order_details`, 
        orderDetailData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Không thể thêm chi tiết đơn hàng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Lấy đơn hàng theo user
  getOrdersByUser: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để xem đơn hàng');
      }

      const response = await axios.get(
        `${API_BASE_URL}/orders/user/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Không thể lấy danh sách đơn hàng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để xem chi tiết đơn hàng');
      }

      const response = await axios.get(
        `${API_BASE_URL}/order_details/order/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Không thể lấy chi tiết đơn hàng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  }
};

export default cartService; 