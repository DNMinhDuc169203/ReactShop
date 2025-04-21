import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../../Context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Ngăn chặn chuyển hướng khi click vào nút "Thêm vào giỏ"
    
    // Đảm bảo product có đầy đủ thông tin cần thiết
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail
    };
    
    addToCart(productToAdd, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/product/${product.id}`} className="block relative">
        <img 
          src={product.thumbnail} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-gray-800 font-medium text-lg mb-2 hover:text-blue-600 truncate">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-red-600 font-bold">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <span className="text-gray-400 text-sm line-through ml-2">
                {formatPrice(product.price * (1 + product.discount / 100))}
              </span>
            )}
          </div>
        </div>
        
        {/* <div className="flex space-x-2">
          <Link 
            to={`/product/${product.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex-grow text-center"
          >
            Chi tiết
          </Link>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center justify-center"
          >
            <FaShoppingCart />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProductCard;