"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountLayout from "@/components/AccountLayout";

const API_URL = "/api";

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchAddresses(token);
  }, [router]);

  const fetchAddresses = async (token) => {
    try {
      const res = await fetch(`${API_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => localStorage.getItem("token");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddAddress = async () => {
    if (!formData.fullName || !formData.address) return;
    setSaving(true);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          label: formData.label || "Home",
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          isDefault: formData.isDefault,
        }),
      });
      if (res.ok) {
        await fetchAddresses(token);
        setFormData({ label: "", fullName: "", phone: "", address: "", city: "", state: "", zip: "", isDefault: false });
        setShowForm(false);
      }
    } catch (err) {
      console.error("Failed to add address:", err);
    } finally {
      setSaving(false);
    }
  };

  const removeAddress = async (id) => {
    if (!confirm("Delete this address?")) return;
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const setAsDefault = async (id) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/addresses/${id}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchAddresses(token);
      }
    } catch (err) {
      console.error("Failed to set default:", err);
    }
  };

  return (
    <div className="premium-dashboard">
      <AccountLayout>
        {/* Header */}
        <div className="premium-page-header">
          <div>
            <h2>My Addresses</h2>
            <p>Manage your shipping addresses</p>
          </div>
          <button className="premium-btn" onClick={() => setShowForm(!showForm)}>
            <i className="bi bi-plus-lg"></i> Add Address
          </button>
        </div>

        {/* Stats */}
        <div className="premium-stats">
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}>
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{addresses.length}</h3>
                <p className="stat-card-label">Total Addresses</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                  <i className="bi bi-house-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{addresses.find(a => a.isDefault)?.label || "-"}</h3>
                <p className="stat-card-label">Default Address</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Address Form */}
        {showForm && (
          <div className="premium-card form-section">
            <div className="premium-card-header">
              <h3><i className="bi bi-plus-circle"></i> New Address</h3>
              <button className="close-form-btn" onClick={() => setShowForm(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="premium-card-body">
              <div className="address-form-grid">
                <div className="address-form-group">
                  <label>Address Label</label>
                  <input type="text" className="address-input" placeholder="e.g. Home, Office" name="label" value={formData.label} onChange={handleInputChange} />
                </div>
                <div className="address-form-group">
                  <label>Full Name</label>
                  <input type="text" className="address-input" placeholder="John Doe" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                </div>
                <div className="address-form-group">
                  <label>Phone</label>
                  <input type="tel" className="address-input" placeholder="+1 234 567 890" name="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="address-form-group full-width">
                  <label>Street Address</label>
                  <input type="text" className="address-input" placeholder="123 Main Street" name="address" value={formData.address} onChange={handleInputChange} />
                </div>
                <div className="address-form-group">
                  <label>City</label>
                  <input type="text" className="address-input" placeholder="New York" name="city" value={formData.city} onChange={handleInputChange} />
                </div>
                <div className="address-form-group">
                  <label>State</label>
                  <input type="text" className="address-input" placeholder="NY" name="state" value={formData.state} onChange={handleInputChange} />
                </div>
                <div className="address-form-group">
                  <label>ZIP Code</label>
                  <input type="text" className="address-input" placeholder="10001" name="zip" value={formData.zip} onChange={handleInputChange} />
                </div>
                <div className="address-form-group full-width">
                  <label className="address-checkbox">
                    <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} />
                    <span>Set as default address</span>
                  </label>
                </div>
              </div>
              <div className="address-form-actions">
                <button className="premium-btn" onClick={handleAddAddress} disabled={saving}>
                  {saving ? <><span className="auth-spinner"></span> Saving...</> : "Save Address"}
                </button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Grid */}
        {loading ? (
          <div className="premium-loading">
            <div className="loading-spinner"></div>
            <span>Loading addresses...</span>
          </div>
        ) : addresses.length === 0 ? (
          <div className="empty-addresses">
            <i className="bi bi-geo-alt"></i>
            <h4>No addresses yet</h4>
            <p>Add your first shipping address to get started.</p>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((addr) => (
              <div key={addr.id} className={`address-card ${addr.isDefault ? "default" : ""}`}>
                <div className="address-card-header">
                  <div className="address-label">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>{addr.label}</span>
                  </div>
                  {addr.isDefault && <span className="default-badge">Default</span>}
                </div>
                <div className="address-card-body">
                  <p className="address-name">{addr.fullName}</p>
                  <p className="address-street">{addr.address}</p>
                  <p className="address-city">{addr.city}, {addr.state} {addr.zip}</p>
                  <p className="address-phone"><i className="bi bi-telephone"></i> {addr.phone}</p>
                </div>
                <div className="address-card-actions">
                  {!addr.isDefault && (
                    <button className="address-action-btn default" onClick={() => setAsDefault(addr.id)}>
                      <i className="bi bi-star"></i> Set Default
                    </button>
                  )}
                  <button className="address-action-btn delete" onClick={() => removeAddress(addr.id)}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AccountLayout>
    </div>
  );
}
