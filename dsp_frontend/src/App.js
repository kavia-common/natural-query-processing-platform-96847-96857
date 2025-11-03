import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Prompt from './pages/Prompt';
import { useAuthProvider } from './hooks/useAuth';

// PUBLIC_INTERFACE
function App() {
  /** Entry point: wraps routes with auth provider and renders header + pages */
  return (
    <AuthApp />
  );
}

function AuthApp() {
  const auth = useAuthProvider();

  return (
    <BrowserRouter>
      <div className="header">
        <div className="container">
          <Header isAuthenticated={auth.isAuthenticated} onLogout={auth.logout} />
        </div>
      </div>
      <main>
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/prompt" replace />} />
            <Route path="/login" element={
              auth.isAuthenticated ? <Navigate to="/prompt" replace /> : <Login onAuthSuccess={auth.setToken} />
            } />
            <Route path="/signup" element={
              auth.isAuthenticated ? <Navigate to="/prompt" replace /> : <Signup onAuthSuccess={auth.setToken} />
            } />
            <Route path="/prompt" element={
              <RequireAuth isAuthenticated={auth.isAuthenticated}>
                <Prompt />
              </RequireAuth>
            } />
            <Route path="*" element={<Navigate to="/prompt" replace />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

function RequireAuth({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;
