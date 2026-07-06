"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/mockData";

const API_URL = "/api";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const dealParam = searchParams.get("deal");
  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");
  const queryParam = searchParams.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(sortParam || "relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [pageTitle, setPageTitle] = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    fetchProducts();
  }, [dealParam, categoryParam, queryParam]);

  useEffect(() => {
    if (dealParam === "true") {
      setPageTitle("Today's Deals");
    } else if (categoryParam) {
      setPageTitle(categoryParam);
    } else if (queryParam) {
      setPageTitle(`Search results for "${queryParam}"`);
    }
  }, [dealParam, categoryParam, queryParam]);

  const fetchProducts = async (categoryFilter = null) => {
    try {
      let url = `${API_URL}/products?limit=100`;
      
      if (dealParam === "true") {
        url = `${API_URL}/products/deals`;
      } else if (categoryFilter && categoryFilter !== "All") {
        const cat = categories.find(c => c.name === categoryFilter);
        if (cat) url = `${API_URL}/products?category=${cat.slug}`;
      } else if (categoryParam && categoryParam !== "All") {
        const cat = categories.find(c => c.name === categoryParam);
        if (cat) url = `${API_URL}/products?category=${cat.slug}`;
      } else if (queryParam) {
        url = `${API_URL}/products?search=${encodeURIComponent(queryParam)}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const allBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "All" && dealParam !== "true") {
      filtered = filtered.filter((p) => {
        const catName = p.Category?.name || p.categoryName || p.category;
        return catName === selectedCategory;
      });
    }
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }
    if (minRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= minRating);
    }
    if (inStockOnly) {
      filtered = filtered.filter((p) => (p.stock || 0) > 0);
    }

    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
      case "rating": filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "newest": filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "best-selling": filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)); break;
    }

    return filtered;
  }, [selectedCategory, priceRange, selectedBrands, minRating, sortBy, inStockOnly, products, dealParam]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, 2000]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("relevance");
    setCurrentPage(1);
    fetchProducts("All");
  };

  if (loading) {
    return (
      <div className="search-page">
        <div className="search-container">
          <div className="search-loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-container">
        {/* Breadcrumb */}
        <nav className="search-breadcrumb">
          <a href="/" className="breadcrumb-link"><i className="bi bi-house-door"></i> Home</a>
          <i className="bi bi-chevron-right"></i>
          <span className="breadcrumb-current">{pageTitle}</span>
        </nav>

        <div className="search-layout">
          {/* Mobile Filter Toggle */}
          <button className="mobile-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <i className="bi bi-funnel"></i>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Sidebar Filters */}
          <aside className={`search-sidebar ${showFilters ? "open" : ""}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="clear-btn" onClick={clearAllFilters}>Clear All</button>
            </div>

            {/* Category */}
            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input type="radio" name="category" checked={selectedCategory === "All"} onChange={() => { setSelectedCategory("All"); fetchProducts("All"); setCurrentPage(1); }} />
                  <span>All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label className="filter-option" key={cat.slug}>
                    <input type="radio" name="category" checked={selectedCategory === cat.name} onChange={() => { setSelectedCategory(cat.name); fetchProducts(cat.name); setCurrentPage(1); }} />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-display">
                <span>${priceRange[0]}</span>
                <span>—</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                className="price-slider"
                min="0"
                max="2000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => { setPriceRange([priceRange[0], parseInt(e.target.value)]); setCurrentPage(1); }}
              />
            </div>

            {/* Brand */}
            {allBrands.length > 0 && (
              <div className="filter-group">
                <h4>Brand</h4>
                <div className="filter-options">
                  {allBrands.map((brand) => (
                    <label className="filter-option" key={brand}>
                      <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="filter-group">
              <h4>Customer Rating</h4>
              <div className="filter-options">
                {[4, 3, 2, 1].map((r) => (
                  <label className="filter-option rating-option" key={r}>
                    <input type="radio" name="rating" checked={minRating === r} onChange={() => { setMinRating(r); setCurrentPage(1); }} />
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi ${i < r ? "bi-star-fill" : "bi-star"}`}></i>
                      ))}
                      <span>& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="filter-group">
              <h4>Availability</h4>
              <label className="filter-option switch-option">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(1); }} />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Main Content */}
          <main className="search-results">
            {/* Sort Bar */}
            <div className="results-header">
              <div className="results-count">
                <span className="count">{filteredProducts.length}</span> results
              </div>
              <div className="sort-dropdown">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest</option>
                  <option value="best-selling">Best Selling</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="results-grid">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-results">
                <i className="bi bi-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="pagination-nav">
                <button 
                  className="page-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <i className="bi bi-chevron-left"></i> Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`page-num ${currentPage === page ? "active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  className="page-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next <i className="bi bi-chevron-right"></i>
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
