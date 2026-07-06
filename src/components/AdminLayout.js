"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
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
    { href: "/admin", icon: "bi-grid-1x2-fill", label: "Dashboard" },
    { href: "/admin/products", icon: "bi-box-seam-fill", label: "Products" },
    { href: "/admin/categories", icon: "bi-tags-fill", label: "Categories" },
    { href: "/admin/orders", icon: "bi-bag-check-fill", label: "Orders" },
    { href: "/admin/coupons", icon: "bi-ticket-perforated-fill", label: "Coupons" },
    { href: "/admin/customers", icon: "bi-people-fill", label: "Customers" },
    { href: "/admin/analytics", icon: "bi-graph-up-arrow", label: "Analytics" },
  ];

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  };

  return (
    <div className="admin-layout-wrapper">
      {/* Premium Sidebar */}
      <aside className="premium-sidebar">
        {/* Brand */}
        <div className="premium-brand">
          <div className="brand-logo">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <span className="brand-text">Admin</span>
        </div>

        {/* User Profile */}
        <div className="premium-user-card">
          <div className="user-avatar">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || "Admin"}</span>
            <span className="user-role">Administrator</span>
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
