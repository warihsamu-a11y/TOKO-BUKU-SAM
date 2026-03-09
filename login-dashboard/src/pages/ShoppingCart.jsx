import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { formatRupiah } from "../utils/formatCurrency";
import "./ShoppingCart.css";

function ShoppingCart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, createOrder, paymentMethod, setPaymentMethod } =
    useContext(CartContext);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/payment-methods");
        if (response.ok) {
          const methods = await response.json();
          setPaymentMethods(methods);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };
    fetchPaymentMethods();
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const newOrder = await createOrder();
      if (newOrder) {
        navigate("/orders");
      }
    } catch (error) {
      console.error("Checkout error:", error.message);
      alert("Error checkout: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Keranjang Belanja</h1>
        <p>{cart.length} item dalam keranjang</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Keranjang belanja Anda kosong</p>
              <button
                className="continue-shopping"
                onClick={() => navigate("/books")}
              >
                ← Lanjut Belanja
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p className="item-author">{item.author}</p>
                    <p className="item-price">
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    <p>{formatRupiah(item.price * item.quantity)}</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(getTotalPrice())}</span>
                </div>
                <div className="summary-row">
                  <span>Pajak (10%):</span>
                  <span>{formatRupiah(getTotalPrice() * 0.1)}</span>
                </div>
                <div className="summary-row">
                  <span>Ongkos Kirim:</span>
                  <span>{formatRupiah(25000)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>
                    {formatRupiah(getTotalPrice() + getTotalPrice() * 0.1 + 25000)}
                  </span>
                </div>
              </div>

              <div className="cart-actions">
                <button
                  className="continue-shopping"
                  onClick={() => navigate("/books")}
                  disabled={loading}
                >
                  ← Lanjut Belanja
                </button>
                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "⏳ Processing..." : "✓ Checkout"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="cart-sidebar">
          <div className="payment-card">
            <h3>💳 Metode Pembayaran</h3>
            <div className="payment-methods">
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <label key={method.id} className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">{method.icon}</span>
                      <span className="payment-info">
                        <strong>{method.name}</strong>
                        <small>{method.description}</small>
                      </span>
                    </span>
                  </label>
                ))
              ) : (
                <p>Memuat metode pembayaran...</p>
              )}
            </div>
          </div>

          <div className="promo-card">
            <h3>🎁 Promosi</h3>
            <p>Gratis ongkir untuk pembelian di atas Rp 500.000</p>
          </div>
          <div className="tips-card">
            <h3>💡 Tips</h3>
            <p>Kumpulkan poin loyalty setiap pembelian untuk diskon eksklusif!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
