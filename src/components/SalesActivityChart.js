"use client";

export default function SalesActivityChart({ data }) {
  if (!data || data.length === 0 || data.every(m => m.revenue === 0)) {
    return (
      <div className="premium-card chart-section">
        <div className="premium-card-header">
          <h3><i className="bi bi-currency-dollar"></i> Sales Activity</h3>
        </div>
        <div className="premium-card-body">
          <div className="empty-state-card">
            <i className="bi bi-bar-chart"></i>
            <p>No sales data yet</p>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = data.reduce((s, m) => s + m.revenue, 0);

  return (
    <div className="premium-card chart-section">
      <div className="premium-card-header">
        <h3><i className="bi bi-currency-dollar"></i> Sales Activity</h3>
        <span className="chart-total-badge">${totalRevenue.toFixed(2)}</span>
      </div>
      <div className="premium-card-body">
        <div className="sales-line-chart">
          <svg className="sales-svg" viewBox="0 0 400 140" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 1, 2, 3].map(i => (
              <line key={i} x1="0" y1={35 * i + 10} x2="400" y2={35 * i + 10} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
            ))}
            {/* Area fill */}
            <polygon
              points={data.map((m, i) => {
                const maxVal = Math.max(...data.map(d => d.revenue), 1);
                const x = (i / (data.length - 1)) * 380 + 10;
                const y = 130 - (m.revenue / maxVal) * 110;
                return `${x},${y}`;
              }).join(" ") + ` 390,130 10,130`}
              fill="url(#salesGradient)"
              opacity="0.15"
            />
            {/* Line */}
            <polyline
              points={data.map((m, i) => {
                const maxVal = Math.max(...data.map(d => d.revenue), 1);
                const x = (i / (data.length - 1)) * 380 + 10;
                const y = 130 - (m.revenue / maxVal) * 110;
                return `${x},${y}`;
              }).join(" ")}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {data.map((m, i) => {
              const maxVal = Math.max(...data.map(d => d.revenue), 1);
              const x = (i / (data.length - 1)) * 380 + 10;
              const y = 130 - (m.revenue / maxVal) * 110;
              return <circle key={i} cx={x} cy={y} r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />;
            })}
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          {/* Directional annotations */}
          <div className="sales-annotations">
            {data.map((m, i) => {
              if (i === 0) return null;
              const prev = data[i - 1].revenue;
              const curr = m.revenue;
              const diff = curr - prev;
              const isUp = diff >= 0;
              return (
                <div key={i} className={`sales-annotation ${isUp ? "up" : "down"}`}>
                  <i className={`bi bi-arrow-${isUp ? "up" : "down"}`}></i>
                  <span>{isUp ? "+" : ""}${diff.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          {/* Month labels */}
          <div className="sales-months">
            {data.map((m, i) => (
              <span key={i} className="sales-month-label">{m.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
