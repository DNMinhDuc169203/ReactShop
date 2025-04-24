import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEdit, FaEye, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import cartService from '../../Services/Cart/cart';
import { toast } from 'react-hot-toast';

const Orders = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Định nghĩa trạng thái đơn hàng
  const orderStatusMap = {
    'PENDING': { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    'PROCESSING': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    'SHIPPED': { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
    'DELIVERED': { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
    'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    // Thêm ánh xạ cho trạng thái viết thường
    'pending': { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    'processing': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    'shipped': { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
    'delivered': { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
    'cancelled': { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
  };

  // Fetch đơn hàng
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await cartService.getAllOrders(keyword, page, 10);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi component mount và khi các dependencies thay đổi
  useEffect(() => {
    // Kiểm tra quyền admin
    if (!isLoggedIn || !isAdmin) {
      navigate('/login');
      return;
    }
    
    fetchOrders();
  }, [isLoggedIn, isAdmin, page, keyword]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset về trang đầu tiên khi tìm kiếm
    fetchOrders();
  };

  // Xử lý xem chi tiết đơn hàng
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status); // Initialize with current status
    setShowOrderDetails(true);
  };

  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      console.log(`Đang cập nhật trạng thái đơn hàng #${orderId} thành ${newStatus}`);
      
      // Gọi API cập nhật trạng thái
      const result = await cartService.updateOrderStatus(orderId, newStatus);
      console.log('Kết quả cập nhật trạng thái:', result);
      
      // Update the order in the state
      setOrders(orders.map(order => 
        order.id === orderId ? {...order, status: newStatus} : order
      ));
      
      // Update selected order if it's open in modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
      
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Error updating order status:", error);
      
      // Xử lý thông báo lỗi
      const errorMessage = error.message || "Không thể cập nhật trạng thái đơn hàng!";
      toast.error(errorMessage);
      
      // Nếu lỗi là do API backend chưa được triển khai
      if (errorMessage.includes("Unexpected end of JSON input")) {
        toast.error("Lỗi kết nối đến server hoặc API chưa được triển khai");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa đơn hàng
  const handleDelete = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
      return;
    }
    
    try {
      setLoading(true);
      await cartService.deleteOrder(orderId);
      // Cập nhật danh sách đơn hàng sau khi xóa
      setOrders(orders.filter(order => order.id !== orderId));
      setError('');
    } catch (error) {
      console.error('Error deleting order:', error);
      setError(error.message || 'Không thể xóa đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Format tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      // Kiểm tra xem date có hợp lệ không
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Lỗi định dạng ngày:', error);
      return 'Ngày không hợp lệ';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>
      
      {/* Thanh tìm kiếm */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm theo tên khách hàng, địa chỉ, số điện thoại..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
            >
              <FaSearch />
            </button>
          </div>
        </form>
      </div>
      
      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Danh sách đơn hàng */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Không tìm thấy đơn hàng nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">{order.fullname}</div>
                      <div>{order.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.order_date || order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.total_money)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${orderStatusMap[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {orderStatusMap[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'processing')}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Xác nhận đơn hàng"
                            disabled={order.status !== 'pending'}
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Xóa đơn hàng"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`px-4 py-2 border rounded ${page === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className={`px-4 py-2 border rounded ${page === totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
      
      {/* Modal chi tiết đơn hàng */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết đơn hàng #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <p><span className="text-gray-600">Họ tên:</span> {selectedOrder.fullname}</p>
                  <p><span className="text-gray-600">Email:</span> {selectedOrder.email || 'Không có'}</p>
                  <p><span className="text-gray-600">Số điện thoại:</span> {selectedOrder.phone_number}</p>
                  <p><span className="text-gray-600">Địa chỉ:</span> {selectedOrder.address}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
                  <p>
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${orderStatusMap[selectedOrder.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {orderStatusMap[selectedOrder.status]?.label || selectedOrder.status}
                    </span>
                  </p>
                  <p><span className="text-gray-600">Ngày đặt:</span> {formatDate(selectedOrder.order_date || selectedOrder.created_at)}</p>
                  <p><span className="text-gray-600">Phương thức vận chuyển:</span> {selectedOrder.shipping_method}</p>
                  <p><span className="text-gray-600">Phương thức thanh toán:</span> {selectedOrder.payment_method}</p>
                </div>
              </div>
              
              {selectedOrder.note && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                  <p className="text-gray-700">{selectedOrder.note}</p>
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Sản phẩm</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đơn giá
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.order_details?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.product?.name || `Sản phẩm #${item.product_id}`}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.number_of_products || item.quantity || 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            {formatPrice(item.price * (item.number_of_products || item.quantity || 1))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium">
                          Tổng cộng
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-red-600">
                          {formatPrice(selectedOrder.total_money)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Cập nhật trạng thái</h4>
                <div className="flex items-center space-x-4">
                  <select
                    className="form-select border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, selectedStatus)}
                    disabled={isLoading || selectedStatus === selectedOrder.status}
                    className={`px-4 py-2 rounded-md ${
                      isLoading || selectedStatus === selectedOrder.status
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                  </button>
                </div>
                {isLoading && <span className="mt-2 text-sm text-gray-500 block">Đang cập nhật...</span>}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowOrderDetails(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 