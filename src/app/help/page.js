export default function HelpPage() {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1 className="info-hero-title">Help Center</h1>
          <p className="info-hero-subtitle">Find answers to common questions</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Quick Help Cards */}
        <div className="row g-4 mb-5">
          {[
            { icon: "bi-box-seam", title: "Track Order", desc: "Check delivery status", href: "/order-tracking", color: "#6366f1" },
            { icon: "bi-arrow-return-left", title: "Returns", desc: "Start a return", href: "/returns", color: "#10b981" },
            { icon: "bi-truck", title: "Shipping", desc: "Delivery options", href: "/shipping", color: "#f59e0b" },
            { icon: "bi-telephone", title: "Contact", desc: "Get in touch", href: "/contact", color: "#3b82f6" },
          ].map((item, i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <a href={item.href} className="help-quick-card" style={{ "--card-color": item.color }}>
                <div className="quick-card-icon"><i className={`bi ${item.icon}`}></i></div>
                <h6 className="quick-card-title">{item.title}</h6>
                <p className="quick-card-desc">{item.desc}</p>
              </a>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="help-faq-section">
          <h2 className="info-section-title text-center">Frequently Asked Questions</h2>
          <div className="help-faq-list">
            {[
              { q: "How do I track my order?", a: "Go to 'Track Order' in the header or footer, enter your Order ID, and you'll see the real-time status of your shipment." },
              { q: "What is your return policy?", a: "We offer a 30-day return policy for most items. Visit our Returns & Refunds page for detailed information on how to initiate a return." },
              { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) and Next Day delivery are also available at checkout." },
              { q: "How can I contact customer support?", a: "You can reach us via email at support@sohailverse.com, call +1 (555) 123-4567, or use our Live Chat available 24/7." },
              { q: "Do you ship internationally?", a: "Yes! We ship to all 50 US states and select international destinations. International shipping rates vary by location." },
            ].map((item, i) => (
              <div key={i} className="help-faq-item">
                <h6 className="faq-question"><i className="bi bi-question-circle me-2"></i>{item.q}</h6>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
