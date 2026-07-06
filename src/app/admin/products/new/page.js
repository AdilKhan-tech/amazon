"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { getImageUrl } from "@/lib/api";

const API_URL = "/api";

export default function AddEditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = !!id;

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    brand: "",
    stock: "",
    images: [],
    featured: false,
  });

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

    // Fetch categories
    fetch(`${API_URL}/categories`)
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {});

    // If editing, fetch product
    if (id) {
      fetch(`${API_URL}/products/${id}`)
        .then((r) => r.json())
        .then((data) => {
          const p = data.product || data;
          setFormData({
            name: p.name || "",
            description: p.description || "",
            price: p.price || "",
            originalPrice: p.originalPrice || "",
            categoryId: p.categoryId || "",
            brand: p.brand || "",
            stock: p.stock || "",
            images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
            featured: p.featured || false,
          });
          setUploadedImages(Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []));
          setImagePreview(Array.isArray(p.images) ? p.images[0] || "" : p.images || "");
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, router]);

  const handleImageUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const token = localStorage.getItem("token");
    const newUrls = [];
    for (const file of files) {
      const form = new FormData();
      form.append("image", file);
      try {
        const res = await fetch(`${API_URL}/products/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        const data = await res.json();
        if (data.url) newUrls.push(data.url);
      } catch {}
    }
    const updated = [...uploadedImages, ...newUrls];
    setUploadedImages(updated);
    setFormData({ ...formData, images: updated });
    if (newUrls.length && !imagePreview) setImagePreview(newUrls[0]);
    setUploading(false);
    e.target.value = "";
  }, [uploadedImages, formData, imagePreview]);

  const removeImage = useCallback((index) => {
    const updated = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updated);
    setFormData({ ...formData, images: updated });
    if (imagePreview === uploadedImages[index]) {
      setImagePreview(updated[0] || "");
    }
  }, [uploadedImages, formData, imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      categoryId: parseInt(formData.categoryId),
      brand: formData.brand,
      stock: parseInt(formData.stock),
      images: formData.images,
      featured: formData.featured,
    };

    try {
      const url = isEdit ? `${API_URL}/products/${id}` : `${API_URL}/products`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save product");
      }
    } catch (err) {
      alert("Error saving product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center"><div className="spinner-border text-warning"></div></div>;
  }

  if (!user || user.role !== "admin") return null;

  return (
    <AdminLayout>
      <div className="add-product-page">
        {/* Page Header */}
        <div className="page-header-new">
          <div className="header-left">
            <Link href="/admin/products" className="back-btn">
              <i className="bi bi-arrow-left"></i>
            </Link>
            <div>
              <h1>{isEdit ? "Edit Product" : "Add New Product"}</h1>
              <p>{isEdit ? "Update product details" : "Create a new product listing"}</p>
            </div>
          </div>
          <div className="header-right">
            <Link href="/admin/products" className="btn-cancel">
              <i className="bi bi-x-lg"></i> Cancel
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="product-form-grid">
            {/* Left Column - Main Info */}
            <div className="form-main">
              {/* Product Information Card */}
              <div className="form-card">
                <div className="card-header-new">
                  <i className="bi bi-info-circle-fill"></i>
                  <span>Product Information</span>
                </div>
                <div className="card-body-new">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label-new">
                        Product Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input-new"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label-new">Brand</label>
                      <input
                        type="text"
                        className="form-input-new"
                        placeholder="Enter brand name"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label-new">
                      Description <span className="required">*</span>
                    </label>
                    <textarea
                      className="form-textarea-new"
                      rows="6"
                      placeholder="Start writing product description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label-new">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-input-new"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label-new">Category</label>
                      <select
                        className="form-select-new"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                      >
                        <option value="">Select category...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="featured-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                      <span className="toggle-label">Featured Product</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="form-card">
                <div className="card-header-new">
                  <i className="bi bi-currency-dollar"></i>
                  <span>Pricing</span>
                </div>
                <div className="card-body-new">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label-new">
                        Regular Price <span className="required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">$</span>
                        <input
                          type="number"
                          step="0.01"
                          className="form-input-new with-icon"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label-new">Sale Price</label>
                      <div className="input-with-icon">
                        <span className="input-icon">$</span>
                        <input
                          type="number"
                          step="0.01"
                          className="form-input-new with-icon"
                          placeholder="0.00"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        />
                      </div>
                      <small className="form-hint">Leave empty if no discount</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Images & Actions */}
            <div className="form-sidebar">
              {/* Image Upload Card */}
              <div className="form-card">
                <div className="card-header-new">
                  <i className="bi bi-images"></i>
                  <span>Product Images</span>
                </div>
                <div className="card-body-new">
                  <div className="image-upload-area">
                    {imagePreview ? (
                      <img src={getImageUrl(imagePreview)} alt="Preview" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <i className="bi bi-cloud-arrow-up"></i>
                        <span>Image preview</span>
                      </div>
                    )}
                  </div>
                  <label className="btn-upload-new">
                    <i className="bi bi-cloud-arrow-up"></i> {uploading ? "Uploading..." : "Upload Images"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: "none" }}
                    />
                  </label>
                  {uploadedImages.length > 0 && (
                    <div className="uploaded-images-grid">
                      {uploadedImages.map((url, i) => (
                        <div key={i} className="uploaded-thumb">
                          <img src={getImageUrl(url)} alt={`img-${i}`} />
                          <button type="button" className="remove-img-btn" onClick={() => removeImage(i)}>
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <small className="form-hint">Upload product images (JPG, PNG, JPEG)</small>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-card action-card">
                <div className="card-header-new">
                  <i className="bi bi-send"></i>
                  <span>{isEdit ? "Update Product" : "Publish Product"}</span>
                </div>
                <div className="card-body-new">
                  <p className="action-hint">
                    {isEdit ? "Save your changes to update the product." : "Review all information before publishing."}
                  </p>
                  <button type="submit" className="btn-submit-new" disabled={saving}>
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm"></span> Saving...</>
                    ) : (
                      <><i className="bi bi-check-circle"></i> {isEdit ? "Update Product" : "Add Product"}</>
                    )}
                  </button>
                  <Link href="/admin/products" className="btn-cancel-new">
                    <i className="bi bi-arrow-left"></i> Back to Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
