"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "Percentage",
    discountValue: "",
    minOrder: "",
    maxUses: "",
    expires: ""
  });

  // Load coupons from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("coupons");
    if (stored) {
      setCoupons(JSON.parse(stored));
    }
  }, []);

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCoupon = () => {
    if (!formData.code || !formData.discountValue) return;

    const newCoupon = {
      id: Date.now(),
      code: formData.code.toUpperCase(),
      discount: formData.discountType === "Percentage" ? `${formData.discountValue}%` : `$${formData.discountValue}`,
      type: formData.discountType,
      minOrder: formData.minOrder ? `$${formData.minOrder}` : "$0",
      uses: 0,
      maxUses: parseInt(formData.maxUses) || 1000,
      expires: formData.expires ? new Date(formData.expires).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No expiry",
      active: true
    };

    setCoupons(prev => [...prev, newCoupon]);
    setFormData({
      code: "",
      discountType: "Percentage",
      discountValue: "",
      minOrder: "",
      maxUses: "",
      expires: ""
    });
    setShowForm(false);
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const toggleCouponStatus = (id) => {
    setCoupons(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  return (
    <div className="premium-dashboard">
      <AdminLayout>
        {/* Header */}
        <div className="premium-page-header">
          <div>
            <h2>Coupon Codes</h2>
            <p>Manage discount coupons for your store</p>
          </div>
          <button className="premium-btn" onClick={() => setShowForm(!showForm)}>
            <i className="bi bi-plus-lg"></i> Create Coupon
          </button>
        </div>

        {/* Stats */}
        <div className="premium-stats">
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                  <i className="bi bi-ticket-perforated-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{coupons.length}</h3>
                <p className="stat-card-label">Total Coupons</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}>
                  <i className="bi bi-check-circle-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{coupons.filter(c => c.active).length}</h3>
                <p className="stat-card-label">Active</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{coupons.reduce((sum, c) => sum + c.uses, 0)}</h3>
                <p className="stat-card-label">Total Uses</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
                  <i className="bi bi-percent"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{coupons.filter(c => c.type === "Percentage").length}</h3>
                <p className="stat-card-label">Percentage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="premium-card form-section">
            <div className="premium-card-header">
              <h3>Create New Coupon</h3>
              <button className="close-form-btn" onClick={() => setShowForm(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="premium-card-body">
              <div className="coupon-form-grid">
                <div className="coupon-form-group">
                  <label>Coupon Code</label>
                  <input type="text" className="coupon-input" placeholder="e.g. SAVE20" name="code" value={formData.code} onChange={handleInputChange} />
                </div>
                <div className="coupon-form-group">
                  <label>Discount Type</label>
                  <select className="coupon-input" name="discountType" value={formData.discountType} onChange={handleInputChange}>
                    <option>Percentage</option>
                    <option>Fixed</option>
                  </select>
                </div>
                <div className="coupon-form-group">
                  <label>Discount Value</label>
                  <input type="number" className="coupon-input" placeholder="e.g. 20" name="discountValue" value={formData.discountValue} onChange={handleInputChange} />
                </div>
                <div className="coupon-form-group">
                  <label>Min Order Amount</label>
                  <input type="number" className="coupon-input" placeholder="50" name="minOrder" value={formData.minOrder} onChange={handleInputChange} />
                </div>
                <div className="coupon-form-group">
                  <label>Max Uses</label>
                  <input type="number" className="coupon-input" placeholder="1000" name="maxUses" value={formData.maxUses} onChange={handleInputChange} />
                </div>
                <div className="coupon-form-group">
                  <label>Expiry Date</label>
                  <input type="date" className="coupon-input" name="expires" value={formData.expires} onChange={handleInputChange} />
                </div>
              </div>
              <div className="coupon-form-actions">
                <button className="premium-btn" onClick={handleCreateCoupon}>Create Coupon</button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="premium-card">
          <div className="premium-card-header">
            <h3>All Coupons</h3>
          </div>
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Type</th>
                  <th>Min Order</th>
                  <th>Uses</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      <i className="bi bi-ticket-perforated" style={{ fontSize: "3rem", opacity: 0.3 }}></i>
                      <p style={{ marginTop: "16px", fontSize: "1rem" }}>No coupons yet. Create your first coupon!</p>
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                  <tr key={c.id}>
                    <td><code className="coupon-code-tag">{c.code}</code></td>
                    <td><span className="discount-value">{c.discount}</span></td>
                    <td><span className="type-tag">{c.type}</span></td>
                    <td>{c.minOrder}</td>
                    <td>
                      <div className="uses-bar-wrapper">
                        <div className="uses-bar">
                          <div className="uses-fill" style={{ width: `${(c.uses / c.maxUses) * 100}%` }}></div>
                        </div>
                        <span className="uses-text">{c.uses} / {c.maxUses}</span>
                      </div>
                    </td>
                    <td><span className="date-text">{c.expires}</span></td>
                    <td>
                      <span className={`coupon-status ${c.active ? "active" : "expired"}`}>
                        {c.active ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="table-action-btn edit" onClick={() => toggleCouponStatus(c.id)} title={c.active ? "Deactivate" : "Activate"}>
                          <i className={`bi ${c.active ? "bi-toggle-on" : "bi-toggle-off"}`}></i>
                        </button>
                        <button className="table-action-btn delete" onClick={() => handleDeleteCoupon(c.id)}><i className="bi bi-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}
