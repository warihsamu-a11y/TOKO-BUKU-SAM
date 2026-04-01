import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { CartProvider, CartContext } from "./context/CartContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import ProductDetail from "./pages/ProductDetail";
import ShoppingCart from "./pages/ShoppingCart";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import ProductManagement from "./pages/ProductManagement";
import AdminPage from "./pages/AdminPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "./App.css";

/**
 * App - Main Application Component
 * 
 * Handles routing dan state management untuk aplikasi e-commerce toko buku
 * dengan fitur:
 * - User authentication (Login)
 * - Product browsing (Books)
 * - Shopping cart management
 * - Order history tracking
 * - User profile management
 */
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/product/:productId" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user, token } = useContext(CartContext);

  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to="/" />;
  }

  return (
    <RouteLayout>
      {children}
    </RouteLayout>
  );
}

function RouteLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-layout-new">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onLogout={handleLogout} />
      <div className="main-content-new">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onLogoutCallback={handleLogout} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default App;
