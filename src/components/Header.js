"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "All", "Electronics", "Fashion", "Home & Kitchen", "Beauty", "Books", "Sports", "Toys", "Automotive",
];

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  }, [router]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleAccountDropdown = useCallback(() => {
    setAccountDropdownOpen(prev => !prev);
  }, []);

  const closeAccountDropdown = useCallback(() => {
    setAccountDropdownOpen(false);
  }, []);

  return (
    <header className="amazon-header-new">
      {/* Main Header Row */}
      <div className="header-top">
        <div className="header-top-inner">
          {/* Logo */}
          <Link href="/" className="header-logo-new">
            <div className="logo-box">
              <i className="bi bi-box-seam-fill"></i>
            </div>
            <div className="logo-text-new">
              <span className="logo-amazon">Sohail</span>
              <span className="logo-store">Verse</span>
            </div>
          </Link>

          {/* Deliver To */}
          <div className="deliver-to">
            <span className="deliver-label">Deliver to</span>
            <span className="deliver-location">
              <i className="bi bi-geo-alt-fill"></i>
              <strong>Pakistan</strong>
            </span>
          </div>

          {/* Search Bar */}
          <div className="search-bar-new">
            <select
              className="search-dropdown"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              className="search-field"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link
              href={`/search?q=${searchQuery}&category=${searchCategory}`}
              className="search-button"
            >
              <i className="bi bi-search"></i>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="header-right">
            {/* Account */}
            {user ? (
              <div className="account-section account-dropdown-wrapper">
                <button className="account-trigger" onClick={toggleAccountDropdown}>
                  <span className="hello-text">Hello, {user.name}</span>
                  <span className="account-text">
                    <i className="bi bi-person-circle"></i> Account <i className="bi bi-chevron-down"></i>
                  </span>
                </button>
                {accountDropdownOpen && (
                  <div className="account-dropdown">
                    <Link href={user?.role === "admin" ? "/admin" : "/account"} className="dropdown-item" onClick={closeAccountDropdown}>
                      <i className="bi bi-person"></i> Your Account
                    </Link>
                    <Link href="/account/orders" className="dropdown-item" onClick={closeAccountDropdown}>
                      <i className="bi bi-bag"></i> Your Orders
                    </Link>
                    <Link href="/order-tracking" className="dropdown-item" onClick={closeAccountDropdown}>
                      <i className="bi bi-geo-alt"></i> Track Order
                    </Link>
                    <Link href="/account/wishlist" className="dropdown-item" onClick={closeAccountDropdown}>
                      <i className="bi bi-heart"></i> Wishlist
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin" className="dropdown-item admin" onClick={closeAccountDropdown}>
                        <i className="bi bi-speedometer2"></i> Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item signout" onClick={() => {
                      handleLogout();
                      closeAccountDropdown();
                    }}>
                      <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="account-section">
                <span className="hello-text">Hello, Sign in</span>
                <span className="account-text">
                  <i className="bi bi-person-circle"></i> Account
                </span>
              </Link>
            )}

            {/* Returns & Orders */}
            <Link href={user ? "/account/orders" : "/login"} className="orders-section">
              <span className="returns-text">Returns</span>
              <span className="orders-text">& Orders</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="cart-section">
              <div className="cart-icon-new">
                <i className="bi bi-cart3"></i>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </div>
              <span className="cart-text">Cart</span>
            </Link>

            {/* Mobile Menu Button */}
            <button className="mobile-toggle" onClick={toggleMobileMenu}>
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="header-bottom">
        <div className="header-bottom-inner">
          <Link href="/" className="nav-all">
            <i className="bi bi-list"></i> All
          </Link>
          <Link href="/search?deal=true" className="nav-link-new">Today's Deals</Link>
          <Link href="/search" className="nav-link-new">Customer Service</Link>
          {user?.role === "admin" && (
            <Link href="/admin" className="nav-link-new admin-link">Admin Panel</Link>
          )}
          <Link href="/order-tracking" className="nav-link-new">Track Order</Link>
          <Link href="/gift-cards" className="nav-link-new">Gift Cards</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-new">
          <div className="mobile-menu-content">
            {user ? (
              <>
                <div className="mobile-user-info">
                  <i className="bi bi-person-circle"></i> Hello, {user.name}
                </div>
                <Link href="/account" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <i className="bi bi-person"></i> Your Account
                </Link>
                <Link href="/account/orders" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <i className="bi bi-bag"></i> Your Orders
                </Link>
                <Link href="/account/wishlist" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <i className="bi bi-heart"></i> Wishlist
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="mobile-nav-link admin" onClick={closeMobileMenu}>
                    <i className="bi bi-speedometer2"></i> Admin Panel
                  </Link>
                )}
                <button className="mobile-nav-link signout" onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}>
                  <i className="bi bi-box-arrow-right"></i> Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="mobile-nav-link signin" onClick={closeMobileMenu}>
                <i className="bi bi-box-arrow-in-right"></i> Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default memo(Header);
