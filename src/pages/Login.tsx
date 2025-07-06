// Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Login = () => {
  const location = useLocation();
  const logoutMessage = location.state && typeof location.state === 'object' ? location.state.message : '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Simple frontend validation function
  const validateInputs = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return false;
    }

    // ✅ Password length check (minimum 6 characters)
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) return;

    setLoading(true);

    try {
      console.log("Trying to login with:", email, password);

      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log("Login success:", response.data);

      localStorage.setItem('token', response.data.token);

      alert('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      {logoutMessage && (
        <p style={{ color: 'green' }}>{logoutMessage}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Login;
