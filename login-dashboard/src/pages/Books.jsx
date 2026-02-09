import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { formatRupiah } from "../utils/formatCurrency";
import "./Books.css";

function Books() {
  const { addToCart } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products dari API saat component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products");
        
        if (!response.ok) {
          throw new Error("Gagal fetch produk");
        }

        const data = await response.json();
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Gagal memuat produk. Pastikan backend running di port 5000");
        // Fallback ke data lokal jika backend tidak berjalan
        setBooks([
          {
            id: 1,
            title: "Clean Code",
            author: "Robert C. Martin",
            price: 189000,
            category: "programming",
            image: "https://images-na.ssl-images-amazon.com/images/P/0132350882.01.L.jpg",
            rating: 4.8,
            reviews: 45,
            discount: 15,
          },
          {
            id: 2,
            title: "The Pragmatic Programmer",
            author: "David Thomas, Andrew Hunt",
            price: 185000,
            category: "programming",
            image: "https://covers.openlibrary.org/b/id/8338103-L.jpg",
            rating: 4.7,
            reviews: 38,
            discount: 10,
          },
          {
            id: 3,
            title: "Design Patterns",
            author: "Gang of Four",
            price: 225000,
            category: "programming",
            image: "https://images-na.ssl-images-amazon.com/images/P/0201633612.01.L.jpg",
            rating: 4.6,
            reviews: 52,
            discount: 5,
          },
          {
            id: 4,
            title: "1984",
            author: "George Orwell",
            price: 95000,
            category: "fiksi",
            image: "https://images-na.ssl-images-amazon.com/images/P/0451524934.01.L.jpg",
            rating: 4.9,
            reviews: 128,
            discount: 20,
          },
          {
            id: 5,
            title: "Sapiens",
            author: "Yuval Noah Harari",
            price: 135000,
            category: "nonfiksi",
            image: "https://images-na.ssl-images-amazon.com/images/P/0062316095.01.L.jpg",
            rating: 4.8,
            reviews: 95,
            discount: 0,
          },
          {
            id: 6,
            title: "Atomic Habits",
            author: "James Clear",
            price: 105000,
            category: "self-help",
            image: "https://images-na.ssl-images-amazon.com/images/P/0735211299.01.L.jpg",
            rating: 4.9,
            reviews: 210,
            discount: 25,
          },
          {
            id: 7,
            title: "The Silent Patient",
            author: "Alex Michaelides",
            price: 89000,
            category: "fiksi",
            image: "https://images-na.ssl-images-amazon.com/images/P/1250301696.01.L.jpg",
            rating: 4.7,
            reviews: 67,
            discount: 12,
          },
          {
            id: 8,
            title: "Mindset",
            author: "Carol S. Dweck",
            price: 125000,
            category: "self-help",
            image: "https://images-na.ssl-images-amazon.com/images/P/0345472322.01.L.jpg",
            rating: 4.6,
            reviews: 143,
            discount: 8,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { value: "semua", label: "Semua Buku" },
    { value: "programming", label: "Programming" },
    { value: "fiksi", label: "Fiksi" },
    { value: "nonfiksi", label: "Non-Fiksi" },
    { value: "self-help", label: "Self-Help" },
  ];

  const filteredBooks =
    selectedCategory === "semua"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  const getDiscountedPrice = (price, discount) => {
    return Math.round(price * (1 - discount / 100));
  };

  return (
    <div className="books-container">
      <div className="books-header">
        <h1>Koleksi Buku Kami</h1>
        <p>Temukan berbagai pilihan buku favorit Anda</p>
      </div>

      <div className="books-filter">
        <h3>Kategori</h3>
        <div className="filter-buttons">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`filter-btn ${
                selectedCategory === cat.value ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-image-wrapper">
              <img
                src={book.image}
                alt={book.title}
                className="book-image"
              />
              {book.discount > 0 && (
                <div className="discount-badge">-{book.discount}%</div>
              )}
              <div className="book-overlay">
                <button
                  className="quick-view-btn"
                >
                  👁️ Lihat Detail
                </button>
              </div>
            </div>

            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">{book.author}</p>

              <div className="rating">
                <span className="stars">⭐ {book.rating}</span>
                <span className="reviews">({book.reviews})</span>
              </div>

              <div className="price-section">
                {book.discount > 0 ? (
                  <>
                    <p className="original-price">
                      {formatRupiah(book.price)}
                    </p>
                    <p className="discounted-price">
                      {formatRupiah(getDiscountedPrice(book.price, book.discount))}
                    </p>
                  </>
                ) : (
                  <p className="price">
                    {formatRupiah(book.price)}
                  </p>
                )}
              </div>

              <button
                className="add-cart-btn"
                onClick={() => handleAddToCart(book)}
              >
                🛒 Tambah Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="no-results">
          <p>Tidak ada buku dalam kategori ini</p>
        </div>
      )}
    </div>
  );
}

export default Books;
