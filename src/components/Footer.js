"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="amz-footer">
      {/* Back to top */}
      <button className="amz-back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        Back to top
      </button>

      {/* Main link columns */}
      <div className="amz-footer-links">
        <div className="amz-footer-container">
          <div className="amz-footer-row">
            <div className="amz-footer-col">
              <h3>Get to Know Us</h3>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/press">Press Releases</Link></li>
                <li><Link href="/blog">SohailVerse Blog</Link></li>
              </ul>
            </div>
            <div className="amz-footer-col">
              <h3>Connect with Us</h3>
              <ul>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">YouTube</a></li>
              </ul>
            </div>
            <div className="amz-footer-col">
              <h3>Make Money with Us</h3>
              <ul>
                <li><Link href="/sell">Sell products</Link></li>
                <li><Link href="/affiliate">Become an Affiliate</Link></li>
                <li><Link href="/advertise">Advertise Your Products</Link></li>
                <li><Link href="/publish">Self-Publish with Us</Link></li>
              </ul>
            </div>
            <div className="amz-footer-col">
              <h3>Let Us Help You</h3>
              <ul>
                <li><Link href="/account">Your Account</Link></li>
                <li><Link href="/account/orders">Your Orders</Link></li>
                <li><Link href="/order-tracking">Track Your Order</Link></li>
                <li><Link href="/returns">Returns & Replacements</Link></li>
                <li><Link href="/help">Help Center</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Divider with logo */}
      <div className="amz-footer-divider">
        <div className="amz-footer-container">
          <Link href="/" className="amz-footer-logo">
            <div className="amz-footer-logo-box">
              <i className="bi bi-box-seam-fill"></i>
            </div>
            <div className="amz-footer-logo-text">
              <span className="logo-main">Sohail</span>
              <span className="logo-accent">Verse</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="amz-footer-bottom">
        <div className="amz-footer-container">
          <div className="amz-bottom-links">
            <a href="#">Conditions of Use</a>
            <a href="#">Privacy Notice</a>
            <a href="#">Your Ads Privacy Choices</a>
          </div>
          <div className="amz-bottom-copy">
            © 2026, SohailVerse.com, Inc. or its affiliates
          </div>
        </div>
      </div>
    </footer>
  );
}
