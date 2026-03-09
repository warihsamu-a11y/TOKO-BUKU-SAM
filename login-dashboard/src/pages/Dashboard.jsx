import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { formatRupiahShort } from "../utils/formatCurrency";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { orders, user } = useContext(CartContext);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch statistics dari API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch statistics dari backend
        const statsRes = await fetch("http://localhost:5000/api/stats");
        const data = statsRes.ok ? await statsRes.json() : {
          totalProducts: 8,
          totalUsers: 1,
          totalOrders: 0,
          totalRevenue: 0
        };
        
        // Map API response ke state
        setStats({
          totalBooks: data.totalProducts,
          totalUsers: data.totalUsers,
          totalOrders: data.totalOrders,
          totalRevenue: data.totalRevenue
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Fallback values
        setStats({
          totalBooks: 8,
          totalUsers: 1,
          totalOrders: 0,
          totalRevenue: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Selamat Datang, Di Toko Buku Kami! 👋</h2>
          <p>Anda telah berhasil login ke sistem Samm Store kami.</p>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>📚 Total Buku</h3>
            <p className="stat-number">{stats.totalBooks}</p>
          </div>
          <div className="stat-card">
            <h3>👥 Total Pengguna</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>📦 Total Pesanan</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>💰 Total Pendapatan</h3>
            <p className="stat-number">{formatRupiahShort(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="menu-container">
          <h3>Menu Utama</h3>
          <div className="menu-buttons">
            <button className="menu-btn" onClick={() => navigate("/books")}>
              📖 Jelajahi Buku
            </button>
            <button className="menu-btn" onClick={() => navigate("/cart")}>
              🛒 Keranjang Belanja
            </button>
            <button className="menu-btn" onClick={() => navigate("/orders")}>
              📦 Riwayat Pesanan
            </button>
            <button className="menu-btn" onClick={() => navigate("/profile")}>
              👤 Profil Saya
            </button>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>🎁 Penawaran Spesial</h3>
            <p>Dapatkan diskon hingga 30% untuk pembelian buku programming!</p>
          </div>
          <div className="info-card">
            <h3>⭐ Buku Terlaris</h3>
            <p>Clean Code - Robert C. Martin | Rating 4.8/5</p>
          </div>
          <div className="info-card">
            <h3>🚀 Pengiriman Cepat</h3>
            <p>Gratis ongkos kirim untuk pembelian di atas Rp 500.000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
