/**
 * Debugging component to check authentication status
 * Add this to your app temporarily to diagnose auth issues
 * 
 * Usage:
 * import { AuthDebugPanel } from './components/AuthDebugPanel';
 * 
 * // Add to your app (remove in production)
 * <AuthDebugPanel />
 */

import { useState, useEffect } from 'react';
import { isAuthenticated, getTokenInfo, formatTokenForLog } from '../utils/authUtils';

export function AuthDebugPanel() {
  const [authStatus, setAuthStatus] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    
    // Refresh every 5 seconds
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('jwt_token');
    const user = localStorage.getItem('user');
    const tokenInfo = getTokenInfo();
    
    setAuthStatus({
      hasToken: !!token,
      tokenPreview: formatTokenForLog(token),
      isAuthenticated: isAuthenticated(),
      user: user ? JSON.parse(user) : null,
      tokenInfo: tokenInfo,
      expiresAt: tokenInfo?.exp ? new Date(tokenInfo.exp * 1000).toLocaleString() : 'N/A',
      timeLeft: tokenInfo?.exp ? Math.floor((tokenInfo.exp - Date.now() / 1000) / 60) : 0,
    });
  };

  if (!authStatus) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'white',
        border: '2px solid #3B82F6',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 9999,
        maxWidth: '400px',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '14px', color: '#3B82F6' }}>
        🔐 Auth Debug Panel
      </div>
      
      <div style={{ display: 'grid', gap: '8px' }}>
        <div>
          <strong>Status:</strong>{' '}
          <span style={{ 
            color: authStatus.isAuthenticated ? '#10B981' : '#EF4444',
            fontWeight: 'bold' 
          }}>
            {authStatus.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
          </span>
        </div>
        
        <div>
          <strong>Has Token:</strong> {authStatus.hasToken ? '✅ Yes' : '❌ No'}
        </div>
        
        {authStatus.hasToken && (
          <>
            <div>
              <strong>Token:</strong> {authStatus.tokenPreview}
            </div>
            
            <div>
              <strong>Expires:</strong> {authStatus.expiresAt}
            </div>
            
            <div>
              <strong>Time Left:</strong>{' '}
              <span style={{ 
                color: authStatus.timeLeft < 5 ? '#EF4444' : '#10B981' 
              }}>
                {authStatus.timeLeft} minutes
              </span>
            </div>
            
            {authStatus.tokenInfo?.roles && (
              <div>
                <strong>Roles:</strong> {authStatus.tokenInfo.roles.join(', ')}
              </div>
            )}
          </>
        )}
        
        {authStatus.user && (
          <div>
            <strong>User:</strong> {authStatus.user.email || authStatus.user.username || 'Unknown'}
          </div>
        )}
        
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #E5E7EB' }}>
          <button
            onClick={checkAuth}
            style={{
              padding: '4px 8px',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            🔄 Refresh
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('jwt_token');
              localStorage.removeItem('user');
              checkAuth();
            }}
            style={{
              padding: '4px 8px',
              background: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              marginLeft: '8px',
            }}
          >
            🗑️ Clear Auth
          </button>
        </div>
      </div>
    </div>
  );
}
