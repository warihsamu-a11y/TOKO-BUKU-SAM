import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useContext(CartContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      onLoginSuccess();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
    } finally {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      return;
    }
    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      setIsLogin(true);
      setUsername("");
      setPassword("");
      setEmail("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Register error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <img src="/logo2.png" alt="Toko Buku Logo" className="logo-image" />
            <h2>Samm Store</h2>
          </div>

          <div className="sidebar-info">
            <div className="info-item">
              <span className="info-icon">📖</span>
              <div>
                <h4>Ribuan Buku</h4>
                <p>Pilihan terlengkap</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🚚</span>
              <div>
                <h4>Pengiriman Cepat</h4>
                <p>Sampai dalam 2-3 hari</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">💰</span>
              <div>
                <h4>Harga Terjangkau</h4>
                <p>Diskon hingga 30%</p>
              </div>
            </div>
          </div>

          <div className="sidebar-features">
            <div className="feature-badge">⭐ Rating 4.8/5</div>
            <div className="feature-badge">✅ Terpercaya</div>
            <div className="feature-badge">🔒 Aman</div>
          </div>
        </div>
      </div>

      <div className="login-container">
        <form className="login-form" onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="login-header">
            <img src="/logo2.png" alt="Toko Buku Logo" className="logo-image" />
            <h2>Samm Store</h2>
          </div>

          {isLogin ? (
            <>
              <p className="form-subtitle">Masuk ke akun Anda</p>
              
              <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <span className="spinner"></span> Loading...
                  </>
                ) : (
                  "✓ Login"
                )}
              </button>

              <p className="hint">
                Belum punya akun? <span onClick={() => {
                  setIsLogin(false);
                  setUsername("");
                  setPassword("");
                }} className="toggle-link">Daftar di sini</span>
              </p>
            </>
          ) : (
            <>
              <p className="form-subtitle">Buat akun baru Anda</p>
              
              <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Buat username unik"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Konfirmasi Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type="password"
                    placeholder="Ketik ulang password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn register-btn">
                {loading ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  "✓ Daftar"
                )}
              </button>

              <p className="hint">
                Sudah punya akun? <span onClick={() => {
                  setIsLogin(true);
                  setEmail("");
                  setConfirmPassword("");
                }} className="toggle-link">Login di sini</span>
              </p>
            </>
          )}

          <div className="footer-text">
            <p>© 2025 Samm Store. Semua hak dilindungi.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
