"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";

const API_URL = "/api";

export default function AdminAnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0 });
  const [loading, setLoading] = useState(true);
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

    // Fetch orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const totalRevenue = storedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Calculate monthly data (last 6 months)
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.toLocaleDateString("en-US", { month: "short" }),
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
    setMonthlyData(months);

    // Fetch products count
    fetch(`${API_URL}/products?limit=1`)
      .then((r) => r.json())
      .then((data) => {
        const productsCount = data.total || data.products?.length || 0;

        // Fetch users count
        fetch(`${API_URL}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.json())
          .then((usersData) => {
            const usersCount = Array.isArray(usersData) ? usersData.length : (usersData.users?.length || 1);
            setStats({
              revenue: totalRevenue,
              orders: storedOrders.length,
              products: productsCount,
              users: usersCount,
            });
          })
          .catch(() => {
            setStats({
              revenue: totalRevenue,
              orders: storedOrders.length,
              products: productsCount,
              users: 1,
            });
          });
      })
      .catch(() => {});
    setLoading(false);
  }, [router]);

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);
  const maxOrders = Math.max(...monthlyData.map((d) => d.orders), 1);
  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = monthlyData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = stats.users > 0 ? ((stats.orders / stats.users) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="premium-dashboard">
        <div className="premium-loading">
          <div className="loading-spinner"></div>
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-dashboard">
      <AdminLayout>
        {/* Header */}
        <div className="premium-page-header">
          <div>
            <h2>Sales Analytics</h2>
            <p>Track your store performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="premium-stats">
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <span className="stat-card-trend">+18.2%</span>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">${stats.revenue.toLocaleString()}</h3>
                <p className="stat-card-label">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}>
                  <i className="bi bi-bag-check"></i>
                </div>
                <span className="stat-card-trend">+12.5%</span>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{stats.orders.toLocaleString()}</h3>
                <p className="stat-card-label">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                  <i className="bi bi-receipt"></i>
                </div>
                <span className="stat-card-trend">+5.1%</span>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">${avgOrderValue.toFixed(2)}</h3>
                <p className="stat-card-label">Avg Order Value</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
                  <i className="bi bi-graph-up"></i>
                </div>
                <span className="stat-card-trend negative">-0.4%</span>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{conversionRate}%</h3>
                <p className="stat-card-label">Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="premium-card chart-section">
          <div className="premium-card-header">
            <h3><i className="bi bi-graph-up-arrow"></i> Monthly Revenue</h3>
            <span className="chart-total-badge">${totalRevenue.toLocaleString()}</span>
          </div>
          <div className="premium-card-body">
            <div className="premium-chart">
              {monthlyData.map((d) => {
                const height = Math.max((d.revenue / maxRevenue) * 100, 8);
                return (
                  <div key={d.month} className="chart-bar-group">
                    <span className="chart-bar-amount">${(d.revenue / 1000).toFixed(1)}k</span>
                    <div className="chart-bar-track">
                      <div className="chart-bar-fill revenue" style={{ height: `${height}%` }}></div>
                    </div>
                    <span className="chart-bar-month">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="premium-card chart-section">
          <div className="premium-card-header">
            <h3><i className="bi bi-bag-check"></i> Monthly Orders</h3>
            <span className="chart-total-badge">{totalOrders.toLocaleString()} orders</span>
          </div>
          <div className="premium-card-body">
            <div className="premium-chart">
              {monthlyData.map((d) => {
                const height = Math.max((d.orders / maxOrders) * 100, 8);
                return (
                  <div key={d.month} className="chart-bar-group">
                    <span className="chart-bar-amount">{d.orders}</span>
                    <div className="chart-bar-track">
                      <div className="chart-bar-fill orders" style={{ height: `${height}%` }}></div>
                    </div>
                    <span className="chart-bar-month">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}
