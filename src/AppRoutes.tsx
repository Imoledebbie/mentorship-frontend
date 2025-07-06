// src/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookSession from './pages/BookSession'; 
import SessionsList from './pages/SessionsList';
import AdminSessions from './pages/AdminSessions'; 
import SessionFeedback from './pages/SessionFeedback'; // ✅ Import the new page
import SessionDetailPage from './pages/SessionDetailPage';
<Route path="/feedback/:sessionId" element={<SessionFeedback />} />

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-session" element={<BookSession />} />
          <Route path="/sessions" element={<SessionsList />} />
          <Route path="/admin-sessions" element={<AdminSessions />} />
          <Route path="/session/:sessionId/feedback" element={<SessionFeedback />} /> {/* ✅ NEW */}
          <Route path="/session/:sessionId" element={<SessionDetailPage />} />
          <Route path="/feedback/:sessionId" element={<SessionFeedback />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
