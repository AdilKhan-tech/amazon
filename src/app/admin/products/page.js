"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { getImageUrl } from "@/lib/api";

const API_URL = "/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
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
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=100`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return <div className="admin-page"><div className="text-center py-5"><div className="spinner-border text-warning"></div></div></div>;
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-page">
      <AdminLayout>
        {/* Header */}
        <div className="page-header">
          <div>
            <h4 className="page-title">Products</h4>
            <p className="page-subtitle">Manage your product inventory</p>
          </div>
          <div className="page-actions">
            <Link href="/admin/products/new" className="btn-primary-modern">
              <i className="bi bi-plus-lg"></i> Add Product
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-icon bg-primary">
              <i className="bi bi-box-seam"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{products.length}</span>
              <span className="stat-label">Total Products</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon bg-success">
              <i className="bi bi-check-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{products.filter(p => p.stock > 0).length}</span>
              <span className="stat-label">In Stock</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon bg-danger">
              <i className="bi bi-exclamation-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-number">{products.filter(p => p.stock === 0).length}</span>
              <span className="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="filter-bar">
          <div className="search-box">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-actions">
            <select className="filter-select">
              <option>All Categories</option>
            </select>
            <button className="filter-btn">
              <i className="bi bi-funnel"></i> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="data-table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>
                    ID {sortColumn === "id" && (sortDirection === "asc" ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>)}
                  </th>
                  <th>Product</th>
                  <th onClick={() => handleSort("name")}>
                    Name {sortColumn === "name" && (sortDirection === "asc" ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>)}
                  </th>
                  <th onClick={() => handleSort("price")}>
                    Price {sortColumn === "price" && (sortDirection === "asc" ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>)}
                  </th>
                  <th onClick={() => handleSort("stock")}>
                    Stock {sortColumn === "stock" && (sortDirection === "asc" ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>)}
                  </th>
                  <th>Category</th>
                  <th onClick={() => handleSort("createdAt")}>
                    Date {sortColumn === "createdAt" && (sortDirection === "asc" ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>)}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td><span className="product-id">#{product.id}</span></td>
                    <td>
                      <div className="product-image-cell">
                        <img
                          src={getImageUrl(Array.isArray(product.images) ? product.images[0] : product.image)}
                          alt={product.name}
                          className="product-image"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="product-name">{product.name}</div>
                      <div className="product-sku">SKU: AMZ-{String(product.id).padStart(4, "0")}</div>
                    </td>
                    <td><span className="price-tag">${product.price.toFixed(2)}</span></td>
                    <td>
                      <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                        {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                      </span>
                    </td>
                    <td><span className="category-tag">{product.Category?.name || "N/A"}</span></td>
                    <td><span className="date-text">{new Date(product.createdAt).toLocaleDateString()}</span></td>
                    <td>
                      <div className="action-buttons">
                        <Link href={`/admin/products/${product.id}`} className="action-btn edit">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button className="action-btn delete" onClick={() => handleDelete(product.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="table-footer">
            <div className="table-info">
              Showing {paginatedProducts.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </div>
            <div className="table-controls">
              <select className="per-page-select" value={itemsPerPage} onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              <div className="pagination-buttons">
                <button className="page-btn" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button className="page-btn" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}
