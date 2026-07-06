export default function ContactPage() {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1 className="info-hero-title">Contact Us</h1>
          <p className="info-hero-subtitle">We're here to help! Reach out anytime.</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* Contact Info Cards */}
          <div className="col-lg-5">
            <div className="contact-info-cards">
              {[
                { icon: "bi-envelope-fill", title: "Email Us", info: "support@sohailverse.com", sub: "24/7 response", color: "#6366f1" },
                { icon: "bi-telephone-fill", title: "Call Us", info: "+1 (555) 123-4567", sub: "Mon-Fri 9AM-6PM", color: "#10b981" },
                { icon: "bi-geo-alt-fill", title: "Visit Us", info: "123 Commerce St", sub: "Business City, BC 10001", color: "#f59e0b" },
                { icon: "bi-chat-dots-fill", title: "Live Chat", info: "Chat with support", sub: "Available 24/7", color: "#3b82f6" },
              ].map((item, i) => (
                <div key={i} className="contact-info-card">
                  <div className="contact-icon" style={{ background: `${item.color}15`, color: item.color }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div className="contact-details">
                    <h6 className="contact-title">{item.title}</h6>
                    <p className="contact-info">{item.info}</p>
                    <span className="contact-sub">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="contact-form-card">
              <h3 className="form-title">Send us a Message</h3>
              <p className="form-subtitle">Fill out the form and we'll get back to you within 24 hours</p>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Full Name</label>
                    <input type="text" className="form-input-custom" placeholder="John Doe" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Email Address</label>
                    <input type="email" className="form-input-custom" placeholder="john@example.com" />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Subject</label>
                    <input type="text" className="form-input-custom" placeholder="How can we help?" />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Message</label>
                    <textarea className="form-input-custom" rows="5" placeholder="Tell us more..."></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn-submit-form">
                      <i className="bi bi-send me-2"></i>Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
