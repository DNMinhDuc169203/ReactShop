import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from 'react-toastify';
import { useCart } from '../../../Context/CartContext';
import { useAuth } from '../../../Context/AuthContext';

const API_BASE_URL = 'https://springbootuploads.onrender.com/api/v1';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [comments, setComments] = useState([]);
  // 2 là cao nhất
  //const MAX_QUANTITY = 2;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Không tìm thấy ID sản phẩm');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
        if (response.data) {
          const productWithFullImageUrls = {
            ...response.data,
            thumbnail: response.data.thumbnail
              ? `${API_BASE_URL}/products/images/${response.data.thumbnail}`
              : 'https://via.placeholder.com/400x300?text=Không+có+ảnh',
            product_images: response.data.product_images?.map(image => ({
              ...image,
              image_url: `${API_BASE_URL}/products/images/${image.image_url}`
            }))
          };
          setProduct(productWithFullImageUrls);
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.response?.data || 'Có lỗi xảy ra khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      if (!productId) return;
      
      try {
        const response = await axios.get(`${API_BASE_URL}/comments/product/${productId}`);
        setComments(response.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Không thể tải bình luận');
      }
    };

    fetchProduct();
    fetchComments();
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      // điều kiện
      //if (!isNaN(value) && value >= 1 && value <= MAX_QUANTITY) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const increaseQuantity = () => {
    // ràng buộc 2
    //if (quantity < MAX_QUANTITY) {
      setQuantity(prev => prev + 1);
    //}
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      // Đảm bảo chỉ lấy những thông tin cần thiết cho giỏ hàng
      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail
      };
      
      addToCart(productToAdd, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-xl mb-4">Không tìm thấy sản phẩm</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="relative">
              <Carousel
                selectedItem={selectedImage}
                onChange={setSelectedImage}
                showArrows={true}
                showStatus={false}
                showThumbs={true}
                infiniteLoop={true}
                className="product-carousel bg-gray-100 rounded-lg"
              >
                {/* Main thumbnail */}
                {product.thumbnail && (
                  <div className="aspect-w-1 aspect-h-1">
                    <img 
                      src={product.thumbnail}
                      alt={product.name} 
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Không+có+ảnh';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                )}
                {/* Additional product images */}
                {product.product_images?.map((image, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1">
                    <img 
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Không+có+ảnh';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="text-3xl font-bold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </div>
              </div>

              <div className="prose prose-sm text-gray-600">
                <p>{product.description}</p>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Số lượng:</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l bg-gray-50 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <span className="text-xl font-medium text-gray-600">−</span>
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 h-10 border-t border-b border-gray-300 text-center text-gray-700 text-base [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r bg-gray-50 hover:bg-gray-100 active:bg-gray-200"
                      // className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r bg-gray-50 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      // disabled={quantity >= MAX_QUANTITY}
                    >
                      <span className="text-xl font-medium text-gray-600">+</span>
                    </button>
                  </div>
                  {/* <span className="text-sm text-gray-500">
                    (Tối đa {MAX_QUANTITY} sản phẩm)
                  </span> */}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-6 w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span>Thêm vào giỏ hàng</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 px-8 py-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Đánh giá sản phẩm</h2>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {comment.user?.fullname?.[0] || 'A'}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{comment.user?.fullname || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 italic">Chưa có đánh giá nào cho sản phẩm này.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 
