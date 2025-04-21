import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppRouter from "./Pages/user/Router/Router";
import AdminLayout from './Components/admin/Layout/AdminLayout';
import Dashboard from './Pages/admin/Dashboard';
import Orders from './Pages/admin/Orders';
import ProductDetail from './Components/user/Product/ProductDetail';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          
          {/* User Routes */}
          <Route path="/*" element={<AppRouter />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
