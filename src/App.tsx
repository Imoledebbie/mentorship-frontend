// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookSession from './pages/BookSession'; 
import SessionsList from './pages/SessionsList';
import SessionFeedback from './pages/SessionFeedback';

const App = () => {
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
          <Route path="/feedback/:sessionId" element={<SessionFeedback />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
