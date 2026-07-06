"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState(0);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    const productId = searchParams.get("productId");
    const name = searchParams.get("name");
    const price = searchParams.get("price");
    const image = searchParams.get("image");
    const qty = searchParams.get("qty");

    if (productId && name && price) {
      setCheckoutProduct({
        id: productId,
        name: decodeURIComponent(name),
        price: parseFloat(price),
        image: decodeURIComponent(image || ""),
        qty: parseInt(qty) || 1,
      });
    }
  }, [searchParams]);

  const savedAddresses = [
    { id: 1, name: "Home", address: "123 Main Street, Apt 4B", city: "New York", state: "NY", zip: "10001", country: "US" },
    { id: 2, name: "Office", address: "456 Business Ave, Suite 100", city: "New York", state: "NY", zip: "10018", country: "US" },
  ];

  const shippingOptions = [
    { name: "Standard Delivery", time: "5-7 business days", price: "FREE", icon: "bi-truck" },
    { name: "Expedited Delivery", time: "2-3 business days", price: "$12.99", icon: "bi-lightning-charge" },
    { name: "Next Day Delivery", time: "Next business day", price: "$24.99", icon: "bi-clock-history" },
  ];

  const cartItems = checkoutProduct ? [checkoutProduct] : [
    { id: 1, name: "iPhone 15 Pro Max", price: 1199.99, qty: 1, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop" },
    { id: 2, name: "Sony WH-1000XM5", price: 298.00, qty: 2, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = selectedShipping === 0 ? 0 : selectedShipping === 1 ? 12.99 : 24.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    const orderId = `ORD-${Date.now()}`;
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const orderData = {
      orderId,
      cartItems,
      shippingAddress,
      selectedShipping,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      userId: storedUser?.id || null,
      userEmail: storedUser?.email || null,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage for confirmation page
    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    // Save to orders list for admin
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // Redirect to confirmation page
    window.location.href = `/order/confirmation/${orderId}`;
  };

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <Link href="/" className="checkout-logo">
            <i className="bi bi-box-seam"></i>
            <span>Sohail<span className="text-warning">Verse</span></span>
          </Link>
          <h2 className="checkout-title">Checkout</h2>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {[
            { num: 1, label: "Address", icon: "bi-geo-alt" },
            { num: 2, label: "Shipping", icon: "bi-truck" },
            { num: 3, label: "Payment", icon: "bi-credit-card" },
            { num: 4, label: "Review", icon: "bi-check-circle" },
          ].map((s, i) => (
            <div key={s.num} className="step-item">
              <div className={`step-circle ${step >= s.num ? "active" : ""} ${step > s.num ? "completed" : ""}`}>
                {step > s.num ? <i className="bi bi-check"></i> : <i className={`bi ${s.icon}`}></i>}
              </div>
              <span className={`step-label ${step >= s.num ? "active" : ""}`}>{s.label}</span>
              {i < 3 && <div className={`step-line ${step > s.num ? "active" : ""}`}></div>}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="checkout-card fade-in">
                <div className="card-header-modern">
                  <i className="bi bi-geo-alt-fill"></i>
                  <h5>Shipping Address</h5>
                </div>
                <div className="card-body-modern">
                  {/* Saved Addresses */}
                  <div className="address-grid">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`address-card ${selectedAddress === addr.id ? "selected" : ""}`}
                        onClick={() => setSelectedAddress(addr.id)}
                      >
                        <div className="address-header">
                          <strong>{addr.name}</strong>
                          <div className={`radio-indicator ${selectedAddress === addr.id ? "active" : ""}`}>
                            {selectedAddress === addr.id && <i className="bi bi-check-circle-fill"></i>}
                          </div>
                        </div>
                        <p className="address-text">
                          {addr.address}<br />
                          {addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add New Address */}
                  <div className="new-address-section">
                    <h6 className="section-subtitle">Add New Address</h6>
                    <div className="address-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label-modern">Full Name</label>
                          <input type="text" className="form-control-modern" placeholder="John Doe" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label-modern">Phone</label>
                          <input type="tel" className="form-control-modern" placeholder="+1 234 567 890" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group full">
                          <label className="form-label-modern">Street Address</label>
                          <input type="text" className="form-control-modern" placeholder="123 Main Street" value={shippingAddress.street} onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label-modern">City</label>
                          <input type="text" className="form-control-modern" placeholder="New York" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label-modern">State</label>
                          <input type="text" className="form-control-modern" placeholder="NY" value={shippingAddress.state} onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label-modern">ZIP Code</label>
                          <input type="text" className="form-control-modern" placeholder="10001" value={shippingAddress.zip} onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="btn-continue" onClick={() => setStep(2)}>
                      Continue to Shipping <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="checkout-card fade-in">
                <div className="card-header-modern">
                  <i className="bi bi-truck"></i>
                  <h5>Delivery Method</h5>
                </div>
                <div className="card-body-modern">
                  <div className="shipping-options">
                    {shippingOptions.map((option, i) => (
                      <div
                        key={i}
                        className={`shipping-card ${selectedShipping === i ? "selected" : ""}`}
                        onClick={() => setSelectedShipping(i)}
                      >
                        <div className="shipping-icon">
                          <i className={`bi ${option.icon}`}></i>
                        </div>
                        <div className="shipping-info">
                          <strong>{option.name}</strong>
                          <small>{option.time}</small>
                        </div>
                        <div className={`shipping-price ${option.price === "FREE" ? "free" : ""}`}>
                          {option.price}
                        </div>
                        <div className={`radio-indicator ${selectedShipping === i ? "active" : ""}`}>
                          {selectedShipping === i && <i className="bi bi-check-circle-fill"></i>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-actions">
                    <button className="btn-back" onClick={() => setStep(1)}>
                      <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <button className="btn-continue" onClick={() => setStep(3)}>
                      Continue to Payment <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="checkout-card fade-in">
                <div className="card-header-modern">
                  <i className="bi bi-credit-card"></i>
                  <h5>Payment Method</h5>
                </div>
                <div className="card-body-modern">
                  <div className="payment-methods">
                    {[
                      { id: "card", name: "Credit / Debit Card", desc: "Visa, MasterCard, Amex", icon: "bi-credit-card" },
                      { id: "paypal", name: "PayPal", desc: "Pay with your PayPal account", icon: "bi-paypal" },
                      { id: "cod", name: "Cash on Delivery", desc: "Pay when you receive", icon: "bi-cash-stack" },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`payment-card ${paymentMethod === method.id ? "selected" : ""}`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <i className={`bi ${method.icon} payment-icon`}></i>
                        <div className="payment-info">
                          <strong>{method.name}</strong>
                          <small>{method.desc}</small>
                        </div>
                        <div className={`radio-indicator ${paymentMethod === method.id ? "active" : ""}`}>
                          {paymentMethod === method.id && <i className="bi bi-check-circle-fill"></i>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="card-form">
                      <div className="form-row">
                        <div className="form-group full">
                          <label className="form-label-modern">Card Number</label>
                          <input type="text" className="form-control-modern" placeholder="1234 5678 9012 3456" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label-modern">Expiry Date</label>
                          <input type="text" className="form-control-modern" placeholder="MM/YY" />
                        </div>
                        <div className="form-group">
                          <label className="form-label-modern">CVV</label>
                          <input type="text" className="form-control-modern" placeholder="123" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group full">
                          <label className="form-label-modern">Name on Card</label>
                          <input type="text" className="form-control-modern" placeholder="John Doe" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card-actions">
                    <button className="btn-back" onClick={() => setStep(2)}>
                      <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <button className="btn-continue" onClick={() => setStep(4)}>
                      Review Order <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="checkout-card fade-in">
                <div className="card-header-modern">
                  <i className="bi bi-check-circle"></i>
                  <h5>Review Your Order</h5>
                </div>
                <div className="card-body-modern">
                  <div className="review-sections">
                    <div className="review-item">
                      <div className="review-label">
                        <i className="bi bi-geo-alt"></i>
                        <span>Shipping Address</span>
                      </div>
                      <div className="review-value">
                        <strong>{shippingAddress.fullName}</strong>
                        <p>{shippingAddress.street}<br />{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                      </div>
                    </div>
                    <div className="review-item">
                      <div className="review-label">
                        <i className="bi bi-truck"></i>
                        <span>Delivery Method</span>
                      </div>
                      <div className="review-value">
                        <strong>{shippingOptions[selectedShipping].name}</strong>
                        <p>{shippingOptions[selectedShipping].time}</p>
                      </div>
                    </div>
                    <div className="review-item">
                      <div className="review-label">
                        <i className="bi bi-credit-card"></i>
                        <span>Payment Method</span>
                      </div>
                      <div className="review-value">
                        <strong>{paymentMethod === "card" ? "Credit Card" : paymentMethod === "paypal" ? "PayPal" : "Cash on Delivery"}</strong>
                        <p>{paymentMethod === "card" ? "**** **** **** 3456" : ""}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="btn-back" onClick={() => setStep(3)}>
                      <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <button className="btn-place-order" onClick={handlePlaceOrder}>
                      <i className="bi bi-lock-fill"></i> Place Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="checkout-sidebar">
            <div className="order-summary">
              <h5 className="summary-title">Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h5>
              
              {/* Cart Items */}
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <strong className="item-name">{item.name}</strong>
                      <small className="item-qty">Qty: {item.qty} × ${item.price.toFixed(2)}</small>
                    </div>
                    <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Order Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="secure-checkout">
                <i className="bi bi-shield-lock"></i>
                <span>Secure Checkout</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
