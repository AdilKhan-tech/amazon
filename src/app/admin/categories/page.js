"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { categories } from "@/data/mockData";

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="admin-page">
      <AdminLayout>
        <div className="page-header">
          <div>
            <h4 className="page-title">Categories</h4>
            <p className="page-subtitle">Manage product categories</p>
          </div>
          <div className="page-actions">
            <button className="btn-primary-modern" onClick={() => setShowForm(!showForm)}>
              <i className="bi bi-plus-lg"></i> Add Category
            </button>
          </div>
        </div>

        {showForm && (
          <div className="form-card">
            <div className="form-header">
              <h5>New Category</h5>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="form-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-modern">Category Name</label>
                  <input type="text" className="form-control-modern" placeholder="e.g. Electronics" />
                </div>
                <div className="col-md-6">
                  <label className="form-label-modern">Image</label>
                  <input type="file" className="form-control-modern" accept="image/*" />
                </div>
                <div className="col-12">
                  <button className="btn-primary-modern me-2">Save Category</button>
                  <button className="btn-secondary-modern" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.slug} className="category-card">
              <div className="category-image-wrapper">
                <img src={cat.image} alt={cat.name} className="category-image" />
                <div className="category-overlay">
                  <button className="overlay-btn"><i className="bi bi-pencil"></i></button>
                  <button className="overlay-btn delete"><i className="bi bi-trash"></i></button>
                </div>
              </div>
              <div className="category-info">
                <h6 className="category-name">{cat.name}</h6>
                <span className="category-slug">{cat.slug}</span>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </div>
  );
}
