/**
 * Error Boundary
 * Catches React component errors and displays fallback UI
 * Prevents entire app from crashing on single component failure
 */

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ [ERROR_BOUNDARY] Error caught by boundary:', error?.message || error);
    console.error('   Error type:', error?.constructor?.name);
    console.error('   Component stack:', errorInfo?.componentStack);
    console.error('   Full error:', error);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div
            className="card p-6 max-w-md w-full"
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  We encountered an error. Try reloading the page.
                </p>
              </div>
            </div>

            {this.state.error && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-semibold mb-2">
                  Error details
                </summary>
                <pre
                  className="text-xs p-2 rounded bg-black/30 overflow-auto max-h-32"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="space-y-2">
              <button
                onClick={this.handleReset}
                className="btn btn-primary w-full"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="btn btn-secondary w-full"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
