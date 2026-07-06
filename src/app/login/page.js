"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Panel - Brand */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <i className="bi bi-amazon"></i>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to access your account, track orders, and manage your preferences.</p>
            <div className="auth-features">
              <div className="auth-feature">
                <i className="bi bi-box-seam"></i>
                <span>Track your orders in real-time</span>
              </div>
              <div className="auth-feature">
                <i className="bi bi-heart"></i>
                <span>Save items to your wishlist</span>
              </div>
              <div className="auth-feature">
                <i className="bi bi-lightning-charge"></i>
                <span>Faster checkout experience</span>
              </div>
            </div>
          </div>
          <div className="auth-brand-decoration">
            <div className="auth-circle auth-circle-1"></div>
            <div className="auth-circle auth-circle-2"></div>
            <div className="auth-circle auth-circle-3"></div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
                <button onClick={() => setError("")}><i className="bi bi-x"></i></button>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="auth-form-group">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-envelope"></i>
                  <input
                    type="email"
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button type="button" className="auth-input-icon" onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className="auth-form-options">
                <label className="auth-checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="auth-forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="auth-spinner"></span> Signing in...</>
                ) : (
                  <>Sign In <i className="bi bi-arrow-right"></i></>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-social-btns">
              <button className="auth-social-btn google">
                <i className="bi bi-google"></i>
                <span>Google</span>
              </button>
              <button className="auth-social-btn apple">
                <i className="bi bi-apple"></i>
                <span>Apple</span>
              </button>
            </div>

            <p className="auth-signup-link">
              Don't have an account? <Link href="/register">Create account</Link>
            </p>

            <p className="auth-terms">
              By continuing, you agree to our <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
