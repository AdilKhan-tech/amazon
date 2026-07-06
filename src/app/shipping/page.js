export default function ShippingPage() {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1 className="info-hero-title">Shipping Information</h1>
          <p className="info-hero-subtitle">Fast & reliable delivery to your doorstep</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Shipping Options */}
        <div className="info-section">
          <h2 className="info-section-title text-center">Shipping Options</h2>
          <div className="shipping-options">
            {[
              { name: "Standard Shipping", time: "5-7 business days", cost: "Free on orders over $50", price: "$4.99", color: "#6366f1", popular: false },
              { name: "Express Shipping", time: "2-3 business days", cost: "Fast delivery", price: "$9.99", color: "#f59e0b", popular: true },
              { name: "Next Day Delivery", time: "1 business day", cost: "Order before 2PM", price: "$19.99", color: "#10b981", popular: false },
            ].map((item, i) => (
              <div key={i} className={`shipping-option-card ${item.popular ? "popular" : ""}`}>
                {item.popular && <span className="popular-badge">Most Popular</span>}
                <div className="shipping-card-icon" style={{ color: item.color }}>
                  <i className="bi bi-truck"></i>
                </div>
                <h5 className="shipping-card-name">{item.name}</h5>
                <p className="shipping-card-time">{item.time}</p>
                <div className="shipping-card-price">{item.price}</div>
                <p className="shipping-card-note">{item.cost}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="info-section">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="shipping-info-card">
                <h5 className="info-card-title"><i className="bi bi-globe me-2"></i>Shipping Destinations</h5>
                <p className="info-card-text">We currently ship to all 50 US states, plus select international destinations. International shipping rates and delivery times vary by location.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="shipping-info-card">
                <h5 className="info-card-title"><i className="bi bi-clock-history me-2"></i>Processing Time</h5>
                <p className="info-card-text">Orders are typically processed within 1-2 business days. You'll receive a tracking number via email once your order ships.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Track CTA */}
        <div className="shipping-cta">
          <h4>Already ordered?</h4>
          <p>Track your package in real-time</p>
          <a href="/order-tracking" className="btn-cta-shipping">
            <i className="bi bi-geo-alt me-2"></i>Track Your Order
          </a>
        </div>
      </div>
    </div>
  );
}
