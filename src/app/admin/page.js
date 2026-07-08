"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import SalesActivityChart from "@/components/SalesActivityChart";
import OrderActivityChart from "@/components/OrderActivityChart";
import CustomerActivityChart from "@/components/CustomerActivityChart";

const API_URL = "/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [orderActivity, setOrderActivity] = useState([]);
  const [customerActivity, setCustomerActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== "admin") {
      router.push("/");
      return;
    }
    setUser(u);

    fetch(`${API_URL}/products?limit=1`)
      .then((r) => r.json())
      .then((data) => {
        const productsCount = data.total || data.products?.length || 0;
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const totalRevenue = storedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            label: d.toLocaleDateString("en-US", { month: "short" }),
            revenue: 0,
            orders: 0,
          });
        }
        storedOrders.forEach((o) => {
          const orderDate = new Date(o.createdAt);
          const monthDiff = (now.getFullYear() - orderDate.getFullYear()) * 12 + (now.getMonth() - orderDate.getMonth());
          if (monthDiff >= 0 && monthDiff < 6) {
            const idx = 5 - monthDiff;
            months[idx].revenue += o.total || 0;
            months[idx].orders += 1;
          }
        });
        setMonthlySales(months);
        setOrderActivity(months.map(m => ({ label: m.label, orders: m.orders })));

        fetch(`${API_URL}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.json())
          .then((usersData) => {
            const usersList = Array.isArray(usersData) ? usersData : (usersData.users || []);
            const usersCount = usersList.length || 1;
            setStats({ orders: storedOrders.length, revenue: totalRevenue, products: productsCount, users: usersCount });

            // Build customer activity from user registration dates
            const customerMonths = [];
            for (let i = 5; i >= 0; i--) {
              const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
              customerMonths.push({
                label: d.toLocaleDateString("en-US", { month: "short" }),
                customers: 0,
                cumulative: 0,
              });
            }
            usersList.forEach((u) => {
              const regDate = new Date(u.createdAt || u.created_at || u.registeredAt);
              if (isNaN(regDate.getTime())) return;
              const monthDiff = (now.getFullYear() - regDate.getFullYear()) * 12 + (now.getMonth() - regDate.getMonth());
              if (monthDiff >= 0 && monthDiff < 6) {
                const idx = 5 - monthDiff;
                customerMonths[idx].customers += 1;
              }
            });
            // If no user dates, distribute evenly
            if (customerMonths.every(m => m.customers === 0) && usersCount > 0) {
              const perMonth = Math.ceil(usersCount / 6);
              customerMonths.forEach((m, i) => {
                m.customers = i < 5 ? perMonth : usersCount - perMonth * 5;
              });
            }
            let cumulative = 0;
            customerMonths.forEach(m => {
              cumulative += m.customers;
              m.cumulative = cumulative;
            });
            setCustomerActivity(customerMonths);
          })
          .catch(() => {
            setStats({ orders: storedOrders.length, revenue: totalRevenue, products: productsCount, users: 1 });
            // Fallback customer data
            const fallback = [];
            for (let i = 5; i >= 0; i--) {
              const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
              fallback.push({
                label: d.toLocaleDateString("en-US", { month: "short" }),
                customers: 0,
                cumulative: 0,
              });
            }
            setCustomerActivity(fallback);
          });
        setRecentOrders(storedOrders.slice(0, 5));
      })
      .catch(() => {});
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="premium-dashboard">
        <div className="premium-loading">
          <div className="loading-spinner"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const statCards = [
    { title: "Total Revenue", value: `$${(stats.revenue || 0).toFixed(2)}`, icon: "bi-currency-dollar", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", trend: "+12.5%" },
    { title: "Total Orders", value: stats.orders, icon: "bi-bag-check", gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", trend: "+8.2%" },
    { title: "Total Products", value: stats.products, icon: "bi-box-seam", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", trend: "+3" },
    { title: "Total Users", value: stats.users, icon: "bi-people", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", trend: "+5" },
  ];

  return (
    <AdminLayout>
    <div className="premium-dashboard">
      {/* Welcome Banner */}
      <div className="premium-welcome">
        <div className="welcome-content">
          <div className="welcome-text">
            <div className="welcome-greeting">
              <i className="bi bi-hand-thumbs-up-fill"></i>
            </div>
            <h1>Welcome back, {user?.name || "MR. Khosti"}!</h1>
            <p>Here&apos;s what&apos;s happening with your store today</p>
          </div>
          <div className="welcome-date-badge">
            <i className="bi bi-calendar3"></i>
            <div className="welcome-date-inner">
              <span className="welcome-date-day">{new Date().toLocaleDateString("en-US", { weekday: "long" })}</span>
              <span className="welcome-date-full">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>
        <div className="welcome-decoration">
          <div className="decoration-circle c1"></div>
          <div className="decoration-circle c2"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="premium-stats">
        {statCards.map((stat, i) => (
          <div key={i} className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: stat.gradient }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: stat.gradient }}>
                  <i className={`bi ${stat.icon}`}></i>
                </div>
                <span className="stat-card-trend">{stat.trend}</span>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{stat.value}</h3>
                <p className="stat-card-label">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="premium-actions">
        <Link href="/admin/products/new" className="premium-action-btn">
          <div className="action-btn-icon" style={{ background: "#eef2ff", color: "#6366f1" }}>
            <i className="bi bi-plus-lg"></i>
          </div>
          <span>Add Product</span>
        </Link>
        <Link href="/admin/orders" className="premium-action-btn">
          <div className="action-btn-icon" style={{ background: "#ecfdf5", color: "#10b981" }}>
            <i className="bi bi-bag-fill"></i>
          </div>
          <span>View Orders</span>
        </Link>
        <Link href="/admin/products" className="premium-action-btn">
          <div className="action-btn-icon" style={{ background: "#fef3c7", color: "#f59e0b" }}>
            <i className="bi bi-box-seam-fill"></i>
          </div>
          <span>Products</span>
        </Link>
        <Link href="/admin/customers" className="premium-action-btn">
          <div className="action-btn-icon" style={{ background: "#fdf2f8", color: "#ec4899" }}>
            <i className="bi bi-people-fill"></i>
          </div>
          <span>Customers</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="premium-grid">
        {/* Recent Orders */}
        <div className="premium-card">
          <div className="premium-card-header">
            <h3>Recent Orders</h3>
            <Link href="/admin/orders" className="view-all">View All <i className="bi bi-arrow-right"></i></Link>
          </div>
          <div className="premium-card-body">
            {recentOrders.length === 0 ? (
              <div className="empty-state-card">
                <i className="bi bi-inbox"></i>
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="premium-orders-list">
                {recentOrders.map((order, i) => (
                  <div key={i} className="premium-order-item">
                    <div className="order-item-left">
                      <div className="order-avatar">{order.shippingAddress?.fullName?.charAt(0) || "C"}</div>
                      <div className="order-item-info">
                        <span className="order-item-id">{order.orderId}</span>
                        <span className="order-item-name">{order.shippingAddress?.fullName || "Customer"}</span>
                      </div>
                    </div>
                    <div className="order-item-right">
                      <span className="order-item-amount">${order.total?.toFixed(2)}</span>
                      <span className={`order-status status-${(order.status || "pending").toLowerCase()}`}>
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Status */}
        <div className="premium-card">
          <div className="premium-card-header">
            <h3>Order Status</h3>
          </div>
          <div className="premium-card-body">
            <div className="status-list">
              {[
                { label: "Pending", count: recentOrders.filter(o => (o.status || "pending") === "pending").length, color: "#f59e0b", bg: "#fef3c7", icon: "bi-clock-fill" },
                { label: "Processing", count: recentOrders.filter(o => o.status === "processing").length, color: "#3b82f6", bg: "#dbeafe", icon: "bi-gear-fill" },
                { label: "Shipped", count: recentOrders.filter(o => o.status === "shipped").length, color: "#8b5cf6", bg: "#ede9fe", icon: "bi-truck" },
                { label: "Delivered", count: recentOrders.filter(o => o.status === "delivered").length, color: "#10b981", bg: "#d1fae5", icon: "bi-check-circle-fill" },
                { label: "Cancelled", count: recentOrders.filter(o => o.status === "cancelled").length, color: "#ef4444", bg: "#fee2e2", icon: "bi-x-circle-fill" },
              ].map((item, i) => (
                <div key={i} className="status-list-item">
                  <div className="status-icon-box" style={{ background: item.bg, color: item.color }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div className="status-info">
                    <span className="status-name">{item.label}</span>
                    <span className="status-count">{item.count} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <SalesActivityChart data={monthlySales} />
        <OrderActivityChart data={orderActivity} />
        <CustomerActivityChart data={customerActivity} />
      </div>
    </div>
    </AdminLayout>
  );
}
