"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders.reverse());
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setSelectedStatus(selectedOrder.status || "pending");
    }
  }, [selectedOrder]);

  const handleUpdateStatus = () => {
    if (!selectedOrder) return;
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = storedOrders.map((o) =>
      o.orderId === selectedOrder.orderId ? { ...o, status: selectedStatus } : o
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    const reversed = [...updatedOrders].reverse();
    setOrders(reversed);
    setSelectedOrder({ ...selectedOrder, status: selectedStatus });
  };

  const formatCurrency = (amount) => `$${amount?.toFixed(2) || "0.00"}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status?.toLowerCase()] || "#6b7280";
  };

  return (
    <div className="admin-page">
      <AdminLayout>
        {/* Header */}
        <div className="page-header">
          <div>
            <h4 className="page-title">Orders</h4>
            <p className="page-subtitle">Manage and track customer orders</p>
          </div>
          <div className="page-actions">
            <div className="order-count-badge">
              <i className="bi bi-bag-check"></i>
              <span>{orders.length} Orders</span>
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="order-stats-grid">
          <div className="order-stat-card" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
            <div className="order-stat-icon">
              <i className="bi bi-clock-history"></i>
            </div>
            <div className="order-stat-info">
              <span className="order-stat-number">{orders.filter(o => !o.status || o.status === "pending").length}</span>
              <span className="order-stat-label">Pending</span>
            </div>
          </div>
          <div className="order-stat-card" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
            <div className="order-stat-icon">
              <i className="bi bi-gear"></i>
            </div>
            <div className="order-stat-info">
              <span className="order-stat-number">{orders.filter(o => o.status === "processing").length}</span>
              <span className="order-stat-label">Processing</span>
            </div>
          </div>
          <div className="order-stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
            <div className="order-stat-icon">
              <i className="bi bi-truck"></i>
            </div>
            <div className="order-stat-info">
              <span className="order-stat-number">{orders.filter(o => o.status === "shipped").length}</span>
              <span className="order-stat-label">Shipped</span>
            </div>
          </div>
          <div className="order-stat-card" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <div className="order-stat-icon">
              <i className="bi bi-check-circle"></i>
            </div>
            <div className="order-stat-info">
              <span className="order-stat-number">{orders.filter(o => o.status === "delivered").length}</span>
              <span className="order-stat-label">Delivered</span>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bi bi-inbox"></i>
            </div>
            <h5>No orders yet</h5>
            <p>Orders will appear here once customers make purchases</p>
          </div>
        ) : (
          <div className="orders-layout">
            {/* Orders List */}
            <div className="orders-list-panel">
              <div className="panel-header">
                <h5>Recent Orders</h5>
                <select className="status-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div className="orders-list">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className={`order-row ${selectedOrder?.orderId === order.orderId ? "selected" : ""}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-main">
                      <div className="order-id-col">
                        <span className="order-id">{order.orderId}</span>
                        <span className="order-date">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-customer-col">
                        <span className="customer-name">{order.shippingAddress?.fullName}</span>
                        <span className="customer-phone">{order.shippingAddress?.phone}</span>
                      </div>
                      <div className="order-items-col">
                        <span className="items-count">{order.cartItems?.length || 0} items</span>
                      </div>
                      <div className="order-total-col">
                        <span className="order-total">{formatCurrency(order.total)}</span>
                      </div>
                      <div className="order-status-col">
                        <span className="status-pill" style={{ background: `${getStatusColor(order.status || "pending")}20`, color: getStatusColor(order.status || "pending") }}>
                          {order.status || "Pending"}
                        </span>
                      </div>
                      <div className="order-action-col">
                        <button className="view-btn" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details Panel */}
            <div className="order-details-panel">
              {selectedOrder ? (
                <div className="details-card">
                  <div className="details-header">
                    <h5>Order Details</h5>
                    <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <div className="details-body">
                    <div className="detail-section">
                      <label>Order ID</label>
                      <p className="detail-value">{selectedOrder.orderId}</p>
                    </div>

                    <div className="detail-section">
                      <label>Customer</label>
                      <p className="detail-value">{selectedOrder.shippingAddress?.fullName}</p>
                      <p className="detail-sub">{selectedOrder.shippingAddress?.phone}</p>
                    </div>

                    <div className="detail-section">
                      <label>Shipping Address</label>
                      <p className="detail-value">
                        {selectedOrder.shippingAddress?.street}<br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}
                      </p>
                    </div>

                    <div className="detail-section">
                      <label>Items</label>
                      <div className="items-list">
                        {selectedOrder.cartItems?.map((item, i) => (
                          <div key={i} className="item-row">
                            <img src={item.image} alt="" className="item-thumb" />
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              <span className="item-qty">Qty: {item.qty}</span>
                            </div>
                            <span className="item-price">{formatCurrency(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="detail-section totals-section">
                      <div className="total-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="total-row">
                        <span>Shipping</span>
                        <span className="text-success">{selectedOrder.shipping === 0 ? "FREE" : formatCurrency(selectedOrder.shipping)}</span>
                      </div>
                      <div className="total-row">
                        <span>Tax</span>
                        <span>{formatCurrency(selectedOrder.tax)}</span>
                      </div>
                      <div className="total-row grand-total">
                        <span>Total</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <label>Status</label>
                      <div className="status-actions">
                        <select className="status-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button className="update-status-btn" onClick={handleUpdateStatus}>
                          <i className="bi bi-check-lg"></i> Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-details">
                  <i className="bi bi-arrow-left-circle"></i>
                  <p>Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </AdminLayout>
    </div>
  );
}
