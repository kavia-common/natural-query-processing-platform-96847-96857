import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Signup
 * Form to register new users; on success stores JWT and redirects.
 */
function Signup({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
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

    // Adjust the path to match backend route: commonly /signup
    const res = await apiRequest('/signup', {
      method: 'POST',
      body: { email: form.email, password: form.password, name: form.name },
    });

    setLoading(false);

    if (!res.ok) {
      setError(res.error || 'Signup failed');
      return;
    }

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
        <h1 className="title">Create your account</h1>
        <p className="subtitle">Sign up and start querying the DSP service.</p>

        <form className="form" onSubmit={onSubmit}>
          <div className="input-group">
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" type="text" className="input" placeholder="Jane Doe" required value={form.name} onChange={onChange} />
          </div>

          <div className="input-group">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" placeholder="you@example.com" required value={form.email} onChange={onChange} />
          </div>

          <div className="input-group">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" placeholder="Create a strong password" required value={form.password} onChange={onChange} />
          </div>

          {error && <div className="error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="small center">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
