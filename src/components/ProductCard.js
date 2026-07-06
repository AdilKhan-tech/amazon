"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import { getImageUrl } from "@/lib/api";

function ProductCard({ product }) {
  const { currentPrice, originalPrice, discount, image, productLink, hasImage } = useMemo(() => {
    const origPrice = product.originalPrice || product.price;
    const currPrice = product.discountPrice || product.price;
    const disc = origPrice > currPrice
      ? Math.round(((origPrice - currPrice) / origPrice) * 100)
      : 0;
    const img = Array.isArray(product.images) ? product.images[0] : product.image;
    const link = `/product/${product.slug || product.id}`;
    
    return {
      currentPrice: currPrice,
      originalPrice: origPrice,
      discount: disc,
      image: img,
      productLink: link,
      hasImage: !!img
    };
  }, [product]);

  const stars = useMemo(() => {
    const rating = product.rating || 0;
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`bi ${i < Math.floor(rating) ? "bi-star-fill" : i < rating ? "bi-star-half" : "bi-star"}`}
      ></i>
    ));
  }, [product.rating]);

  return (
    <div className="amz-card">
      <Link href={productLink} className="amz-card-link">
        <div className="amz-card-img-wrap">
          {hasImage ? (
            <img
              src={getImageUrl(image)}
              className="amz-card-img"
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <div className="amz-card-no-img">
              <i className="bi bi-image"></i>
            </div>
          )}
        </div>
        <div className="amz-card-body">
          <h6 className="amz-card-title">{product.name}</h6>
          <div className="amz-card-rating">
            <div className="amz-stars">{stars}</div>
            <span className="amz-rating-count">{(product.reviewCount || 0).toLocaleString()}</span>
          </div>
          <div className="amz-card-price-row">
            <span className="amz-price-symbol">$</span>
            <span className="amz-price-whole">{Math.floor(currentPrice)}</span>
            <span className="amz-price-fraction">{(currentPrice % 1).toFixed(2).substring(2)}</span>
            {discount > 0 && (
              <span className="amz-price-original">${originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.freeDelivery && (
            <div className="amz-delivery">
              <span className="amz-prime-badge">prime</span> FREE Delivery
            </div>
          )}
          <button className="amz-card-add-cart" onClick={(e) => { e.preventDefault(); }}>
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
}

export default memo(ProductCard);
