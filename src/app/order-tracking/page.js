"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderTrackingPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingId, setTrackingId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userOrders = storedOrders.filter((o) => o.userEmail === storedUser?.email);
    setOrders(userOrders);
    if (userOrders.length > 0) {
      setSelectedOrder(userOrders[userOrders.length - 1]);
    }
  }, []);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    const found = orders.find((o) => o.orderId === trackingId);
    setSearchResult(found || null);
    if (found) setSelectedOrder(found);
  };

  const getTrackingSteps = (order) => {
    const status = order?.status || "pending";
    const steps = [
      { label: "Order Placed", desc: "We received your order", icon: "bi-bag-check-fill", done: true, date: order?.createdAt },
      { label: "Processing", desc: "Preparing your items", icon: "bi-gear-fill", done: ["processing", "shipped", "delivered"].includes(status), date: null },
      { label: "Shipped", desc: "On the way to you", icon: "bi-truck", done: ["shipped", "delivered"].includes(status), date: null },
      { label: "Out for Delivery", desc: "Almost there", icon: "bi-box-seam", done: status === "delivered", date: null },
      { label: "Delivered", desc: "Package delivered", icon: "bi-house-check-fill", done: status === "delivered", date: null },
    ];
    return steps;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "#f59e0b", bg: "#fef3c7", label: "Pending" },
      processing: { color: "#3b82f6", bg: "#dbeafe", label: "Processing" },
      shipped: { color: "#8b5cf6", bg: "#ede9fe", label: "Shipped" },
      delivered: { color: "#10b981", bg: "#d1fae5", label: "Delivered" },
    };
    return configs[status] || configs.pending;
  };

  const getEstimatedDelivery = (order) => {
    if (!order?.createdAt) return "";
    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  return (
    <div className="track-page">
      <div className="track-container">
        {/* Page Header */}
        <div className="track-page-header">
          <div>
            <h1>Track Your Order</h1>
            <p>Monitor your order status and delivery progress</p>
          </div>
          <div className="track-header-badge">
            <i className="bi bi-shield-check"></i>
            <span>Secure Tracking</span>
          </div>
        </div>

        {/* Search Section */}
        <div className="track-search-section">
          <form onSubmit={handleTrackOrder} className="track-search-form">
            <div className="track-search-input">
              <i className="bi bi-hash"></i>
              <input
                type="text"
                placeholder="Enter Order ID (e.g., ORD-1234567890)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <button type="submit" className="track-search-btn">
              <i className="bi bi-search"></i>
              <span>Track Order</span>
            </button>
          </form>
          {searchResult && (
            <div className="track-alert success">
              <i className="bi bi-check-circle-fill"></i>
              <span>Order found! Details shown below.</span>
            </div>
          )}
          {trackingId && !searchResult && orders.length > 0 && (
            <div className="track-alert error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>Order not found. Please check your Order ID.</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="track-layout">
          {/* Orders Sidebar */}
          <aside className="track-orders-panel">
            <div className="panel-header">
              <h3><i className="bi bi-receipt"></i> Your Orders</h3>
              <span className="order-count">{orders.length}</span>
            </div>
            
            {orders.length === 0 ? (
              <div className="empty-orders">
                <i className="bi bi-inbox"></i>
                <p>No orders yet</p>
                <Link href="/" className="shop-link">Start Shopping</Link>
              </div>
            ) : (
              <div className="track-orders-list">
                {orders.map((order) => {
                  const config = getStatusConfig(order.status);
                  return (
                    <div
                      key={order.orderId}
                      className={`track-order-card ${selectedOrder?.orderId === order.orderId ? "active" : ""}`}
                      onClick={() => { setSelectedOrder(order); setSearchResult(order); }}
                    >
                      <div className="track-order-top">
                        <span className="track-order-id">{order.orderId}</span>
                        <span className="track-status-pill" style={{ background: config.bg, color: config.color }}>
                          {config.label}
                        </span>
                      </div>
                      <div className="track-order-meta">
                        <span><i className="bi bi-calendar3"></i> {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <div className="track-order-bottom">
                        <span className="track-order-total">${order.total?.toFixed(2)}</span>
                        <span className="track-view-btn">View <i className="bi bi-chevron-right"></i></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Tracking Details */}
          <main className="track-details-panel">
            {!selectedOrder ? (
              <div className="empty-selection">
                <div className="empty-icon">
                  <i className="bi bi-box-seam"></i>
                </div>
                <h3>Select an order to track</h3>
                <p>Choose an order from the list or search by Order ID</p>
              </div>
            ) : (
              <>
                {/* Order Header Card */}
                <div className="track-order-header">
                  <div className="header-left">
                    <div className="order-badge">
                      <span>Order ID</span>
                      <strong>{selectedOrder.orderId}</strong>
                    </div>
                    <div className="order-date">
                      <i className="bi bi-calendar3"></i>
                      <span>Placed on {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="header-right">
                    <div className="order-total-badge">
                      <span>Total</span>
                      <strong>${selectedOrder.total?.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="track-delivery-card">
                  <div className="delivery-icon">
                    <i className="bi bi-truck"></i>
                  </div>
                  <div className="delivery-info">
                    <strong>Estimated Delivery</strong>
                    <span>{getEstimatedDelivery(selectedOrder)}</span>
                  </div>
                  <div className="delivery-status">
                    {(() => {
                      const config = getStatusConfig(selectedOrder.status);
                      return (
                        <span className="delivery-badge" style={{ background: config.bg, color: config.color }}>
                          <i className="bi bi-circle-fill"></i>
                          {config.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="track-progress-card">
                  <h3><i className="bi bi-signpost-split"></i> Tracking Progress</h3>
                  <div className="track-timeline">
                    {getTrackingSteps(selectedOrder).map((step, idx) => (
                      <div key={idx} className={`track-step ${step.done ? "done" : ""} ${idx === 0 || (idx > 0 && !getTrackingSteps(selectedOrder)[idx-1].done) ? "current" : ""}`}>
                        <div className="track-step-dot">
                          {step.done ? <i className="bi bi-check"></i> : <span>{idx + 1}</span>}
                        </div>
                        <div className="track-step-content">
                          <strong>{step.label}</strong>
                          <span>{step.desc}</span>
                        </div>
                        {idx < 4 && <div className="track-step-line"></div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="track-info-grid">
                  <div className="track-info-card">
                    <div className="info-card-header">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>Shipping Address</span>
                    </div>
                    <div className="info-card-body">
                      <strong>{selectedOrder.shippingAddress?.fullName}</strong>
                      <p>{selectedOrder.shippingAddress?.street}</p>
                      <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}</p>
                      {selectedOrder.shippingAddress?.phone && <p className="phone"><i className="bi bi-telephone"></i> {selectedOrder.shippingAddress.phone}</p>}
                    </div>
                  </div>

                  <div className="track-info-card">
                    <div className="info-card-header">
                      <i className="bi bi-credit-card-fill"></i>
                      <span>Payment Method</span>
                    </div>
                    <div className="info-card-body">
                      <strong className="capitalize">{selectedOrder.paymentMethod === "card" ? "Credit Card" : selectedOrder.paymentMethod === "paypal" ? "PayPal" : "Cash on Delivery"}</strong>
                      {selectedOrder.paymentMethod === "card" && <p>**** **** **** 3456</p>}
                    </div>
                  </div>

                  <div className="track-info-card">
                    <div className="info-card-header">
                      <i className="bi bi-truck"></i>
                      <span>Shipping Method</span>
                    </div>
                    <div className="info-card-body">
                      <strong>{selectedOrder.selectedShipping === 0 ? "Standard Delivery" : selectedOrder.selectedShipping === 1 ? "Expedited Delivery" : "Next Day Delivery"}</strong>
                      <p>{selectedOrder.selectedShipping === 0 ? "5-7 business days" : selectedOrder.selectedShipping === 1 ? "2-3 business days" : "Next business day"}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="track-items-card">
                  <div className="items-card-header">
                    <h3><i className="bi bi-bag-check-fill"></i> Order Items</h3>
                    <span className="item-count">{selectedOrder.cartItems?.length || 0} items</span>
                  </div>
                  <div className="track-items-list">
                    {selectedOrder.cartItems?.map((item, idx) => (
                      <div key={idx} className="track-item-row">
                        <div className="track-item-img">
                          <img src={item.image || "/placeholder.png"} alt={item.name} />
                        </div>
                        <div className="track-item-info">
                          <h4>{item.name}</h4>
                          <span className="track-item-qty">Qty: {item.qty}</span>
                          <span className="track-item-unit">${item.price.toFixed(2)} each</span>
                        </div>
                        <div className="track-item-price">
                          <strong>${(item.price * item.qty).toFixed(2)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="track-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="free">{selectedOrder.shipping === 0 ? "FREE" : `$${selectedOrder.shipping?.toFixed(2)}`}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax</span>
                      <span>${selectedOrder.tax?.toFixed(2)}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                      <span>Order Total</span>
                      <span>${selectedOrder.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
