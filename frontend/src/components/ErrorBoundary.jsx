import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--night)', padding: '20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            color: 'var(--white)', fontSize: '1.6rem',
            fontWeight: 900, marginBottom: 10, letterSpacing: '-0.02em',
          }}>
            Something went wrong
          </h2>
          <p style={{
            color: 'var(--muted)', fontSize: '0.9rem',
            marginBottom: 28, maxWidth: 360, lineHeight: 1.6,
            fontFamily: 'Inter, sans-serif',
          }}>
            An unexpected error occurred. Please refresh the page and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, var(--indigo), var(--indigo2))',
              color: 'white', border: 'none', borderRadius: '12px',
              fontFamily: 'Inter, sans-serif', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer',
              boxShadow: '0 4px 14px var(--glow-indigo)',
            }}
          >
            🔄 Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
