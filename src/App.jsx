import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';
import InventoryLayout from './components/layouts/InventoryLayout';
import DeliveryLayout from './components/layouts/DeliveryLayout';

// Public Pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer Pages
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ProfilePage from './pages/customer/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Inventory Manager Pages
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import StockManagement from './pages/inventory/StockManagement';

// Delivery Partner Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import DeliveryDetail from './pages/delivery/DeliveryDetail';

import DeliveryPerformance from './pages/delivery/Performance';

import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    // Redirect to appropriate dashboard based on role
    switch (user?.role) {
      case 'delivery_partner':
        return <Navigate to="/delivery" replace />;
      default:
        // For admin/inventory trying to access customer routes, we might want to allow it
        // based on the previous request "admin and inventory shoud also see the home"
        // So effectively, we only strictly redirect delivery partners.
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Guest Route (only accessible when NOT logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    switch (user?.role) {
      case 'delivery_partner':
        return <Navigate to="/delivery" replace />;
      case 'admin':
      case 'inventory_manager':
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Store Access Route (Block Delivery Partners)
const StoreAccessRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === 'delivery_partner') {
    return <Navigate to="/delivery" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes (Store Access) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={
          <StoreAccessRoute>
            <HomePage />
          </StoreAccessRoute>
        } />
        <Route path="/products" element={
          <StoreAccessRoute>
            <ProductsPage />
          </StoreAccessRoute>
        } />
        <Route path="/products/:id" element={
          <StoreAccessRoute>
            <ProductDetailPage />
          </StoreAccessRoute>
        } />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      } />

      {/* Customer Protected Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['customer', 'admin']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Route>

      {/* General Protected Routes (All Authenticated Users) */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* Inventory Manager Routes */}
      <Route path="/inventory" element={
        <ProtectedRoute allowedRoles={['admin', 'inventory_manager']}>
          <InventoryLayout />
        </ProtectedRoute>
      }>
        <Route index element={<InventoryDashboard />} />
        <Route path="stock" element={<StockManagement />} />
      </Route>



      {/* Delivery Partner Routes */}
      <Route path="/delivery" element={
        <ProtectedRoute allowedRoles={['admin', 'delivery_partner']}>
          <DeliveryLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DeliveryDashboard />} />
        <Route path="performance" element={<DeliveryPerformance />} />
        <Route path=":id" element={<DeliveryDetail />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
