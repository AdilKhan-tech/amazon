"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
          <h4>Something went wrong</h4>
          <p className="text-muted">Please refresh the page or try again later.</p>
          <button 
            className="btn btn-warning" 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
