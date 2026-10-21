import React from 'react';

export default function ErrorPage({ isOffline = false, onRetry }) {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Chrome Dino Icon SVG */}
        <div style={styles.dinoIcon}>
          <svg width="48" height="48" viewBox="0 0 40 44" fill="#ffffff">
            <path d="M36 0h-12v4h-4v4h-4v4h-4v4h-4v4h-4v12h4v-4h4v-4h4v12h4v-4h4v4h4v-4h4v8h4v-4h4v-8h-4v-4h4v-4h-4v-4h4V0z"/>
          </svg>
        </div>

        {/* Heading */}
        <h1 style={styles.heading}>
          {isOffline ? 'No internet' : 'Press space to play'}
        </h1>

        {/* Instructions */}
        <p style={styles.tryText}>Try:</p>
        <ul style={styles.list}>
          <li>Checking the network cables, modem, and router</li>
          <li>Reconnecting to Wi-Fi</li>
          <li>Running Windows Network Diagnostics</li>
        </ul>

        {/* Error Code Message */}
        <p style={styles.errorCode}>
          {isOffline ? 'ERR_INTERNET_DISCONNECTED' : 'ERR_SOMETHING_WENT_WRONG'}
        </p>

        {/* Reload Button */}
        <button style={styles.button} onClick={onRetry || (() => window.location.reload())}>
          Reload Page
        </button>
      </div>
    </div>
  );
}

// Styling (Dark Theme as shown in image)
const styles = {
  container: {
    backgroundColor: '#202124',
    color: '#e8eaed',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    padding: '20px',
    boxSizing: 'border-box'
  },
  content: {
    maxWidth: '520px',
    width: '100%'
  },
  dinoIcon: {
    marginBottom: '20px'
  },
  heading: {
    fontSize: '22px',
    fontWeight: '500',
    marginBottom: '16px',
    color: '#e8eaed'
  },
  tryText: {
    fontSize: '14px',
    color: '#9aa0a6',
    marginBottom: '8px'
  },
  list: {
    fontSize: '14px',
    color: '#9aa0a6',
    paddingLeft: '20px',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  errorCode: {
    fontSize: '12px',
    color: '#9aa0a6',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  button: {
    marginTop: '20px',
    padding: '8px 16px',
    backgroundColor: '#8ab4f8',
    color: '#202124',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};