"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, heroBanners } from "@/data/mockData";

const API_URL = "/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=40`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deals = products.filter((p) => p.originalPrice && ((p.originalPrice - p.price) / p.originalPrice) > 0.2);
  const featured = products.filter((p) => p.featured);
  const bestSellers = [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 10);
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  const topRated = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);

  if (loading) {
    return (
      <div className="amz-home-skeleton">
        <div className="amz-skeleton-hero"></div>
        <div className="amz-skeleton-content">
          <div className="amz-skeleton-row">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="amz-skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="amz-homepage">
      {/* Hero Carousel */}
      <div className="amz-hero">
        <div className="amz-hero-slider">
          {heroBanners.map((banner, i) => (
            <div
              key={banner.id}
              className={`amz-hero-slide ${i === currentSlide ? "active" : ""}`}
            >
              <Link href={banner.link}>
                <img src={banner.image} alt={banner.title} />
              </Link>
            </div>
          ))}
        </div>
        <div className="amz-hero-fade"></div>
        <div className="amz-hero-controls">
          <button className="amz-hero-btn amz-hero-prev" onClick={() => setCurrentSlide((currentSlide - 1 + heroBanners.length) % heroBanners.length)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="amz-hero-btn amz-hero-next" onClick={() => setCurrentSlide((currentSlide + 1) % heroBanners.length)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Content overlapping hero */}
      <div className="amz-home-content">
        {/* Category Cards Grid */}
        <div className="amz-category-grid">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/search?category=${cat.name}`} className="amz-cat-card">
              <h2 className="amz-cat-title">{cat.name}</h2>
              <div className="amz-cat-img-wrap">
                <img src={cat.image} alt={cat.name} loading="lazy" />
              </div>
              <span className="amz-cat-link">Shop now</span>
            </Link>
          ))}
        </div>

        {/* Deals Section */}
        {deals.length > 0 && (
          <section className="amz-section">
            <div className="amz-section-header">
              <div className="amz-section-title-wrap">
                <i className="bi bi-lightning-charge-fill amz-deal-icon"></i>
                <h2 className="amz-section-title">Today's Deals</h2>
              </div>
              <Link href="/search?deal=true" className="amz-section-link">See all deals <i className="bi bi-chevron-right"></i></Link>
            </div>
            <div className="amz-product-grid">
              {deals.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="amz-section">
            <div className="amz-section-header">
              <div className="amz-section-title-wrap">
                <i className="bi bi-star-fill amz-featured-icon"></i>
                <h2 className="amz-section-title">Featured for You</h2>
              </div>
              <Link href="/search?featured=true" className="amz-section-link">View all <i className="bi bi-chevron-right"></i></Link>
            </div>
            <div className="amz-product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        <section className="amz-section">
          <div className="amz-section-header">
            <div className="amz-section-title-wrap">
              <i className="bi bi-trophy-fill amz-bestseller-icon"></i>
              <h2 className="amz-section-title">Best Sellers</h2>
            </div>
            <Link href="/search?sort=best-selling" className="amz-section-link">View all <i className="bi bi-chevron-right"></i></Link>
          </div>
          <div className="amz-product-grid">
            {bestSellers.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="amz-section">
          <div className="amz-section-header">
            <div className="amz-section-title-wrap">
              <i className="bi bi-box-seam-fill amz-new-icon"></i>
              <h2 className="amz-section-title">New Arrivals</h2>
            </div>
            <Link href="/search?sort=newest" className="amz-section-link">View all <i className="bi bi-chevron-right"></i></Link>
          </div>
          <div className="amz-product-grid">
            {newArrivals.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <section className="amz-section">
          <div className="amz-section-header">
            <div className="amz-section-title-wrap">
              <i className="bi bi-hand-thumbs-up-fill amz-toprated-icon"></i>
              <h2 className="amz-section-title">Top Rated</h2>
            </div>
            <Link href="/search?sort=rating" className="amz-section-link">View all <i className="bi bi-chevron-right"></i></Link>
          </div>
          <div className="amz-product-grid">
            {topRated.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
