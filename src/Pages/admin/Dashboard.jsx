import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingBag, FaUsers, FaClipboardList, FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import cartService from '../../Services/Cart/cart';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, user } = useAuth();
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);

  // Lấy thông tin đơn hàng khi component được mount
  useEffect(() => {
    // Kiểm tra quyền admin
    if (!isLoggedIn || !isAdmin) {
      navigate('/login');
      return;
    }
    
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Lấy danh sách đơn hàng gần đây
        const response = await cartService.getAllOrders('', 0, 5);
        setRecentOrders(response.orders || []);
        
        // Tính toán thống kê
        if (response.orders && response.orders.length > 0) {
          const totalOrders = response.orders.length;
          const pendingOrders = response.orders.filter(order => order.status === 'PENDING').length;
          const processingOrders = response.orders.filter(order => order.status === 'PROCESSING').length;
          const shippedOrders = response.orders.filter(order => order.status === 'SHIPPED').length;
          const deliveredOrders = response.orders.filter(order => order.status === 'DELIVERED').length;
          const cancelledOrders = response.orders.filter(order => order.status === 'CANCELLED').length;
          
          setStats({
            total: totalOrders,
            pending: pendingOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders
          });
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError(error.message || 'Không thể tải dữ liệu bảng điều khiển');
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboardData();
  }, [isLoggedIn, isAdmin, navigate]);

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

  // Định nghĩa trạng thái đơn hàng
  const orderStatusMap = {
    'PENDING': { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle className="mr-1" /> },
    'PROCESSING': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: <FaClipboardList className="mr-1" /> },
    'SHIPPED': { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800', icon: <FaTruck className="mr-1" /> },
    'DELIVERED': { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" /> },
    'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="mr-1" /> },
    // Thêm ánh xạ cho trạng thái viết thường
    'pending': { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle className="mr-1" /> },
    'processing': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: <FaClipboardList className="mr-1" /> },
    'shipped': { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800', icon: <FaTruck className="mr-1" /> },
    'delivered': { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" /> },
    'cancelled': { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="mr-1" /> }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bảng điều khiển</h1>
      
      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Hiển thị thông báo đang tải */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}
      
      {!loading && (
        <>
          {/* Thông tin chào mừng */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Xin chào, {user?.fullname || 'Quản trị viên'}!
            </h2>
            <p className="text-gray-600 mt-2">
              Đây là trang quản lý đơn hàng của bạn. Bạn có thể theo dõi trạng thái các đơn hàng và quản lý cửa hàng từ đây.
            </p>
          </div>
          
          {/* Các thẻ hiển thị thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <FaShoppingBag size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Tổng đơn hàng</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                  <FaExclamationTriangle size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Chờ xác nhận</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                  <FaTruck size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Đang giao hàng</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stats.shipped}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Đơn hàng gần đây */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Đơn hàng gần đây</h3>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Không có đơn hàng nào.
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
                          <Link to={`/admin/orders`} onClick={() => navigate('/admin/orders')}>
                            #{order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{order.fullname}</div>
                          <div className="text-xs">{order.phone_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.order_date || order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(order.total_money)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderStatusMap[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {orderStatusMap[order.status]?.icon}
                            {orderStatusMap[order.status]?.label || order.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link 
                to="/admin/orders"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Xem tất cả đơn hàng →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 