import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FiShoppingCart, FiArrowLeft, FiHeart, FiStar } from "react-icons/fi";
import { formatRupiah } from "../utils/formatCurrency";
import "./ProductDetail.css";

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, getProduct } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 300, height: 400 });
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(parseInt(productId));
      if (data) {
        setProduct(data);
        setError(null);
      } else {
        setError("Produk tidak ditemukan");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Produk tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (e) => {
    setImageLoaded(true);
    const img = e.target;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    // Set natural aspect ratio, max 400px width
    let width = Math.min(naturalWidth, 400);
    let height = (width / naturalWidth) * naturalHeight;
    
    // Max height 500px
    if (height > 500) {
      height = 500;
      width = (height / naturalHeight) * naturalWidth;
    }
    
    setImageDimensions({ width, height });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      navigate("/cart");
    }, 1500);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const getDiscountedPrice = () => {
    if (!product) return 0;
    return Math.round(product.price * (1 - (product.discount || 0) / 100));
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <p>{error || "Produk tidak ditemukan"}</p>
          <button className="btn-back-error" onClick={() => navigate("/books")}>
            <ArrowLeft size={18} />
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Back Button */}
      <button className="btn-back-detail" onClick={() => navigate("/books")}>
        <ArrowLeft size={20} />
        <span>Kembali</span>
      </button>

      <div className="product-detail-wrapper">
        {/* Left: Image Section */}
        <div className="detail-image-wrapper">
          <div className="image-container-detail" style={{
            width: `${imageDimensions.width}px`,
            aspectRatio: `${imageDimensions.width}/${imageDimensions.height}`
          }}>
            <img
              src={product.image || "https://via.placeholder.com/400x500"}
              alt={product.title}
              className={`product-image-detail ${imageLoaded ? "loaded" : ""}`}
              onLoad={handleImageLoad}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x500";
                setImageLoaded(true);
              }}
            />
            {product.discount > 0 && (
              <div className="discount-badge-large">
                <span className="discount-percent">-{product.discount}%</span>
              </div>
            )}
          </div>
          
          <button 
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Right: Info Section */}
        <div className="detail-info-wrapper">
          {/* Product Header */}
          <div className="product-header-detail">
            <h1 className="product-title-detail">{product.title}</h1>
            <p className="product-author-detail">
              <span className="label">Penulis:</span> {product.author}
            </p>
            
            {product.category && (
              <div className="category-display">
                <span className="category-badge-detail">{product.category}</span>
              </div>
            )}
          </div>

          {/* Rating Section */}
          <div className="rating-section-detail">
            {product.rating ? (
              <div className="rating-info">
                <div className="stars-group">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating) ? "star-filled" : "star-empty"}
                    />
                  ))}
                </div>
                <span className="rating-value">{product.rating}/5</span>
                <span className="reviews-count">({product.reviews || 0} ulasan)</span>
              </div>
            ) : (
              <p className="no-rating-detail">Belum ada rating</p>
            )}
          </div>

          {/* Price Section */}
          <div className="price-section-detail">
            {product.discount > 0 ? (
              <>
                <div className="price-group">
                  <span className="original-price-detail">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="discount-info-detail">-{product.discount}%</span>
                </div>
                <p className="current-price-detail">
                  {formatRupiah(getDiscountedPrice())}
                </p>
                <p className="savings-detail">
                  Hemat {formatRupiah(product.price - getDiscountedPrice())}
                </p>
              </>
            ) : (
              <p className="current-price-detail">
                {formatRupiah(product.price)}
              </p>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <div className="stock-section">
              {product.stock > 0 ? (
                <p className="stock-available-detail">
                  <span className="stock-icon">✓</span>
                  Stok tersedia ({product.stock} unit)
                </p>
              ) : (
                <p className="stock-unavailable-detail">
                  <span className="stock-icon">✗</span>
                  Stok habis
                </p>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="description-section-detail">
              <h3>Deskripsi Produk</h3>
              <p className="description-text-detail">{product.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-section-detail">
            <div className="quantity-group">
              <label htmlFor="qty">Jumlah:</label>
              <input
                type="number"
                id="qty"
                min="1"
                max={product.stock || 100}
                value={quantity}
                onChange={handleQuantityChange}
                className="qty-input"
              />
            </div>

            <button
              className={`btn-add-cart ${addedToCart ? "success" : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {addedToCart ? (
                <>
                  <span>✓ Ditambahkan ke Keranjang</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  <span>Tambah ke Keranjang</span>
                </>
              )}
            </button>
          </div>

          {/* Specifications */}
          {(product.publisher || product.year || product.pages || product.isbn) && (
            <div className="specs-section">
              <h3>Spesifikasi</h3>
              <div className="specs-grid">
                {product.title && (
                  <div className="spec-item">
                    <span className="spec-label">Judul</span>
                    <span className="spec-value">{product.title}</span>
                  </div>
                )}
                {product.author && (
                  <div className="spec-item">
                    <span className="spec-label">Penulis</span>
                    <span className="spec-value">{product.author}</span>
                  </div>
                )}
                {product.publisher && (
                  <div className="spec-item">
                    <span className="spec-label">Penerbit</span>
                    <span className="spec-value">{product.publisher}</span>
                  </div>
                )}
                {product.year && (
                  <div className="spec-item">
                    <span className="spec-label">Tahun Terbit</span>
                    <span className="spec-value">{product.year}</span>
                  </div>
                )}
                {product.pages && (
                  <div className="spec-item">
                    <span className="spec-label">Jumlah Halaman</span>
                    <span className="spec-value">{product.pages}</span>
                  </div>
                )}
                {product.isbn && (
                  <div className="spec-item">
                    <span className="spec-label">ISBN</span>
                    <span className="spec-value">{product.isbn}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section (optional) */}
      <div className="related-products">
        <h2>Produk Terkait</h2>
        <p className="coming-soon">Rekomendasi produk serupa akan ditampilkan di sini</p>
      </div>
    </div>
  );
}

export default ProductDetail;
