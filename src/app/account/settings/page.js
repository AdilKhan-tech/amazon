"use client";

import { useState, useEffect, useRef } from "react";
import AccountLayout from "@/components/AccountLayout";

const API_URL = "/api";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notifications, setNotifications] = useState({ orders: true, deals: false, newsletter: true });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setName(u.name || "");
      setEmail(u.email || "");
      setPhone(u.phone || "");
      if (u.image) {
        setImagePreview(u.image.startsWith("http") ? u.image : `http://localhost:5000${u.image}`);
      }
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);
    if (file) {
      setImage(file);
      console.log("Image state set to:", file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (image) {
      formData.append("image", image);
      console.log("Image being sent:", image.name, image.size, image.type);
    } else {
      console.log("No image to send");
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      console.log("Profile update response:", data);
      
      if (res.ok) {
        const updatedUser = { ...user, name, phone, image: data.user.image };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error("Profile update failed:", data);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="premium-dashboard">
      <AccountLayout>
        {/* Header */}
        <div className="premium-page-header">
          <div>
            <h2>Account Settings</h2>
            <p>Manage your profile and preferences</p>
          </div>
        </div>

        {saved && (
          <div className="settings-success-toast">
            <i className="bi bi-check-circle-fill"></i>
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="settings-layout">
          {/* Main Settings */}
          <div className="settings-main">
            {/* Profile Information */}
            <div className="premium-card">
              <div className="premium-card-header">
                <h3><i className="bi bi-person-fill"></i> Profile Information</h3>
              </div>
              <div className="premium-card-body">
                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label>Full Name</label>
                    <input type="text" className="settings-input" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="settings-form-group">
                    <label>Email Address</label>
                    <input type="email" className="settings-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="settings-form-group">
                    <label>Phone Number</label>
                    <input type="tel" className="settings-input" placeholder="+1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <button className="premium-btn" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <><span className="auth-spinner"></span> Saving...</>
                  ) : (
                    <><i className="bi bi-check-lg"></i> Save Changes</>
                  )}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="premium-card">
              <div className="premium-card-header">
                <h3><i className="bi bi-lock-fill"></i> Change Password</h3>
              </div>
              <div className="premium-card-body">
                <div className="settings-form-grid">
                  <div className="settings-form-group full-width">
                    <label>Current Password</label>
                    <input type="password" className="settings-input" placeholder="Enter current password" />
                  </div>
                  <div className="settings-form-group">
                    <label>New Password</label>
                    <input type="password" className="settings-input" placeholder="Enter new password" />
                  </div>
                  <div className="settings-form-group">
                    <label>Confirm New Password</label>
                    <input type="password" className="settings-input" placeholder="Confirm new password" />
                  </div>
                </div>
                <button className="premium-btn">
                  <i className="bi bi-shield-lock"></i> Update Password
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="premium-card">
              <div className="premium-card-header">
                <h3><i className="bi bi-bell-fill"></i> Notification Preferences</h3>
              </div>
              <div className="premium-card-body">
                <div className="notification-options">
                  <label className="notification-toggle">
                    <div className="notification-info">
                      <span className="notification-title">Order Updates</span>
                      <span className="notification-desc">Get notified about order status and shipping</span>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" checked={notifications.orders} onChange={() => setNotifications({ ...notifications, orders: !notifications.orders })} />
                      <span className="toggle-slider"></span>
                    </div>
                  </label>
                  <label className="notification-toggle">
                    <div className="notification-info">
                      <span className="notification-title">Deals & Promotions</span>
                      <span className="notification-desc">Receive exclusive deals and promotional offers</span>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" checked={notifications.deals} onChange={() => setNotifications({ ...notifications, deals: !notifications.deals })} />
                      <span className="toggle-slider"></span>
                    </div>
                  </label>
                  <label className="notification-toggle">
                    <div className="notification-info">
                      <span className="notification-title">Newsletter</span>
                      <span className="notification-desc">Weekly digest with latest products and news</span>
                    </div>
                    <div className="toggle-switch">
                      <input type="checkbox" checked={notifications.newsletter} onChange={() => setNotifications({ ...notifications, newsletter: !notifications.newsletter })} />
                      <span className="toggle-slider"></span>
                    </div>
                  </label>
                </div>
                <button className="premium-btn">
                  <i className="bi bi-check-lg"></i> Save Preferences
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="settings-sidebar">
            {/* Profile Card */}
            <div className="premium-card profile-sidebar-card">
              <div className="premium-card-body">
                <div className="profile-avatar-upload">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="profile-avatar-img" />
                  ) : (
                    <div className="profile-avatar-large">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <button 
                    type="button" 
                    className="profile-avatar-edit-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="bi bi-camera-fill"></i>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                <h4>{user?.name || "User"}</h4>
                <p className="profile-email">{user?.email || "user@example.com"}</p>
                <span className="profile-role-badge">
                  <i className="bi bi-shield-check"></i>
                  {user?.role === "admin" ? "Administrator" : "Member"}
                </span>
                <p className="profile-join-date">
                  <i className="bi bi-calendar3"></i>
                  Member since January 2026
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="premium-card danger-zone-card">
              <div className="premium-card-header">
                <h3><i className="bi bi-exclamation-triangle-fill"></i> Danger Zone</h3>
              </div>
              <div className="premium-card-body">
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="danger-btn">
                  <i className="bi bi-trash"></i> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </AccountLayout>
    </div>
  );
}
