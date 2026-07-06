export default function ReturnsPage() {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1 className="info-hero-title">Returns & Refunds</h1>
          <p className="info-hero-subtitle">Hassle-free 30-day return policy</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Return Steps */}
        <div className="info-section">
          <h2 className="info-section-title text-center">How to Return an Item</h2>
          <div className="return-steps">
            {[
              { step: "1", title: "Go to Your Orders", desc: "Access your order history from your account" },
              { step: "2", title: "Select Item", desc: "Choose the item you want to return" },
              { step: "3", title: "Choose Reason", desc: "Select a return reason from the list" },
              { step: "4", title: "Print Label", desc: "Print the prepaid return shipping label" },
              { step: "5", title: "Drop Off", desc: "Package and drop off at the carrier" },
            ].map((item, i) => (
              <div key={i} className="return-step">
                <div className="step-number">{item.step}</div>
                <div className="step-content">
                  <h6 className="step-title">{item.title}</h6>
                  <p className="step-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Timeline */}
        <div className="info-section">
          <h2 className="info-section-title text-center">Refund Timeline</h2>
          <div className="refund-timeline">
            {[
              { icon: "bi-box-seam", title: "Item Received", time: "1-3 business days", color: "#6366f1" },
              { icon: "bi-search", title: "Inspection", time: "1-2 business days", color: "#f59e0b" },
              { icon: "bi-credit-card", title: "Refund Issued", time: "3-5 business days", color: "#10b981" },
            ].map((item, i) => (
              <div key={i} className="timeline-card">
                <div className="timeline-icon" style={{ background: `${item.color}15`, color: item.color }}>
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <h6 className="timeline-title">{item.title}</h6>
                <span className="timeline-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="return-note">
          <i className="bi bi-info-circle"></i>
          <div>
            <strong>Important:</strong> Items must be in original condition with tags attached. Shipping costs are non-refundable unless the return is due to our error.
          </div>
        </div>
      </div>
    </div>
  );
}
