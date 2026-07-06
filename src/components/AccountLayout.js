"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navItems = [
    { href: "/account", icon: "bi-person-fill", label: "Profile" },
    { href: "/account/orders", icon: "bi-bag-fill", label: "My Orders" },
    { href: "/account/wishlist", icon: "bi-heart-fill", label: "Wishlist" },
    { href: "/account/addresses", icon: "bi-geo-alt-fill", label: "Addresses" },
    { href: "/account/settings", icon: "bi-gear-fill", label: "Settings" },
    { href: "/order-tracking", icon: "bi-truck", label: "Track Order" },
  ];

  const isActive = (href) => {
    if (href === "/account") return pathname === "/account";
    return pathname?.startsWith(href);
  };

  return (
    <div className="admin-layout-wrapper">
      {/* Premium Sidebar */}
      <aside className="premium-sidebar">
        {/* Brand */}
        <div className="premium-brand">
          <div className="brand-logo">
            <i className="bi bi-person-circle"></i>
          </div>
          <span className="brand-text">My Account</span>
        </div>

        {/* User Profile */}
        <div className="premium-user-card">
          {user?.image ? (
            <img 
              src={user.image.startsWith("http") ? user.image : `http://localhost:5000${user.image}`} 
              alt={user?.name} 
              className="user-avatar-img" 
            />
          ) : (
            <div className="user-avatar">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <div className="user-info">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role">{user?.role === "admin" ? "Administrator" : "Member"}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="premium-nav">
          <span className="nav-section-title">Menu</span>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`premium-nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
              {isActive(item.href) && <span className="nav-active-bar"></span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="premium-nav-bottom">
          <span className="nav-section-title">Actions</span>
          {user?.role === "admin" && (
            <Link href="/admin" className="premium-nav-item">
              <i className="bi bi-speedometer2"></i>
              <span>Admin Dashboard</span>
            </Link>
          )}
          <Link href="/" className="premium-nav-item">
            <i className="bi bi-house-door-fill"></i>
            <span>Back to Store</span>
          </Link>
          <button onClick={handleLogout} className="premium-nav-item logout">
            <i className="bi bi-box-arrow-right"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="premium-main">
        {children}
      </main>
    </div>
  );
}
