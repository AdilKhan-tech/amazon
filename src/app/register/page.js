"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/account");
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, text: "", color: "" };
    if (password.length < 6) return { level: 1, text: "Weak", color: "#ef4444" };
    if (password.length < 10) return { level: 2, text: "Medium", color: "#f59e0b" };
    return { level: 3, text: "Strong", color: "#10b981" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Panel - Brand */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <i className="bi bi-amazon"></i>
            </div>
            <h1>Join Us Today</h1>
            <p>Create your account and start your shopping journey with exclusive benefits and amazing deals.</p>
            <div className="auth-features">
              <div className="auth-feature">
                <i className="bi bi-person-plus"></i>
                <span>Free account creation</span>
              </div>
              <div className="auth-feature">
                <i className="bi bi-truck"></i>
                <span>Free shipping on first order</span>
              </div>
              <div className="auth-feature">
                <i className="bi bi-gift"></i>
                <span>Exclusive member deals</span>
              </div>
              <div className="auth-feature">
                <i className="bi bi-shield-check"></i>
                <span>Secure shopping experience</span>
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
              <h2>Create Account</h2>
              <p>Fill in the details below to get started</p>
            </div>

            {error && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
                <button onClick={() => setError("")}><i className="bi bi-x"></i></button>
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="auth-form-group">
                <label>Full Name</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    className="auth-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

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
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                  <button type="button" className="auth-input-icon" onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
                {password && (
                  <div className="auth-password-strength">
                    <div className="strength-bars">
                      <div className={`strength-bar ${passwordStrength.level >= 1 ? 'active' : ''}`} style={{ backgroundColor: passwordStrength.level >= 1 ? passwordStrength.color : '#e2e8f0' }}></div>
                      <div className={`strength-bar ${passwordStrength.level >= 2 ? 'active' : ''}`} style={{ backgroundColor: passwordStrength.level >= 2 ? passwordStrength.color : '#e2e8f0' }}></div>
                      <div className={`strength-bar ${passwordStrength.level >= 3 ? 'active' : ''}`} style={{ backgroundColor: passwordStrength.level >= 3 ? passwordStrength.color : '#e2e8f0' }}></div>
                    </div>
                    <span style={{ color: passwordStrength.color }}>{passwordStrength.text}</span>
                  </div>
                )}
              </div>

              <div className="auth-form-group">
                <label>Confirm Password</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-lock-fill"></i>
                  <input
                    type="password"
                    className="auth-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                  />
                  {confirmPassword && (
                    <span className="auth-match-icon">
                      <i className={`bi ${password === confirmPassword ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                    </span>
                  )}
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="auth-spinner"></span> Creating account...</>
                ) : (
                  <>Create Account <i className="bi bi-arrow-right"></i></>
                )}
              </button>
            </form>

            <p className="auth-signin-link">
              Already have an account? <Link href="/login">Sign in</Link>
            </p>

            <p className="auth-terms">
              By creating an account, you agree to our <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
