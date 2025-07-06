// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: 10 }}>Home</Link>
      <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
      <Link to="/dashboard" style={{ marginRight: 10 }}>Dashboard</Link>
      <Link to="/book-session">Book Session</Link> {/* ✅ New link */}
      <Link to="/sessions" style={{ marginRight: 10 }}>My Sessions</Link>
      <Link to="/admin-sessions" style={{ marginRight: 10 }}>Admin Sessions</Link>
    </nav>
  );
};

export default Navbar;
