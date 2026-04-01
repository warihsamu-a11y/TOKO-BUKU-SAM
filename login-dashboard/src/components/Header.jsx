import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FiSearch, FiShoppingCart, FiMenu, FiHeart } from "react-icons/fi";
import "./Header.css";

function Header({ onMenuToggle, onLogoutCallback }) {
  const navigate = useNavigate();
  const { getTotalItems, user, logout } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    if (onLogoutCallback) {
      onLogoutCallback();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="gramedia-header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container-header">
          <div className="header-left">
            <button className="menu-toggle-btn" onClick={onMenuToggle}>
              <FiMenu size={24} />
            </button>
            <div className="logo" onClick={() => navigate("/dashboard")}>
              <img src="/logo2.png" alt="Samm Store Logo" className="logo-img" />
              <span className="logo-text">Samm Store</span>
            </div>
          </div>

          <div className="header-right">
            <div className="user-section">
              <span className="user-name">👤 {user?.name || "Guest"}</span>
              <button className="logout-mini" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <button className="wishlist-icon" title="Wishlist">
              <FiHeart size={24} />
            </button>
            <div className="cart-icon" onClick={() => navigate("/cart")}>
              <FiShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="header-search">
        <div className="container-header">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Cari judul buku, penulis, atau kategori..."
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="header-nav">
        <div className="container-header">
          <div className="nav-links">
            <button
              className="nav-link"
              onClick={() => navigate("/dashboard")}
            >
              🏠 Beranda
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/books")}
            >
              📖 Buku
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/orders")}
            >
              📦 Pesanan Saya
            </button>
            <button
              className="nav-link"
              onClick={() => navigate("/profile")}
            >
              ⚙️ Akun
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
