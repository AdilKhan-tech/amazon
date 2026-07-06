"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";

const API_URL = "/api";

export default function TodaysDealsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products?limit=100`)
      .then((r) => r.json())
      .then((data) => {
        const allProducts = data.products || [];
        const deals = allProducts.filter(
          (p) => p.originalPrice > p.price || p.discountPrice < p.price
        );
        setProducts(deals.length > 0 ? deals : allProducts.slice(0, 12));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="deals-page">
      <div className="container">
        <div className="deals-header text-center py-4">
          <h1 className="fw-bold">Today&apos;s Deals</h1>
          <p className="text-muted">Limited time offers on top products</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted py-5">No deals available right now.</p>
        ) : (
          <div className="row g-3">
            {products.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
