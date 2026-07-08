"use client";

export default function CustomerActivityChart({ data }) {
  if (!data || data.length === 0 || data.every(m => m.customers === 0)) {
    return (
      <div className="premium-card chart-section">
        <div className="premium-card-header">
          <h3><i className="bi bi-people"></i> Customer Activity</h3>
        </div>
        <div className="premium-card-body">
          <div className="empty-state-card">
            <i className="bi bi-person-x"></i>
            <p>No customer data yet</p>
          </div>
        </div>
      </div>
    );
  }

  const totalCustomers = data[data.length - 1]?.cumulative || 0;
  const maxVal = Math.max(...data.map(d => d.cumulative), 1);

  return (
    <div className="premium-card chart-section">
      <div className="premium-card-header">
        <h3><i className="bi bi-people"></i> Customer Activity</h3>
        <span className="chart-total-badge">{totalCustomers} total</span>
      </div>
      <div className="premium-card-body">
        <div className="customer-area-chart">
          <svg className="customer-svg" viewBox="0 0 400 140" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 1, 2, 3].map(i => (
              <line key={i} x1="0" y1={35 * i + 10} x2="400" y2={35 * i + 10} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
            ))}
            {/* Area fill */}
            <polygon
              points={data.map((m, i) => {
                const x = (i / (data.length - 1)) * 380 + 10;
                const y = 130 - (m.cumulative / maxVal) * 110;
                return `${x},${y}`;
              }).join(" ") + ` 390,130 10,130`}
              fill="url(#customerGradient)"
              opacity="0.2"
            />
            {/* Line */}
            <polyline
              points={data.map((m, i) => {
                const x = (i / (data.length - 1)) * 380 + 10;
                const y = 130 - (m.cumulative / maxVal) * 110;
                return `${x},${y}`;
              }).join(" ")}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {data.map((m, i) => {
              const x = (i / (data.length - 1)) * 380 + 10;
              const y = 130 - (m.cumulative / maxVal) * 110;
              return <circle key={i} cx={x} cy={y} r="3.5" fill="#8b5cf6" stroke="#fff" strokeWidth="1.5" />;
            })}
            <defs>
              <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          {/* Growth annotations */}
          <div className="customer-annotations">
            {data.map((m, i) => {
              if (i === 0) return null;
              const prev = data[i - 1].cumulative;
              const curr = m.cumulative;
              const diff = curr - prev;
              return (
                <div key={i} className={`customer-annotation ${diff > 0 ? "up" : "flat"}`}>
                  <i className={`bi bi-arrow-${diff > 0 ? "up" : "right"}`}></i>
                  <span>+{diff}</span>
                </div>
              );
            })}
          </div>
          {/* Month labels */}
          <div className="customer-months">
            {data.map((m, i) => (
              <span key={i} className="customer-month-label">{m.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
