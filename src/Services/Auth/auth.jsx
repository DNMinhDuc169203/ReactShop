import axios from 'axios';

const API_BASE_URL = 'http://localhost:8088/api/v1';

const authService = {
  // Đăng ký người dùng
  register: async (userData) => {
    try {
      // Tạo dữ liệu theo định dạng backend yêu cầu
      const requestData = {
        fullname: userData.fullName,
        phone_number: userData.phoneNumber,
        email: userData.email || '',
        password: userData.password,
        retype_password: userData.retypePassword,
        date_of_birth: userData.dateOfBirth,
        address: userData.address,
        role_id: userData.roleId
      };

      const response = await axios.post(`${API_BASE_URL}/users/register`, requestData);
      
      // Kiểm tra response và trả về thông báo thành công
      if (response.data && response.data.user) {
        return {
          success: true,
          message: 'Đăng ký thành công',
          user: response.data.user
        };
      }
      
      return response.data;
    } catch (error) {
      if (error.response) {
        // Trả về lỗi từ backend
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('Phone number already exists')) {
          throw new Error('Số điện thoại đã tồn tại');
        } else if (errorMessage.includes('Password and retype password not the same')) {
          throw new Error('Mật khẩu và mật khẩu nhập lại không khớp');
        } else if (errorMessage.includes('You cannot register an admin account')) {
          throw new Error('Bạn không thể đăng ký tài khoản admin');
        } else {
          throw new Error(errorMessage || 'Đăng ký thất bại');
        }
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Đăng nhập người dùng
  login: async (phoneNumber, password, roleId = 1) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        phone_number: phoneNumber,
        password: password,
        role_id: roleId
      });

      if (response.data && response.data.token) {
        // Lưu token vào local storage
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Đăng nhập thất bại');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Lấy thông tin người dùng từ token
  getUserDetails: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.post(`${API_BASE_URL}/users/details`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Không thể lấy thông tin người dùng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Cập nhật thông tin người dùng
  updateUserDetails: async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.put(
        `${API_BASE_URL}/users/details/${userId}`, 
        userData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Cập nhật thông tin thất bại');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
  },

  // Kiểm tra người dùng đã đăng nhập hay chưa
  isLoggedIn: () => {
    return localStorage.getItem('token') !== null;
  }
};

export default authService; 