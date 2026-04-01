import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./AdminPage.css";

/**
 * AdminPage - Comprehensive Admin Dashboard
 * 
 * Halaman admin dengan fitur:
 * - Dashboard overview dengan statistik
 * - CRUD operations untuk produk
 * - Link ke dokumentasi Swagger API
 * - Manajemen pengguna
 * - Monitoring order
 */
function AdminPage() {
  const navigate = useNavigate();
  const { user, token } = useContext(CartContext);
  
  // State management
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    image: "",
    rating: "",
    reviews: "",
    discount: "",
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Fetch data on mount
  useEffect(() => {
    fetchStats();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/products", {
          headers: { "Authorization": `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/orders", {
          headers: { "Authorization": `Bearer ${token}` },
        }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      const totalProducts = Array.isArray(productsData) ? productsData.length : 0;
      const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0;
      const totalRevenue = Array.isArray(ordersData) 
        ? ordersData.reduce((sum, order) => sum + (order.total || 0), 0)
        : 0;

      setStats({
        totalProducts,
        totalOrders,
        totalUsers: 1, // Placeholder - dapat diupdate jika ada endpoint users
        totalRevenue,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Gagal mengambil data produk");

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      price: "",
      category: "",
      image: "",
      rating: "",
      reviews: "",
      discount: "",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    try {
      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : "http://localhost:5000/api/products";

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image,
          rating: formData.rating ? parseFloat(formData.rating) : 0,
          reviews: formData.reviews ? parseInt(formData.reviews) : 0,
          discount: formData.discount ? parseInt(formData.discount) : 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan produk");
      }

      const newProduct = await response.json();

      if (editingProduct) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
      } else {
        setProducts([newProduct, ...products]);
      }

      resetForm();
      fetchStats();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      author: product.author,
      price: product.price,
      category: product.category,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      discount: product.discount,
    });
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Gagal menghapus produk");

      setProducts(products.filter((p) => p.id !== productId));
      fetchStats();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <h1>⚙️ Admin Dashboard</h1>
            <p>Selamat datang, {user?.username}!</p>
          </div>
          <a 
            href="http://localhost:5000/api-docs" 
            target="_blank"
            rel="noopener noreferrer"
            className="swagger-link"
          >
            📖 Swagger API Docs
          </a>
        </div>

        {/* Tabs Navigation */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            📦 Produk CRUD
          </button>
          <button
            className={`tab-btn ${activeTab === "api" ? "active" : ""}`}
            onClick={() => setActiveTab("api")}
          >
            🔌 API Integration
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="dashboard-section">
              <h2>Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <h3>Total Produk</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🛒</div>
                  <div className="stat-info">
                    <h3>Total Order</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">
                      Rp {stats.totalRevenue?.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Total User</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button
                    className="action-btn"
                    onClick={() => {
                      setActiveTab("products");
                      setShowForm(true);
                      resetForm();
                    }}
                  >
                    ➕ Tambah Produk
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab("products")}
                  >
                    🔍 Kelola Produk
                  </button>
                  <a
                    href="http://localhost:5000/api-docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn api-btn"
                  >
                    📖 API Documentation
                  </a>
                </div>
              </div>

              {/* System Info */}
              <div className="system-info">
                <h3>System Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Role:</label>
                    <span>{user?.role?.toUpperCase()}</span>
                  </div>
                  <div className="info-item">
                    <label>Username:</label>
                    <span>{user?.username}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <label>API Base URL:</label>
                    <span>http://localhost:5000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products CRUD Tab */}
          {activeTab === "products" && (
            <div className="products-section">
              <div className="section-header">
                <h2>Manajemen Produk</h2>
                <button
                  className="add-product-btn"
                  onClick={() => {
                    setShowForm(!showForm);
                    if (showForm) resetForm();
                  }}
                >
                  {showForm ? "❌ Tutup Form" : "➕ Tambah Produk"}
                </button>
              </div>

              {/* Product Form */}
              {showForm && (
                <div className="product-form-wrapper">
                  <form onSubmit={handleSubmitProduct} className="product-form">
                    <h3>{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h3>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Judul *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleFormChange}
                          placeholder="Masukkan judul produk"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Penulis *</label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleFormChange}
                          placeholder="Masukkan nama penulis"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Harga *</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleFormChange}
                          placeholder="Masukkan harga"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Kategori *</label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleFormChange}
                          placeholder="programming, fiksi, dll"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Rating</label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleFormChange}
                          placeholder="0-5"
                          step="0.1"
                          min="0"
                          max="5"
                        />
                      </div>
                      <div className="form-group">
                        <label>Reviews</label>
                        <input
                          type="number"
                          name="reviews"
                          value={formData.reviews}
                          onChange={handleFormChange}
                          placeholder="Jumlah review"
                        />
                      </div>
                      <div className="form-group">
                        <label>Diskon (%)</label>
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleFormChange}
                          placeholder="0-100"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>URL Gambar</label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleFormChange}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="submit-btn">
                        {editingProduct ? "✏️ Update Produk" : "➕ Tambah Produk"}
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={resetForm}
                      >
                        ❌ Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products List */}
              <div className="products-list">
                <div className="list-controls">
                  <button 
                    onClick={fetchProducts} 
                    className="refresh-btn"
                    disabled={loading}
                  >
                    {loading ? "⏳ Loading..." : "🔄 Refresh"}
                  </button>
                  <p className="product-count">Total Produk: {products.length}</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading && <div className="loading">Loading...</div>}

                {products.length === 0 ? (
                  <div className="empty-state">
                    <p>📭 Tidak ada produk</p>
                  </div>
                ) : (
                  <div className="products-table">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Gambar</th>
                          <th>Judul</th>
                          <th>Penulis</th>
                          <th>Harga</th>
                          <th>Kategori</th>
                          <th>Rating</th>
                          <th>Diskon</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td className="image-cell">
                              {product.image ? (
                                <img src={product.image} alt={product.title} />
                              ) : (
                                <div className="no-image">No Image</div>
                              )}
                            </td>
                            <td className="title-cell">{product.title}</td>
                            <td>{product.author}</td>
                            <td>Rp {product.price?.toLocaleString("id-ID")}</td>
                            <td>{product.category}</td>
                            <td>
                              {product.rating > 0
                                ? `⭐ ${product.rating.toFixed(1)}`
                                : "-"}
                            </td>
                            <td>
                              {product.discount > 0
                                ? `${product.discount}%`
                                : "-"}
                            </td>
                            <td className="actions">
                              <button
                                className="edit-btn"
                                onClick={() => handleEditProduct(product)}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteProduct(product.id)}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Integration Tab */}
          {activeTab === "api" && (
            <div className="api-section">
              <h2>API Integration & Swagger Documentation</h2>

              <div className="api-info">
                <div className="api-card">
                  <h3>📖 Swagger API Documentation</h3>
                  <p>Dokumentasi lengkap API Toko Buku Online dengan Swagger UI</p>
                  <a
                    href="http://localhost:5000/api-docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="api-link"
                  >
                    Buka Swagger Docs →
                  </a>
                </div>

                <div className="api-card">
                  <h3>🔌 API Endpoints</h3>
                  <div className="endpoints-list">
                    <div className="endpoint">
                      <code>POST /api/register</code>
                      <span>Register user baru</span>
                    </div>
                    <div className="endpoint">
                      <code>POST /api/login</code>
                      <span>Login pengguna</span>
                    </div>
                    <div className="endpoint">
                      <code>GET /api/products</code>
                      <span>Ambil semua produk</span>
                    </div>
                    <div className="endpoint">
                      <code>POST /api/products</code>
                      <span>Buat produk baru (Admin)</span>
                    </div>
                    <div className="endpoint">
                      <code>PUT /api/products/:id</code>
                      <span>Update produk (Admin)</span>
                    </div>
                    <div className="endpoint">
                      <code>DELETE /api/products/:id</code>
                      <span>Hapus produk (Admin)</span>
                    </div>
                    <div className="endpoint">
                      <code>POST /api/orders</code>
                      <span>Buat order baru</span>
                    </div>
                    <div className="endpoint">
                      <code>GET /api/orders</code>
                      <span>Ambil semua order</span>
                    </div>
                  </div>
                </div>

                <div className="api-card">
                  <h3>⚙️ Server Configuration</h3>
                  <div className="config-info">
                    <p><strong>Base URL:</strong> http://localhost:5000</p>
                    <p><strong>API Docs:</strong> http://localhost:5000/api-docs</p>
                    <p><strong>Authentication:</strong> JWT Bearer Token</p>
                    <p><strong>Database:</strong> MySQL</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
