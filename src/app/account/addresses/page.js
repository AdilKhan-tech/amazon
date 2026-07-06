"use client";

import { useState, useEffect } from "react";
import AccountLayout from "@/components/AccountLayout";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false
  });

  useEffect(() => {
    const stored = localStorage.getItem("addresses");
    if (stored) {
      setAddresses(JSON.parse(stored));
    } else {
      // Default addresses
      const defaultAddresses = [
        { id: 1, name: "Home", fullName: "John Doe", phone: "+1 234 567 890", address: "123 Main Street, Apt 4B", city: "New York", state: "NY", zip: "10001", isDefault: true },
        { id: 2, name: "Office", fullName: "John Doe", phone: "+1 234 567 891", address: "456 Business Ave, Suite 100", city: "New York", state: "NY", zip: "10018", isDefault: false },
      ];
      setAddresses(defaultAddresses);
      localStorage.setItem("addresses", JSON.stringify(defaultAddresses));
    }
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem("addresses", JSON.stringify(addresses));
    }
  }, [addresses]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddAddress = () => {
    if (!formData.name || !formData.fullName || !formData.address) return;
    
    const newAddress = {
      id: Date.now(),
      ...formData
    };
    
    // If this is set as default, unset others
    const updatedAddresses = formData.isDefault
      ? addresses.map(a => ({ ...a, isDefault: false }))
      : addresses;
    
    setAddresses([...updatedAddresses, newAddress]);
    setFormData({ name: "", fullName: "", phone: "", address: "", city: "", state: "", zip: "", isDefault: false });
    setShowForm(false);
  };

  const removeAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const setAsDefault = (id) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
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
                <h3 className="stat-card-value">{addresses.find(a => a.isDefault)?.name || "-"}</h3>
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
                  <input type="text" className="address-input" placeholder="e.g. Home, Office" name="name" value={formData.name} onChange={handleInputChange} />
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
                <button className="premium-btn" onClick={handleAddAddress}>Save Address</button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Grid */}
        <div className="addresses-grid">
          {addresses.map((addr) => (
            <div key={addr.id} className={`address-card ${addr.isDefault ? "default" : ""}`}>
              <div className="address-card-header">
                <div className="address-label">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>{addr.name}</span>
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
                <button className="address-action-btn edit">
                  <i className="bi bi-pencil"></i> Edit
                </button>
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
      </AccountLayout>
    </div>
  );
}
