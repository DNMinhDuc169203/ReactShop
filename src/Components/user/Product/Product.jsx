import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import ProductCard from './ProductCard';
import { useCart } from '../../../Context/CartContext';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { addToCart } = useCart();
  
  // Mặc định 12 sản phẩm mỗi trang
  const itemsPerPage = 12;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://springbootuploads.onrender.com/api/v1/categories',{
          params: {
            page: 1,
            limit: 10
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://springbootuploads.onrender.com/api/v1/products', {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            category_id: selectedCategory,
            keyword: searchKeyword
          }
        });
        
        // Đảm bảo mỗi sản phẩm có đường dẫn hình ảnh đầy đủ
        const productsWithFullImageUrl = response.data.products.map(product => ({
          ...product,
          id: product.id,
          thumbnail: product.thumbnail 
            ? `https://springbootuploads.onrender.com/api/v1/products/images/${product.thumbnail}` 
            : 'https://via.placeholder.com/400x300?text=Không+có+ảnh'
        }));
        
        setProducts(productsWithFullImageUrl);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategory, searchKeyword]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0); // Reset về trang đầu tiên khi chọn danh mục mới
  };

  const handlePageChange = (newPage) => {
    // API sử dụng page bắt đầu từ 0, nhưng UI hiển thị từ 1
    setCurrentPage(newPage - 1);
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm</h2>
      
      {/* Thanh tìm kiếm */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Tìm kiếm
          </button>
        </form>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Danh mục sản phẩm */}
        <div className="md:w-1/4 lg:w-1/5">
          <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleCategoryClick(0)}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedCategory === 0
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Tất cả sản phẩm
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Phần hiển thị sản phẩm */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p>Không tìm thấy sản phẩm nào.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Phân trang */}
          {!loading && products.length > 0 && (
            <Pagination
              currentPage={currentPage + 1} // UI bắt đầu từ 1
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
