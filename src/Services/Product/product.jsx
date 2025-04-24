import axios from 'axios';

const API_BASE_URL = 'https://springbootuploads.onrender.com/api/v1';

const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async (page = 0, limit = 10, keyword = '', categoryId = null) => {
    try {
      let url = `${API_BASE_URL}/products?page=${page}&limit=${limit}`;
      
      if (keyword) {
        url += `&keyword=${keyword}`;
      }
      
      if (categoryId) {
        url += `&category_id=${categoryId}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Không thể lấy danh sách sản phẩm');
    }
  },
  
  // Lấy chi tiết sản phẩm
  getProductDetail: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error('Không thể lấy thông tin sản phẩm');
    }
  },
  
  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (categoryId, page = 0, limit = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products?category_id=${categoryId}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Không thể lấy sản phẩm theo danh mục');
    }
  }
};

export default productService; 
