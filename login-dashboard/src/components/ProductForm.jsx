import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./ProductForm.css";

/**
 * ProductForm - Admin Product Input Form
 * 
 * Komponen form untuk admin menambahkan produk baru
 * Features:
 * - Input untuk semua field produk
 * - Validasi form
 * - Upload image (URL atau base64)
 * - Real-time preview
 * - Loading state
 * - Error handling
 */
function ProductForm({ onProductAdded }) {
  const { token } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    category: "programming",
    image: "",
    rating: 0,
    reviews: 0,
    discount: 0,
  });

  const categories = [
    "programming",
    "fiction",
    "non-fiction",
    "self-help",
    "biography",
    "history",
    "science",
    "art",
    "other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rating" || name === "reviews" || name === "discount" 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setFormData((prev) => ({
          ...prev,
          image: base64String,
        }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageURLChange = (e) => {
    const url = e.target.value;
    if (url) {
      setFormData((prev) => ({
        ...prev,
        image: url,
      }));
      setImagePreview(url);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Judul produk harus diisi");
      return false;
    }
    if (!formData.author.trim()) {
      setError("Penulis harus diisi");
      return false;
    }
    if (formData.price <= 0) {
      setError("Harga harus lebih dari 0");
      return false;
    }
    if (!formData.image) {
      setError("Gambar produk harus diupload");
      return false;
    }
    if (formData.rating < 0 || formData.rating > 5) {
      setError("Rating harus antara 0-5");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError("Anda harus login sebagai admin");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          author: formData.author.trim(),
          price: formData.price,
          category: formData.category,
          image: formData.image,
          rating: formData.rating,
          reviews: formData.reviews,
          discount: formData.discount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menambah produk");
      }

      const newProduct = await response.json();
      setSuccess("✅ Produk berhasil ditambahkan!");

      // Reset form
      setFormData({
        title: "",
        author: "",
        price: "",
        category: "programming",
        image: "",
        rating: 0,
        reviews: 0,
        discount: 0,
      });
      setImagePreview("");

      // Callback untuk refresh list
      if (onProductAdded) {
        onProductAdded(newProduct);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message || "Gagal menambah produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <h2>📚 Tambah Produk Baru</h2>
        <p>Hanya admin yang dapat menambahkan produk baru ke toko</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {error && <div className="form-alert alert-error">{error}</div>}
        {success && <div className="form-alert alert-success">{success}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Judul Produk *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul buku"
              maxLength="100"
              disabled={loading}
            />
            <small>{formData.title.length}/100 karakter</small>
          </div>

          <div className="form-group">
            <label htmlFor="author">Penulis *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Nama penulis"
              maxLength="100"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Harga (IDR) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              step="1000"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rating">Rating (0-5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reviews">Jumlah Review</label>
            <input
              type="number"
              id="reviews"
              name="reviews"
              value={formData.reviews}
              onChange={handleInputChange}
              min="0"
              step="1"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">Diskon (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="1"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="imageURL">URL Gambar atau</label>
          <input
            type="url"
            id="imageURL"
            placeholder="https://example.com/image.jpg"
            onChange={handleImageURLChange}
            disabled={loading}
          />
          <div className="image-upload-divider">ATAU</div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="imageUpload">Upload Gambar Produk *</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="imageUpload"
              name="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="file-input"
            />
            <label htmlFor="imageUpload" className="file-label">
              <span className="upload-icon">📤</span>
              <span className="upload-text">Klik untuk upload atau drag & drop gambar</span>
              <span className="file-hint">(JPG, PNG, WebP max 5MB)</span>
            </label>
          </div>
        </div>

        {imagePreview && (
          <div className="image-preview">
            <h4>Preview Gambar:</h4>
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "⏳ Menambah produk..." : "✨ Tambah Produk"}
        </button>
      </form>

      <div className="form-info">
        <h4>📝 Catatan Penting:</h4>
        <ul>
          <li>Semua field bertanda (*) harus diisi</li>
          <li>Harga dan diskon dalam format angka</li>
          <li>Rating harus antara 0-5</li>
          <li>Gunakan URL gambar atau upload file gambar</li>
          <li>Produk akan tersedia di katalog setelah ditambahkan</li>
        </ul>
      </div>
    </div>
  );
}

export default ProductForm;
