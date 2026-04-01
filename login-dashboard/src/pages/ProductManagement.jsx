import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { CartContext } from "../context/CartContext";
import "./ProductManagement.css";

/**
 * ProductManagement - Admin Product Management Page
 * 
 * Halaman untuk admin mengelola produk:
 * - Menambah produk baru
 * - Melihat daftar produk
 * - Mengedit produk
 * - Menghapus produk
 */
function ProductManagement() {
  const navigate = useNavigate();
  const { user, token } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data produk");
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus produk");
      }

      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Gagal menghapus produk: " + err.message);
    }
  };

  const filteredProducts = products.filter((product) => {
    // Default to empty string if title/author is null/undefined
    const title = (product.title || "").toLowerCase();
    const author = (product.author || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchSearch = query === "" || title.includes(query) || author.includes(query);

    const matchCategory =
      filterCategory === "all" || product.category === filterCategory;

    return matchSearch && matchCategory;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  return (
    <div className="product-management-page">
      <div className="container-main">
        {/* Header */}
        <div className="management-header">
          <h1>📦 Manajemen Produk</h1>
          <p>Halo, {user?.username}! Kelola produk toko Anda</p>
        </div>

        <div className="management-content">
          {/* Form Section */}
          <div className="form-section">
            <ProductForm onProductAdded={handleProductAdded} />
          </div>

          {/* Products List Section */}
          <div className="products-list-section">
            <div className="list-header">
              <h2>📚 Daftar Produk ({filteredProducts.length})</h2>
              <button onClick={fetchProducts} className="refresh-btn" disabled={loading}>
                {loading ? "⏳ Loading..." : "🔄 Refresh"}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Search & Filter */}
            <div className="search-filter-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Cari produk atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-box">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="category-filter"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "Semua Kategori" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products List */}
            {loading && <div className="loading-spinner">⏳ Memuat produk...</div>}

            {!loading && products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Belum ada produk</h3>
                <p>Mulai tambahkan produk pertama Anda menggunakan form di atas</p>
              </div>
            ) : (
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
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
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="product-row">
                        <td className="image-cell">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="product-thumb"
                            />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </td>
                        <td className="title-cell">{product.title}</td>
                        <td className="author-cell">{product.author}</td>
                        <td className="price-cell">
                          Rp {product.price?.toLocaleString("id-ID")}
                        </td>
                        <td className="category-cell">
                          <span className="category-tag">{product.category}</span>
                        </td>
                        <td className="rating-cell">
                          {product.rating > 0 ? (
                            <span className="rating">
                              ⭐ {product.rating.toFixed(1)} ({product.reviews})
                            </span>
                          ) : (
                            <span className="no-rating">No Rating</span>
                          )}
                        </td>
                        <td className="discount-cell">
                          {product.discount > 0 ? (
                            <span className="discount-badge">{product.discount}%</span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="actions-cell">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="delete-btn"
                            title="Hapus"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && products.length > 0 && (
                  <div className="no-results">
                    <p>Tidak ada produk yang sesuai dengan pencarian</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
