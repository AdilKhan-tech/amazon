"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";

const API_URL = "/api";

// Default settings (flat structure)
const DEFAULT_SETTINGS = {
    storeName: "Amazon Store",
    currency: "USD",
    timezone: "America/New_York",
    language: "en",
    notifyNewOrders: true,
    notifyLowStock: true,
    notifyNewUsers: false,
    notifyReviews: true,
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
    profileName: "",
    profilePhone: "",
};

export default function AdminSettingsPage() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const stored = localStorage.getItem("user");
        if (!token || !stored) {
            router.push("/login");
            return;
        }
        const u = JSON.parse(stored);
        if (u.role !== "admin") {
            router.push("/");
            return;
        }
        setUser(u);
        setName(u.name || "");
        setEmail(u.email || "");
        setPhone(u.phone || "");
        if (u.image) {
            setImagePreview(u.image.startsWith("http") ? u.image : `${API_URL.replace('/api', ':5000/api')}${u.image}`);
        }

        // Fetch settings from database
        fetchSettings(token);
    }, [router]);

    const fetchSettings = async (token) => {
        try {
            const res = await fetch(`${API_URL}/settings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                const s = data.settings;
                // Convert 0/1 to proper booleans
                const toBool = (v) => v === true || v === 1 || v === "1";
                // Map database fields to state
                setSettings({
                    storeName: s.storeName || DEFAULT_SETTINGS.storeName,
                    currency: s.currency || DEFAULT_SETTINGS.currency,
                    timezone: s.timezone || DEFAULT_SETTINGS.timezone,
                    language: s.language || DEFAULT_SETTINGS.language,
                    notifyNewOrders: toBool(s.notifyNewOrders ?? DEFAULT_SETTINGS.notifyNewOrders),
                    notifyLowStock: toBool(s.notifyLowStock ?? DEFAULT_SETTINGS.notifyLowStock),
                    notifyNewUsers: toBool(s.notifyNewUsers ?? DEFAULT_SETTINGS.notifyNewUsers),
                    notifyReviews: toBool(s.notifyReviews ?? DEFAULT_SETTINGS.notifyReviews),
                    twoFactor: toBool(s.twoFactor ?? DEFAULT_SETTINGS.twoFactor),
                    loginAlerts: toBool(s.loginAlerts ?? DEFAULT_SETTINGS.loginAlerts),
                    sessionTimeout: s.sessionTimeout || DEFAULT_SETTINGS.sessionTimeout,
                    profileName: s.profileName || "",
                    profilePhone: s.profilePhone || "",
                });
            }
        } catch (err) {
            console.error("Failed to fetch settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        if (image) formData.append("image", image);

        try {
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                const updatedUser = { ...user, name, phone, image: data.user.image };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);

                // Save profile settings to database
                await fetch(`${API_URL}/settings`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ profileName: name, profilePhone: phone }),
                });

                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Failed to update profile:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveStoreSettings = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    storeName: settings.storeName,
                    currency: settings.currency,
                    timezone: settings.timezone,
                    language: settings.language,
                }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save store settings:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    notifyNewOrders: settings.notifyNewOrders,
                    notifyLowStock: settings.notifyLowStock,
                    notifyNewUsers: settings.notifyNewUsers,
                    notifyReviews: settings.notifyReviews,
                }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save notifications:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSecurity = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    twoFactor: settings.twoFactor,
                    loginAlerts: settings.loginAlerts,
                    sessionTimeout: settings.sessionTimeout,
                }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save security settings:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleResetSettings = async () => {
        if (!confirm("Are you sure you want to reset all settings to default? This cannot be undone.")) {
            return;
        }
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/settings/reset`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSettings(data.settings);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Failed to reset settings:", err);
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    if (loading) {
        return (
            <AdminLayout>
                <div className="premium-dashboard">
                    <div className="premium-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading settings...</span>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const tabs = [
        { id: "profile", label: "Profile", icon: "bi-person-fill" },
        { id: "store", label: "Store Settings", icon: "bi-shop" },
        { id: "notifications", label: "Notifications", icon: "bi-bell-fill" },
        { id: "security", label: "Security", icon: "bi-shield-lock-fill" },
    ];

    return (
        <AdminLayout>
            <div className="premium-dashboard">
                {/* Header */}
                <div className="premium-page-header">
                    <div>
                        <h2>Admin Settings</h2>
                        <p>Manage your admin profile and store preferences</p>
                    </div>
                </div>

                {saved && (
                    <div className="settings-success-toast">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Settings saved successfully!</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="settings-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i className={`bi ${tab.icon}`}></i>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="settings-layout">
                    <div className="settings-main">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <>
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
                                            <div className="settings-form-group">
                                                <label>Role</label>
                                                <input type="text" className="settings-input" value="Administrator" disabled />
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
                            </>
                        )}

                        {/* Store Settings Tab */}
                        {activeTab === "store" && (
                            <div className="premium-card">
                                <div className="premium-card-header">
                                    <h3><i className="bi bi-shop"></i> Store Configuration</h3>
                                </div>
                                <div className="premium-card-body">
                                    <div className="settings-form-grid">
                                        <div className="settings-form-group">
                                            <label>Store Name</label>
                                            <input
                                                type="text"
                                                className="settings-input"
                                                value={settings.storeName}
                                                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                            />
                                        </div>
                                        <div className="settings-form-group">
                                            <label>Currency</label>
                                            <select
                                                className="settings-input"
                                                value={settings.currency}
                                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                            >
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - British Pound</option>
                                                <option value="PKR">PKR - Pakistani Rupee</option>
                                                <option value="AED">AED - UAE Dirham</option>
                                            </select>
                                        </div>
                                        <div className="settings-form-group">
                                            <label>Timezone</label>
                                            <select
                                                className="settings-input"
                                                value={settings.timezone}
                                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                            >
                                                <option value="America/New_York">Eastern Time (ET)</option>
                                                <option value="America/Chicago">Central Time (CT)</option>
                                                <option value="America/Denver">Mountain Time (MT)</option>
                                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                                <option value="Asia/Karachi">Pakistan Time (PKT)</option>
                                                <option value="Asia/Dubai">Gulf Time (GST)</option>
                                            </select>
                                        </div>
                                        <div className="settings-form-group">
                                            <label>Language</label>
                                            <select
                                                className="settings-input"
                                                value={settings.language}
                                                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                            >
                                                <option value="en">English</option>
                                                <option value="ar">Arabic</option>
                                                <option value="ur">Urdu</option>
                                                <option value="es">Spanish</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button className="premium-btn" onClick={handleSaveStoreSettings}>
                                        <i className="bi bi-check-lg"></i> Save Store Settings
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === "notifications" && (
                            <div className="premium-card">
                                <div className="premium-card-header">
                                    <h3><i className="bi bi-bell-fill"></i> Notification Preferences</h3>
                                </div>
                                <div className="premium-card-body">
                                    <div className="notification-options">
                                        <label className="notification-toggle">
                                            <div className="notification-info">
                                                <span className="notification-title">New Orders</span>
                                                <span className="notification-desc">Get notified when a new order is placed</span>
                                            </div>
                                            <div className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.notifyNewOrders}
                                                    onChange={() => setSettings({ ...settings, notifyNewOrders: !settings.notifyNewOrders })}
                                                />
                                                <span className="toggle-slider"></span>
                                            </div>
                                        </label>
                                        <label className="notification-toggle">
                                            <div className="notification-info">
                                                <span className="notification-title">Low Stock Alerts</span>
                                                <span className="notification-desc">Alert when product stock is running low</span>
                                            </div>
                                            <div className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.notifyLowStock}
                                                    onChange={() => setSettings({ ...settings, notifyLowStock: !settings.notifyLowStock })}
                                                />
                                                <span className="toggle-slider"></span>
                                            </div>
                                        </label>
                                        <label className="notification-toggle">
                                            <div className="notification-info">
                                                <span className="notification-title">New User Registrations</span>
                                                <span className="notification-desc">Notify when new customers sign up</span>
                                            </div>
                                            <div className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.notifyNewUsers}
                                                    onChange={() => setSettings({ ...settings, notifyNewUsers: !settings.notifyNewUsers })}
                                                />
                                                <span className="toggle-slider"></span>
                                            </div>
                                        </label>
                                        <label className="notification-toggle">
                                            <div className="notification-info">
                                                <span className="notification-title">Product Reviews</span>
                                                <span className="notification-desc">Get notified on new product reviews</span>
                                            </div>
                                            <div className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.notifyReviews}
                                                    onChange={() => setSettings({ ...settings, notifyReviews: !settings.notifyReviews })}
                                                />
                                                <span className="toggle-slider"></span>
                                            </div>
                                        </label>
                                    </div>
                                    <button className="premium-btn" onClick={handleSaveNotifications}>
                                        <i className="bi bi-check-lg"></i> Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <>
                                <div className="premium-card">
                                    <div className="premium-card-header">
                                        <h3><i className="bi bi-shield-lock-fill"></i> Security Settings</h3>
                                    </div>
                                    <div className="premium-card-body">
                                        <div className="notification-options">
                                            <label className="notification-toggle">
                                                <div className="notification-info">
                                                    <span className="notification-title">Two-Factor Authentication</span>
                                                    <span className="notification-desc">Add an extra layer of security to your account</span>
                                                </div>
                                                <div className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.twoFactor}
                                                        onChange={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </div>
                                            </label>
                                            <label className="notification-toggle">
                                                <div className="notification-info">
                                                    <span className="notification-title">Login Alerts</span>
                                                    <span className="notification-desc">Get alerted when someone logs into your account</span>
                                                </div>
                                                <div className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.loginAlerts}
                                                        onChange={() => setSettings({ ...settings, loginAlerts: !settings.loginAlerts })}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="settings-form-grid" style={{ marginTop: "20px" }}>
                                            <div className="settings-form-group">
                                                <label>Session Timeout (minutes)</label>
                                                <select
                                                    className="settings-input"
                                                    value={settings.sessionTimeout}
                                                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                                                >
                                                    <option value="15">15 minutes</option>
                                                    <option value="30">30 minutes</option>
                                                    <option value="60">1 hour</option>
                                                    <option value="120">2 hours</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button className="premium-btn" onClick={handleSaveSecurity}>
                                            <i className="bi bi-shield-check"></i> Save Security Settings
                                        </button>
                                    </div>
                                </div>

                                <div className="premium-card">
                                    <div className="premium-card-header">
                                        <h3><i className="bi bi-clock-history"></i> Active Sessions</h3>
                                    </div>
                                    <div className="premium-card-body">
                                        <div className="session-list">
                                            <div className="session-item current">
                                                <div className="session-info">
                                                    <i className="bi bi-laptop"></i>
                                                    <div>
                                                        <span className="session-device">Current Session</span>
                                                        <span className="session-details">Chrome · Linux · {user.email}</span>
                                                    </div>
                                                </div>
                                                <span className="session-badge">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="settings-sidebar">
                        <div className="premium-card profile-sidebar-card">
                            <div className="premium-card-body">
                                <div className="profile-avatar-upload">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="profile-avatar-img" />
                                    ) : (
                                        <div className="profile-avatar-large">
                                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
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
                                <h4>{user?.name || "Admin"}</h4>
                                <p className="profile-email">{user?.email || "admin@example.com"}</p>
                                <span className="profile-role-badge">
                                    <i className="bi bi-shield-check"></i>
                                    Administrator
                                </span>
                            </div>
                        </div>

                        <div className="premium-card danger-zone-card">
                            <div className="premium-card-header">
                                <h3><i className="bi bi-exclamation-triangle-fill"></i> Danger Zone</h3>
                            </div>
                            <div className="premium-card-body">
                                <p>Reset all store settings to default. This action cannot be undone.</p>
                                <button className="danger-btn" onClick={handleResetSettings}>
                                    <i className="bi bi-arrow-counterclockwise"></i> Reset All Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
