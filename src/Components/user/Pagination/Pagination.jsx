import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Tạo mảng các số trang để hiển thị
  const pageNumbers = [];
  
  // Hiển thị tối đa 5 số trang
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Điều chỉnh lại startPage nếu endPage đã đạt giới hạn
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6 mb-4">
      <nav className="flex items-center">
        {/* Nút Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          &laquo; Trước
        </button>
        
        {/* Hiển thị "..." nếu không bắt đầu từ trang 1 */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              1
            </button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}
        
        {/* Hiển thị các số trang */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === number
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {number}
          </button>
        ))}
        
        {/* Hiển thị "..." nếu không kết thúc ở trang cuối */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}       
        {/* Nút Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sau &raquo;
        </button>
      </nav>
    </div>
  );
};

export default Pagination;