import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Header
 * Navigation header with brand, auth links, and logout action.
 */
function Header({ isAuthenticated, onLogout }) {
  const { pathname } = useLocation();
  return (
    <nav className="navbar" aria-label={`Navigation ${isAuthenticated ? 'for authenticated user' : 'for guest'}`}>
      <div className="brand">
        <span className="brand-badge">DSP</span>
        Natural Query
      </div>
      <div className="nav-actions">
        {!isAuthenticated ? (
          <>
            {pathname !== '/login' && <Link className="link" to="/login">Log in</Link>}
            <Link className="btn btn-primary" to="/signup">Sign up</Link>
          </>
        ) : (
          <>
            <Link className="link" to="/prompt">Prompt</Link>
            <button className="btn btn-danger" onClick={onLogout} aria-label="Logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
