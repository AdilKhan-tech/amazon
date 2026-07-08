"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";

const API_URL = "/api";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!token || !storedUser || storedUser.role !== "admin") {
      router.push("/");
      return;
    }

    fetch(`${API_URL}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const users = Array.isArray(data) ? data : (data.users || []);
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");

        const customerList = users.map((u) => {
          const userOrders = orders.filter((o) => o.userEmail === u.email);
          const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
          const joinDate = new Date(u.createdAt || Date.now());
          let status = "active";
          if (userOrders.length >= 5) status = "vip";
          else if ((Date.now() - joinDate.getTime()) < 7 * 24 * 60 * 60 * 1000) status = "new";

          return {
            id: u.id,
            name: u.name || "N/A",
            email: u.email,
            image: u.image || null,
            orders: userOrders.length,
            spent: totalSpent,
            joined: joinDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status,
            role: u.role,
          };
        });

        setCustomers(customerList);
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, [router]);

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setModalMode("view");
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({ name: customer.name, email: customer.email, role: customer.role });
    setModalMode("edit");
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    fetch(`${API_URL}/auth/users/${selectedCustomer.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    })
      .then((r) => r.json())
      .then((data) => {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === selectedCustomer.id ? { ...c, name: editForm.name, email: editForm.email, role: editForm.role } : c
          )
        );
        setModalMode(null);
        setSelectedCustomer(null);
      })
      .catch(() => alert("Failed to update customer"))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/auth/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        setModalMode(null);
        setSelectedCustomer(null);
      })
      .catch(() => alert("Failed to delete customer"));
  };

  return (
    <div className="premium-dashboard">
      <AdminLayout>
        {loading ? (
          <div className="premium-loading">
            <div className="loading-spinner"></div>
            <span>Loading customers...</span>
          </div>
        ) : (
        <>
        {/* Header */}
        <div className="premium-page-header">
          <div>
            <h2>Customers</h2>
            <p>Manage your customer base</p>
          </div>
          <div className="customer-count-badge">
            <i className="bi bi-people-fill"></i>
            <span>{customers.length} Customers</span>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="premium-stats">
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}>
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{customers.length}</h3>
                <p className="stat-card-label">Total Customers</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                  <i className="bi bi-person-check-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{customers.filter(c => c.status === "active").length}</h3>
                <p className="stat-card-label">Active</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
                  <i className="bi bi-star-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{customers.filter(c => c.status === "vip").length}</h3>
                <p className="stat-card-label">VIP</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                  <i className="bi bi-currency-dollar"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">${customers.reduce((sum, c) => sum + c.spent, 0).toFixed(2)}</h3>
                <p className="stat-card-label">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="premium-card">
          <div className="premium-card-header">
            <h3>All Customers</h3>
          </div>
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="customer-cell">
                        {c.image ? (
                          <img className="customer-avatar-img" src={c.image.startsWith("http") ? c.image : `${API_URL.replace('/api', ':5000/api')}${c.image}`} alt={c.name} />
                        ) : (
                          <div className="customer-avatar">{c.name.charAt(0)}</div>
                        )}
                        <span className="customer-name">{c.name}</span>
                      </div>
                    </td>
                    <td><span className="email-text">{c.email}</span></td>
                    <td><span className="orders-count">{c.orders}</span></td>
                    <td><span className="spent-amount">${c.spent.toFixed(2)}</span></td>
                    <td><span className="date-text">{c.joined}</span></td>
                    <td>
                      <span className={`customer-status ${c.status}`}>
                        {c.status === "vip" ? "VIP" : c.status === "new" ? "New" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="table-action-btn view" onClick={() => handleView(c)}><i className="bi bi-eye"></i></button>
                        <button className="table-action-btn edit" onClick={() => handleEdit(c)}><i className="bi bi-pencil"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Modal */}
        {modalMode && selectedCustomer && (
          <div className="customer-modal-overlay" onClick={() => setModalMode(null)}>
            <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
              <div className="customer-modal-header">
                <h4>{modalMode === "view" ? "Customer Details" : "Edit Customer"}</h4>
                <button className="modal-close-btn" onClick={() => setModalMode(null)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="customer-modal-body">
                {modalMode === "view" ? (
                  <div className="customer-view">
                    <div className="customer-view-avatar">{selectedCustomer.name.charAt(0)}</div>
                    <div className="customer-view-info">
                      <div className="info-row">
                        <label>Full Name</label>
                        <span>{selectedCustomer.name}</span>
                      </div>
                      <div className="info-row">
                        <label>Email</label>
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="info-row">
                        <label>Role</label>
                        <span className={`role-badge ${selectedCustomer.role}`}>{selectedCustomer.role}</span>
                      </div>
                      <div className="info-row">
                        <label>Total Orders</label>
                        <span>{selectedCustomer.orders}</span>
                      </div>
                      <div className="info-row">
                        <label>Total Spent</label>
                        <span>${selectedCustomer.spent.toFixed(2)}</span>
                      </div>
                      <div className="info-row">
                        <label>Joined</label>
                        <span>{selectedCustomer.joined}</span>
                      </div>
                      <div className="info-row">
                        <label>Status</label>
                        <span className={`customer-status ${selectedCustomer.status}`}>
                          {selectedCustomer.status === "vip" ? "VIP" : selectedCustomer.status === "new" ? "New" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="customer-edit">
                    <div className="edit-form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="edit-input"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="edit-input"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Role</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="edit-input"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="customer-modal-footer">
                {modalMode === "view" ? (
                  <>
                    <button className="modal-btn danger" onClick={() => handleDelete(selectedCustomer.id)}>
                      <i className="bi bi-trash"></i> Delete
                    </button>
                    <button className="modal-btn primary" onClick={() => handleEdit(selectedCustomer)}>
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                  </>
                ) : (
                  <>
                    <button className="modal-btn secondary" onClick={() => setModalMode(null)}>Cancel</button>
                    <button className="modal-btn primary" onClick={handleSave} disabled={saving}>
                      {saving ? <span className="loading-spinner-sm"></span> : <><i className="bi bi-check-lg"></i> Save Changes</>}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </AdminLayout>
    </div>
  );
}
