// src/pages/SessionsList.tsx
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

const SessionsList = () => {
  console.log('📢 SessionsList component mounted');

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');

        // Decode JWT to extract user role
        const userData = JSON.parse(atob(token!.split('.')[1]));
        setUserRole(userData.role);

        const res = await axios.get(`${API_BASE_URL}/api/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('✅ Sessions loaded:', res.data);
        setSessions(res.data.sessions);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to load sessions:', err);
        setError('Failed to load sessions');
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleUpdateStatus = async (sessionId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/sessions/${sessionId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedSessions = sessions.map((session) =>
        session._id === sessionId ? { ...session, status } : session
      );
      setSessions(updatedSessions);
    } catch (error) {
      console.error(`❌ Failed to update session ${sessionId}:`, error);
      alert('Failed to update session status.');
    }
  };

  if (loading) return <p>Loading sessions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li
              key={session._id}
              style={{
                marginBottom: '20px',
                paddingBottom: '10px',
                borderBottom: '1px solid #ccc',
              }}
            >
              <strong>Topic:</strong> {session.topic} <br />
              <strong>Date:</strong> {new Date(session.date).toLocaleDateString()} <br />
              <strong>Time:</strong> {session.time} <br />

              {/* ✅ Updated Status Display */}
              <strong>Status:</strong>{' '}
              <span
                style={{
                  color:
                    session.status === 'approved'
                      ? 'green'
                      : session.status === 'rejected'
                      ? 'red'
                      : 'orange',
                  fontWeight: 'bold',
                }}
              >
                {session.status === 'approved'
                  ? '🟢 Approved'
                  : session.status === 'rejected'
                  ? '🔴 Rejected'
                  : '🟡 Pending'}
              </span>
              <br />

              <strong>Mentor:</strong> {session.mentor.name} ({session.mentor.email}) <br />
              <strong>Mentee:</strong> {session.mentee.name} ({session.mentee.email}) <br />

              {userRole === 'mentor' && session.status === 'pending' && (
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handleUpdateStatus(session._id, 'approved')} style={{ marginRight: '10px' }}>
                    ✅ Approve
                  </button>
                  <button onClick={() => handleUpdateStatus(session._id, 'rejected')}>
                    ❌ Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionsList;
