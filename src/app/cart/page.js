"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/api";

const API_URL = "/api";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((r) => r.json())
        .then((data) => {
          setCart(data);
          setCartItems(data.items || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="container py-5 text-center"><div className="spinner-border text-warning"></div></div>;
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Please sign in to view your cart</h3>
        <Link href="/login" className="btn btn-amazon mt-3">Sign In</Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const total = subtotal + shipping;

  const removeItem = (itemId) => {
    fetch(`${API_URL}/cart/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    });
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5" style={{ borderRadius: "10px" }}>
          <i className="bi bi-cart-x display-1 text-muted"></i>
          <h4 className="mt-3">Your cart is empty</h4>
          <p className="text-muted">Add some products to get started!</p>
          <Link href="/" className="btn btn-amazon mt-2">Continue Shopping</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="row align-items-center py-3">
                      <div className="col-4 col-md-2">
                        <img
                          src={getImageUrl(Array.isArray(item.product?.images) ? item.product.images[0] : item.product?.image)}
                          alt={item.product?.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "100px", objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-8 col-md-4">
                        <Link href={`/product/${item.product?.id}`} className="text-decoration-none text-dark fw-bold small">
                          {item.product?.name}
                        </Link>
                        <p className="text-success small mt-1 mb-0 d-none d-md-block">In Stock</p>
                      </div>
                      <div className="col-6 col-md-2 mt-2 mt-md-0">
                        <div className="quantity-stepper">
                          <button className="qty-btn">-</button>
                          <input type="number" className="qty-input" value={item.quantity} readOnly />
                          <button className="qty-btn">+</button>
                        </div>
                      </div>
                      <div className="col-6 col-md-2 mt-2 mt-md-0 text-md-start text-end">
                        <span className="fw-bold">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="col-12 col-md-2 text-end mt-2 mt-md-0">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}>
                          <i className="bi bi-trash"></i> Remove
                        </button>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <hr />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span className="fw-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className={shipping === 0 ? "text-success" : ""}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold fs-5">Total:</span>
                  <span className="fw-bold fs-5 text-dark">${total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="btn btn-buy-now w-100">
                  <i className="bi bi-lock-fill me-2"></i>Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
