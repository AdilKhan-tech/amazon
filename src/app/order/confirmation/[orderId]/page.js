"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId;
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("lastOrder");
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    }
  }, []);

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="confirmation-header">
          <div className="success-animation">
            <div className="success-circle">
              <i className="bi bi-check-lg"></i>
            </div>
          </div>
          <h1>Order Placed Successfully!</h1>
          <p className="confirmation-subtitle">Thank you for your order. Your order has been confirmed and will be shipped soon.</p>
          <div className="order-id-badge">
            <span>Order ID:</span>
            <strong>{orderId || orderData?.orderId}</strong>
          </div>
        </div>

        {/* Order Details */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <i className="bi bi-receipt"></i>
            <h3>Order Details</h3>
          </div>
          <div className="confirmation-card-body">
            {orderData ? (
              <>
                {/* Order Info Grid */}
                <div className="order-info-grid">
                  <div className="info-item">
                    <label>Order ID</label>
                    <span>{orderData.orderId}</span>
                  </div>
                  <div className="info-item">
                    <label>Order Date</label>
                    <span>{new Date(orderData.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="info-item">
                    <label>Customer</label>
                    <span>{orderData.shippingAddress?.fullName || 'Guest'}</span>
                  </div>
                  <div className="info-item">
                    <label>Payment</label>
                    <span>{orderData.paymentMethod === 'card' ? 'Credit Card' : orderData.paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="confirmation-section">
                  <h4><i className="bi bi-geo-alt"></i> Shipping Address</h4>
                  <div className="address-display">
                    <strong>{orderData.shippingAddress?.fullName}</strong>
                    <p>
                      {orderData.shippingAddress?.street}<br />
                      {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.zip}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="confirmation-section">
                  <h4><i className="bi bi-box-seam"></i> Order Items</h4>
                  <div className="order-items-list">
                    {orderData.cartItems?.map((item, i) => (
                      <div key={i} className="order-item">
                        <div className="item-img-wrap">
                          <img src={item.image} alt={item.name} className="item-image" />
                        </div>
                        <div className="item-details">
                          <strong>{item.name}</strong>
                          <small>Qty: {item.qty} × ${item.price.toFixed(2)}</small>
                        </div>
                        <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="confirmation-section">
                  <h4><i className="bi bi-calculator"></i> Order Summary</h4>
                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>${orderData.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping</span>
                      <span className="free-label">{orderData.shipping === 0 ? "FREE" : `$${orderData.shipping?.toFixed(2)}`}</span>
                    </div>
                    <div className="total-row">
                      <span>Tax</span>
                      <span>${orderData.tax?.toFixed(2)}</span>
                    </div>
                    <div className="total-divider"></div>
                    <div className="total-row grand-total">
                      <span>Order Total</span>
                      <span>${orderData.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="order-status-bar">
                  <div className="status-icon">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <div className="status-info">
                    <strong>Order Status</strong>
                    <span className="status-pending">Pending</span>
                  </div>
                  <div className="status-timeline">
                    <div className="timeline-item active">
                      <div className="timeline-dot"></div>
                      <span>Placed</span>
                    </div>
                    <div className="timeline-line"></div>
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <span>Processing</span>
                    </div>
                    <div className="timeline-line"></div>
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <span>Shipped</span>
                    </div>
                    <div className="timeline-line"></div>
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data">
                <i className="bi bi-inbox"></i>
                <p>Order details not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <Link href="/order-tracking" className="action-btn primary">
            <i className="bi bi-truck"></i>
            <span>Track Order</span>
          </Link>
          <Link href="/" className="action-btn secondary">
            <i className="bi bi-house"></i>
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
