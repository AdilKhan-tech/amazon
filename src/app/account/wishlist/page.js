"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AccountLayout from "@/components/AccountLayout";
import { products } from "@/data/mockData";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlistItems(JSON.parse(stored));
    } else {
      // Default wishlist from mock data
      const defaultWishlist = products.slice(0, 5);
      setWishlistItems(defaultWishlist);
      localStorage.setItem("wishlist", JSON.stringify(defaultWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const totalItems = wishlistItems.length;
  const totalValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="premium-dashboard">
      <AccountLayout>
        {/* Header */}
        <div className="premium-page-header">
          <div>
            <h2>My Wishlist</h2>
            <p>Items you've saved for later</p>
          </div>
          <Link href="/" className="premium-btn">
            <i className="bi bi-bag-plus"></i> Add More Items
          </Link>
        </div>

        {/* Stats */}
        <div className="premium-stats">
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" }}>
                  <i className="bi bi-heart-fill"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">{totalItems}</h3>
                <p className="stat-card-label">Saved Items</p>
              </div>
            </div>
          </div>
          <div className="premium-stat-card">
            <div className="stat-card-bg" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}></div>
            <div className="stat-card-inner">
              <div className="stat-card-top">
                <div className="stat-card-icon" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                  <i className="bi bi-currency-dollar"></i>
                </div>
              </div>
              <div className="stat-card-bottom">
                <h3 className="stat-card-value">${totalValue.toFixed(2)}</h3>
                <p className="stat-card-label">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="premium-card">
            <div className="premium-card-body">
              <div className="empty-state">
                <div className="empty-icon"><i className="bi bi-heart"></i></div>
                <h3>Your wishlist is empty</h3>
                <p>Save items you like for later by clicking the heart icon on products</p>
                <Link href="/" className="premium-btn">
                  <i className="bi bi-bag-plus"></i> Start Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => {
              const discount = item.originalPrice
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;
              return (
                <div key={item.id} className="wishlist-card">
                  <div className="wishlist-card-image">
                    <Link href={`/product/${item.slug}`}>
                      <img src={item.image} alt={item.name} />
                    </Link>
                    {discount > 0 && <span className="wishlist-discount-badge">-{discount}%</span>}
                    <button className="wishlist-remove-btn" onClick={() => removeItem(item.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div className="wishlist-card-info">
                    <Link href={`/product/${item.slug}`} className="wishlist-card-title">
                      {item.name}
                    </Link>
                    <div className="wishlist-card-rating">
                      <div className="wishlist-stars">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`bi ${i < Math.floor(item.rating) ? "bi-star-fill" : "bi-star"}`}></i>
                        ))}
                      </div>
                      <span className="wishlist-review-count">({item.reviewCount})</span>
                    </div>
                    <div className="wishlist-card-price">
                      <span className="current-price">${item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button className="wishlist-add-cart-btn">
                      <i className="bi bi-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AccountLayout>
    </div>
  );
}
