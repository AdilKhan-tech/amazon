"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AccountLayout from "@/components/AccountLayout";

const statusColors = { Delivered: "success", Shipped: "primary", Processing: "warning", Cancelled: "danger", pending: "warning", delivered: "success", shipped: "primary", processing: "primary", cancelled: "danger" };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userOrders = storedOrders.filter((o) => o.userEmail === storedUser?.email);
    setOrders(userOrders);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="premium-dashboard">
        <div className="premium-loading">
          <div className="loading-spinner"></div>
          <span>Loading orders...</span>
        </div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === "delivered" || o.status === "Delivered").length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "Processing" || o.status === "processing").length;

  return (
    <div className="premium-dashboard">
      <AccountLayout>
        {/* Header */}
        <div className="premium-page-header">
          <div>
            <h2>My Orders</h2>
            <p>Track and manage all your orders</p>
          </div>
          <Link href="/" className="premium-btn">
            <i className="bi bi-bag-plus"></i> Continue Shopping
          </Link>
        </div>

        {/* Stats */}
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
                <h3 className="stat-card-value">{totalOrders}</h3>
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
                <h3 className="stat-card-value">{deliveredOrders}</h3>
                <p className="stat-card-label">Delivered</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                  <i className="bi bi-hourglass-split"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{pendingOrders}</h3>
                <p className="stat-card-label">In Progress</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" }}>
                  <i className="bi bi-currency-dollar"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">${totalSpent.toFixed(2)}</h3>
                <p className="stat-card-label">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="premium-card">
            <div className="premium-card-body">
              <div className="empty-state">
                <div className="empty-icon"><i className="bi bi-inbox"></i></div>
                <h3>No orders yet</h3>
                <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <Link href="/" className="premium-btn">
                  <i className="bi bi-bag-plus"></i> Start Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="premium-card">
            <div className="premium-card-header">
              <h3><i className="bi bi-list-ul"></i> All Orders</h3>
            </div>
            <div className="premium-card-body">
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.orderId} className="order-item-card">
                    <div className="order-item-header">
                      <div className="order-item-info">
                        <span className="order-id-badge">#{order.orderId}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <div className="order-item-meta">
                        <span className="order-total">${order.total?.toFixed(2)}</span>
                        <span className={`status-badge status-${order.status || "pending"}`}>
                          {order.status || "Pending"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items-list">
                      {order.cartItems?.map((item, i) => (
                        <div key={i} className="order-product">
                          <img src={item.image} alt={item.name} className="order-product-img" />
                          <div className="order-product-info">
                            <span className="order-product-name">{item.name}</span>
                            <span className="order-product-qty">Qty: {item.quantity || item.qty || 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Progress */}
                    {order.status !== "Delivered" && order.status !== "delivered" && order.status !== "Cancelled" && order.status !== "cancelled" && (
                      <div className="order-tracking-progress">
                        <div className="tracking-steps">
                          {["Placed", "Processing", "Shipped", "Delivered"].map((s, i) => {
                            const statuses = ["pending", "processing", "shipped", "delivered"];
                            const currentStatus = (order.status || "pending").toLowerCase();
                            const currentIndex = statuses.indexOf(currentStatus);
                            const isActive = i <= Math.max(currentIndex, 0);
                            return (
                              <div key={s} className={`tracking-step ${isActive ? "active" : ""}`}>
                                <div className="tracking-dot">
                                  {isActive ? <i className="bi bi-check"></i> : <span>{i + 1}</span>}
                                </div>
                                <span className="tracking-label">{s}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="order-item-actions">
                      <Link href="/order-tracking" className="order-action-btn">
                        <i className="bi bi-geo-alt"></i> Track Package
                      </Link>
                      <button className="order-action-btn secondary">
                        <i className="bi bi-eye"></i> View Details
                      </button>
                      {(order.status === "Delivered" || order.status === "delivered") && (
                        <button className="order-action-btn warning">
                          <i className="bi bi-arrow-repeat"></i> Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AccountLayout>
    </div>
  );
}
