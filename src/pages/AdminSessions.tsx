// src/pages/AdminSessions.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Session {
  _id: string;
  mentor: User;
  mentee: User;
  date: string;
  time: string;
  topic: string;
  status: string;
}

const AdminSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data); // ✅ corrected line
      } catch (err) {
        setError('Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <p>Loading sessions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Sessions (Admin View)</h2>
      {Array.isArray(sessions) && sessions.length === 0 ? (
        <p>No sessions available.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Time</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Topic</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Mentor</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Mentee</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(sessions) &&
              sessions.map((session) => (
                <tr key={session._id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {new Date(session.date).toLocaleDateString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{session.time}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{session.topic}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {session.mentor?.name} ({session.mentor?.email})
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {session.mentee?.name} ({session.mentee?.email})
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{session.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSessions;
