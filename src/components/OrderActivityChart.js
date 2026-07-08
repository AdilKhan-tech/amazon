"use client";

export default function OrderActivityChart({ data }) {
  if (!data || data.length === 0 || data.every(m => m.orders === 0)) {
    return (
      <div className="premium-card chart-section">
        <div className="premium-card-header">
          <h3><i className="bi bi-bag-check"></i> Order Activity</h3>
        </div>
        <div className="premium-card-body">
          <div className="empty-state-card">
            <i className="bi bi-inbox"></i>
            <p>No orders yet</p>
          </div>
        </div>
      </div>
    );
  }

  const totalOrders = data.reduce((s, m) => s + m.orders, 0);
  const maxOrders = Math.max(...data.map(d => d.orders), 1);

  return (
    <div className="premium-card chart-section">
      <div className="premium-card-header">
        <h3><i className="bi bi-bag-check"></i> Order Activity</h3>
        <span className="chart-total-badge">{totalOrders} orders</span>
      </div>
      <div className="premium-card-body">
        <div className="order-bar-chart">
          {data.map((m, i) => {
            const height = Math.max((m.orders / maxOrders) * 100, 8);
            return (
              <div key={i} className="order-bar-group">
                <span className="order-bar-count">{m.orders}</span>
                <div className="order-bar-track">
                  <div
                    className="order-bar-fill"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="order-bar-month">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
