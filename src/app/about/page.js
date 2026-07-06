export default function AboutPage() {
  return (
    <div className="info-page">
      {/* Hero Section */}
      <div className="info-hero">
        <div className="container">
          <h1 className="info-hero-title">About SohailVerse</h1>
          <p className="info-hero-subtitle">Your Trusted Online Shopping Destination Since 2024</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Mission Section */}
        <div className="info-section">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="info-icon-box" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                <i className="bi bi-bullseye"></i>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="info-section-title">Our Mission</h2>
              <p className="info-text">
                At SohailVerse, we believe everyone deserves access to quality products at great prices.
                We're committed to providing a seamless shopping experience with curated products from
                trusted brands and sellers worldwide.
              </p>
              <div className="info-stats">
                <div className="info-stat">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="info-stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="info-stat">
                  <span className="stat-number">99%</span>
                  <span className="stat-label">Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="info-section">
          <h2 className="info-section-title text-center">Why Choose SohailVerse?</h2>
          <div className="row g-4 mt-4">
            {[
              { icon: "bi-bag-check", title: "Quality Products", desc: "Every product is carefully vetted for quality and authenticity", color: "#6366f1" },
              { icon: "bi-tag", title: "Best Prices", desc: "Competitive pricing with regular deals and exclusive offers", color: "#10b981" },
              { icon: "bi-shield-check", title: "Secure Shopping", desc: "Your data and payments are protected with enterprise security", color: "#f59e0b" },
              { icon: "bi-truck", title: "Fast Delivery", desc: "Quick and reliable shipping to your doorstep", color: "#3b82f6" },
              { icon: "bi-arrow-return-left", title: "Easy Returns", desc: "30-day hassle-free return policy on all items", color: "#ec4899" },
              { icon: "bi-headset", title: "24/7 Support", desc: "Our dedicated team is always here to help you", color: "#8b5cf6" },
            ].map((item, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="info-feature-card">
                  <div className="feature-icon" style={{ background: `${item.color}15`, color: item.color }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h5 className="feature-title">{item.title}</h5>
                  <p className="feature-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
