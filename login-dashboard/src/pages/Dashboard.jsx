import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { formatRupiah } from "../utils/formatCurrency";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { getAllProducts, addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data.slice(0, 12)); // Show 12 products
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = [
    { name: "Programming", icon: "💻", color: "#667eea" },
    { name: "Fiksi", icon: "📖", color: "#764ba2" },
    { name: "Non-Fiksi", icon: "📚", color: "#f093fb" },
    { name: "Self-Help", icon: "🌟", color: "#fa7e1e" }
  ];

  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="dashboard-gramedia">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-left">
            <h1>Selamat Datang di Samm Store</h1>
            <p>Jelajahi koleksi buku terlengkap dengan jutaan pilihan terbaik</p>
            <button 
              className="hero-btn"
              onClick={() => navigate("/books")}
            >
              🔍 Jelajahi Koleksi →
            </button>
          </div>
          <div className="hero-right">
            <div className="hero-image">📚</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container-main">
          <div className="section-title">
            <h2>Kategori Populer</h2>
            <p>Pilih kategori favorit Anda</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className="category-card"
                onClick={() => navigate("/books")}
                style={{ "--cat-color": cat.color }}
              >
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container-main">
          <div className="section-title">
            <h2>Buku Terlaris</h2>
            <p>Rekomendasi pilihan terbaik untuk Anda</p>
          </div>

          {loading ? (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>Memuat koleksi buku...</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card-gramedia">
                  <div className="product-image">
                    <img src={product.image} alt={product.title} />
                    {product.discount > 0 && (
                      <div className="discount-tag">-{product.discount}%</div>
                    )}
                    <div className="product-overlay">
                      <button
                        className="view-detail-btn"
                        onClick={() => handleViewDetail(product.id)}
                        title="Lihat Detail"
                      >
                        <FiEye size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-header">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-author">Oleh {product.author}</p>
                    </div>
                    
                    <div className="product-rating">
                      {product.rating ? (
                        <>
                          <div className="stars-container">
                            <span className="star-icon">★</span>
                            <span className="star-value">{product.rating}</span>
                          </div>
                          <span className="reviews-count">({product.reviews} ulasan)</span>
                        </>
                      ) : (
                        <span className="no-rating">Belum dirating</span>
                      )}
                    </div>

                    <div className="product-price-section">
                      <div className="price-wrapper">
                        <span className="current-price">
                          {formatRupiah(product.price)}
                        </span>
                        {product.discount > 0 && (
                          <span className="discount-percentage">-{product.discount}%</span>
                        )}
                      </div>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        addToCart(product);
                        alert(`${product.title} ditambahkan ke keranjang!`);
                      }}
                    >
                      <ShoppingCart size={18} />
                      <span>Tambah ke Keranjang</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="view-all-section">
              <button 
                className="view-all-btn"
                onClick={() => navigate("/books")}
              >
                Lihat Semua Buku ({products.length}+)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-section">
        <div className="container-main">
          <div className="promo-grid">
            <div className="promo-card promo-1">
              <div className="promo-icon">🎁</div>
              <h3>Diskon Spesial</h3>
              <p>Dapatkan diskon hingga 30% untuk buku pilihan setiap harinya</p>
            </div>
            <div className="promo-card promo-2">
              <div className="promo-icon">🚚</div>
              <h3>Pengiriman Gratis</h3>
              <p>Gratis ongkos kirim untuk pembelian minimal Rp 500.000</p>
            </div>
            <div className="promo-card promo-3">
              <div className="promo-icon">🔒</div>
              <h3>Pembayaran Aman</h3>
              <p>Sistem pembayaran terenkripsi dan terpercaya 100%</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container-main">
          <h2>Tentang Samm Store</h2>
          <div className="about-content">
            <p>Samm Store adalah toko buku online terpercaya yang menyediakan ribuan judul buku dengan harga kompetitif dan layanan terbaik.</p>
            <div className="about-features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <strong>Koleksi Lengkap</strong>
                <p>Semua genre buku tersedia dari berbagai penerbit</p>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <strong>Harga Terjangkau</strong>
                <p>Harga kompetitif dengan sistem diskon menarik</p>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <strong>Pengiriman Cepat</strong>
                <p>Pengiriman 1-3 hari kerja ke seluruh Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
