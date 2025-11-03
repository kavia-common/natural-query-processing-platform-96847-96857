import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Login
 * Form to authenticate users; on success stores JWT and redirects.
 */
function Login({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Adjust the path to match backend route: commonly /login
    const res = await apiRequest('/login', {
      method: 'POST',
      body: { email: form.email, password: form.password },
    });

    setLoading(false);

    if (!res.ok) {
      setError(res.error || 'Login failed');
      return;
    }

    // Expecting { token: '...' } from backend
    const token = res.data?.token || res.data?.access_token || '';
    if (!token) {
      setError('Invalid response from server');
      return;
    }

    onAuthSuccess(token);
    navigate('/prompt', { replace: true });
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h1 className="title">Welcome back</h1>
        <p className="subtitle">Log in to continue to the DSP prompt interface.</p>

        <form className="form" onSubmit={onSubmit}>
          <div className="input-group">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" placeholder="you@example.com" required value={form.email} onChange={onChange} />
          </div>

          <div className="input-group">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" placeholder="••••••••" required value={form.password} onChange={onChange} />
          </div>

          {error && <div className="error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <div className="small center">
            Don't have an account? <Link to="/signup">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
