"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { getImageUrl } from "@/lib/api";

const API_URL = "/api";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (slug) {
      fetch(`${API_URL}/products/${slug}`)
        .then((r) => r.json())
        .then((data) => {
          setProduct(data.product || data);
          setRelated(data.related || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
          <h2>Product not found</h2>
          <Link href="/" className="btn-buy-now-modern" style={{ display: "inline-flex", width: "auto", marginTop: "16px" }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const images = (Array.isArray(product.images) ? product.images : [product.image || product.images]).filter(Boolean);
  const rating = product.rating || 4;
  const reviewCount = product.reviewCount || 0;
  const originalPrice = product.originalPrice || product.price;
  const currentPrice = product.discountPrice || product.price;
  const discount = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb-modern">
          <Link href="/" className="breadcrumb-link">
            <i className="bi bi-house-door"></i> Home
          </Link>
          <i className="bi bi-chevron-right breadcrumb-separator"></i>
          <Link href="/search" className="breadcrumb-link">Products</Link>
          <i className="bi bi-chevron-right breadcrumb-separator"></i>
          <span className="breadcrumb-current">{product?.name}</span>
        </nav>

        <div className="row g-4">
          {/* Images Section */}
          <div className="col-lg-5">
            <div className="product-gallery">
              <div className="main-image-container">
                {discount > 0 && (
                  <div className="discount-badge">-{discount}%</div>
                )}
                {images[selectedImage] ? (
                  <img
                    src={getImageUrl(images[selectedImage])}
                    alt={product.name}
                    className="main-image"
                  />
                ) : (
                  <div className="main-image no-image-placeholder">
                    <i className="bi bi-image"></i>
                  </div>
                )}
              </div>
              <div className="thumbnail-strip">
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`thumbnail-item ${selectedImage === i ? "active" : ""}`}
                  >
                    {img && <img src={getImageUrl(img)} alt="" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-4">
            <div className="product-info">
              {product.Category && (
                <Link href={`/search?category=${product.Category.name}`} className="category-link">
                  {product.Category.name}
                </Link>
              )}
              
              <h1 className="product-title">{product.name}</h1>

              {/* Rating */}
              <div className="rating-section">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`bi ${star <= rating ? "bi-star-fill" : star - 0.5 <= rating ? "bi-star-half" : "bi-star"}`}></i>
                  ))}
                </div>
                <span className="rating-count">{reviewCount.toLocaleString()} ratings</span>
              </div>

              {/* Price */}
              <div className="price-section">
                <div className="price-main">
                  <span className="price-symbol">$</span>
                  <span className="price-whole">{Math.floor(currentPrice)}</span>
                  <span className="price-fraction">{(currentPrice % 1).toFixed(2).substring(1)}</span>
                </div>
                {discount > 0 && (
                  <div className="price-savings">
                    <span className="savings-badge">Save {discount}%</span>
                    <span className="original-price">${originalPrice.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="features-list">
                <div className="feature-item">
                  <i className="bi bi-truck feature-icon"></i>
                  <div>
                    <strong>FREE Delivery</strong>
                    <small>Fast & free shipping</small>
                  </div>
                </div>
                <div className="feature-item">
                  <i className="bi bi-box-seam feature-icon"></i>
                  <div>
                    <strong>In Stock</strong>
                    <small>{product.stock || "Limited"} available</small>
                  </div>
                </div>
                <div className="feature-item">
                  <i className="bi bi-shield-check feature-icon"></i>
                  <div>
                    <strong>Secure Transaction</strong>
                    <small>Encrypted payment</small>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs-section">
                <div className="tabs-header">
                  <button className={`tab-btn ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>
                    Description
                  </button>
                  <button className={`tab-btn ${activeTab === "specs" ? "active" : ""}`} onClick={() => setActiveTab("specs")}>
                    Specifications
                  </button>
                </div>
                <div className="tabs-content">
                  {activeTab === "description" ? (
                    <p className="description-text">{product.description || "No description available."}</p>
                  ) : (
                    <div className="specs-table">
                      <div className="spec-row">
                        <span className="spec-label">Brand</span>
                        <span className="spec-value">{product.brand || "Generic"}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Category</span>
                        <span className="spec-value">{product.Category?.name || "General"}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">SKU</span>
                        <span className="spec-value">AMZ-{String(product.id).padStart(4, "0")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buy Box */}
          <div className="col-lg-3">
            <div className="buy-box">
              <div className="buy-box-header">
                <h3 className="buy-box-price">${currentPrice.toFixed(2)}</h3>
                <p className="delivery-info">
                  <i className="bi bi-truck"></i>
                  <span>FREE delivery <strong>Tomorrow</strong></span>
                </p>
              </div>

              <div className="buy-box-body">
                <p className="stock-status in-stock">
                  <i className="bi bi-check-circle-fill"></i> In Stock
                </p>

                <div className="quantity-selector">
                  <label>Qty:</label>
                  <div className="qty-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}>+</button>
                  </div>
                </div>

                <button className="btn-add-cart-modern" onClick={handleAddToCart}>
                  {addedToCart ? (
                    <><i className="bi bi-check-lg"></i> Added to Cart</>
                  ) : (
                    <><i className="bi bi-cart-plus"></i> Add to Cart</>
                  )}
                </button>

                <Link href={`/checkout?productId=${product.id}&name=${encodeURIComponent(product.name)}&price=${currentPrice}&image=${encodeURIComponent(images[selectedImage])}&qty=${quantity}`} className="btn-buy-now-modern">
                  <i className="bi bi-lightning-charge-fill"></i> Buy Now
                </Link>

                <div className="buy-box-footer">
                  <div className="footer-row">
                    <span>Ships from</span>
                    <span>SohailVerse</span>
                  </div>
                  <div className="footer-row">
                    <span>Sold by</span>
                    <span>SohailVerse</span>
                  </div>
                  <div className="footer-row">
                    <span>Returns</span>
                    <span className="return-link">30-day refund</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="related-products">
            <h3 className="section-title">
              <i className="bi bi-grid-3x3-gap-fill"></i>
              Related Products
            </h3>
            <div className="row g-3">
              {related.map((p) => (
                <div key={p.id} className="col-6 col-md-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
