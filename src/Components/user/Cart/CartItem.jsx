import React from 'react';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const CartItem = ({ item, updateQuantity, removeFromCart, formatPrice }) => {
  // Kiểm tra nếu đã đạt số lượng tối đa
  //const isMaxQuantity = item.quantity >= 2;

  return (
    <div className="border-b p-4 flex flex-col md:flex-row items-start md:items-center">
      {/* Hình ảnh sản phẩm */}
      <div className="w-24 h-24 flex-shrink-0 mr-4 mb-4 md:mb-0">
        <img 
          src={item.thumbnail} 
          alt={item.name} 
          className="w-full h-full object-cover rounded"
        />
      </div>
      
      {/* Thông tin sản phẩm */}
      <div className="flex-grow mr-4">
        <h3 className="font-medium text-gray-800">{item.name}</h3>
        <p className="text-red-600 font-medium mt-1">{formatPrice(item.price)}</p>
        {/* {isMaxQuantity && (
          <p className="text-xs text-orange-600 mt-1">Số lượng tối đa: 2</p>
        )} */}
      </div>
      
      {/* Điều chỉnh số lượng */}
      <div className="flex items-center mt-2 md:mt-0">
        <div className="flex items-center border border-gray-300 rounded mr-4">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Giảm số lượng"
            //them khi chinh
            // disabled={item.quantity <= 1}
          >
            <FaMinus size={12} />
          </button>
          <span className="px-3 py-1">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
            // className={`px-2 py-1 ${isMaxQuantity 
            //   ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            //   : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            aria-label="Tăng số lượng"
            // disabled={isMaxQuantity}
          >
            <FaPlus size={12} />
          </button>
        </div>
        
        {/* Nút xóa */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 transition"
          aria-label="Xóa sản phẩm"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem; 