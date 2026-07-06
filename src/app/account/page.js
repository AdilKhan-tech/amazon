"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AccountLayout from "@/components/AccountLayout";

const API_URL = "/api";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
      return;
    }
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      });

    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);

    // Load wishlist from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(storedWishlist);

    setLoading(false);
  }, [router]);

  const userOrders = orders.filter((o) => o.userEmail === user?.email);

  if (loading) {
    return (
      <div className="premium-dashboard">
        <div className="premium-loading">
          <div className="loading-spinner"></div>
          <span>Loading account...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const completedOrders = userOrders.filter((o) => o.status === "delivered").length;

  return (
    <div className="premium-dashboard">
      <AccountLayout>
        {/* Welcome Header */}
        <div className="premium-welcome">
          <div className="welcome-inner">
            <div>
              <h2>Welcome back, {user.name.split(" ")[0]}!</h2>
              <p>Here's what's happening with your account today</p>
            </div>
            <div className="welcome-date">
              <i className="bi bi-calendar3"></i>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>
          <div className="welcome-decoration">
            <div className="welcome-circle welcome-circle-1"></div>
            <div className="welcome-circle welcome-circle-2"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="premium-stats">
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}>
                  <i className="bi bi-bag-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{userOrders.length}</h3>
                <p className="stat-card-label">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                  <i className="bi bi-check-circle-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{completedOrders}</h3>
                <p className="stat-card-label">Completed</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                  <i className="bi bi-currency-dollar"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">${totalSpent.toFixed(2)}</h3>
                <p className="stat-card-label">Total Spent</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" }}>
                  <i className="bi bi-heart-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{wishlist.length}</h3>
                <p className="stat-card-label">Wishlist Items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="premium-actions">
          <Link href="/account/orders" className="premium-action-card">
            <div className="action-icon" style={{ background: "#eef2ff", color: "#6366f1" }}>
              <i className="bi bi-bag-fill"></i>
            </div>
            <h4>Your Orders</h4>
            <p>Track, return, or buy again</p>
          </Link>
          <Link href="/account/wishlist" className="premium-action-card">
            <div className="action-icon" style={{ background: "#fdf2f8", color: "#ec4899" }}>
              <i className="bi bi-heart-fill"></i>
            </div>
            <h4>Wishlist</h4>
            <p>View your saved items</p>
          </Link>
          <Link href="/order-tracking" className="premium-action-card">
            <div className="action-icon" style={{ background: "#ecfdf5", color: "#10b981" }}>
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <h4>Track Order</h4>
            <p>Check delivery status</p>
          </Link>
          <Link href="/" className="premium-action-card">
            <div className="action-icon" style={{ background: "#fef3c7", color: "#f59e0b" }}>
              <i className="bi bi-bag-plus-fill"></i>
            </div>
            <h4>Continue Shopping</h4>
            <p>Browse more products</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="premium-card">
          <div className="premium-card-header">
            <h3><i className="bi bi-bag-fill"></i> Recent Orders</h3>
            <Link href="/account/orders" className="view-all-link">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="premium-card-body">
            {userOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><i className="bi bi-bag-x"></i></div>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <Link href="/" className="premium-btn">
                  <i className="bi bi-bag-plus"></i> Start Shopping
                </Link>
              </div>
            ) : (
              <div className="premium-table-wrapper">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.slice(0, 5).map((order) => (
                      <tr key={order.orderId}>
                        <td><span className="order-id-text">#{order.orderId}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                        <td>{order.cartItems?.length || 0} items</td>
                        <td className="order-total-cell">${order.total?.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge status-${order.status || "pending"}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <Link href="/order-tracking" className="view-order-link">
                            <i className="bi bi-eye"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AccountLayout>
    </div>
  );
}
