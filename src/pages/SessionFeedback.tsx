// src/pages/SessionFeedback.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { jwtDecode } from 'jwt-decode';

interface Feedback {
  _id: string;
  rating: number;
  comments: string;
  menteeId: {
    name: string;
  };
}

interface DecodedToken {
  id: string;
  role: string;
  email: string;
  exp: number;
  iat: number;
}

const SessionFeedback: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');

        // ✅ Decode role from token
        if (token) {
          const decoded = jwtDecode<DecodedToken>(token);
          setUserRole(decoded.role);
        }

        const res = await axios.get(`${API_BASE_URL}/api/feedback/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    if (!comments.trim()) {
      setError('Comments cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/feedback`, {
        sessionId,
        rating,
        comments,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Something went wrong while submitting feedback.');
    }
  };

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Session Feedback</h2>

      {/* ✅ Show form if mentee and not submitted */}
      {userRole === 'mentee' && !submitted && feedbacks.length === 0 && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-2">
            <label className="block mb-1 font-medium">Rating (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Comments:</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {error && <p className="text-red-600 mb-2">{error}</p>}

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit Feedback
          </button>
        </form>
      )}

      {/* ✅ Message after submission */}
      {submitted && <p className="text-green-600">Feedback submitted successfully!</p>}

      {/* ✅ No feedback message for mentor/admin */}
      {feedbacks.length === 0 && userRole !== 'mentee' && (
        <p>No feedback available for this session.</p>
      )}

      {/* ✅ Show feedbacks if available */}
      {feedbacks.length > 0 && (
        feedbacks.map((fb) => (
          <div key={fb._id} className="border p-3 mb-3 rounded-lg shadow-sm">
            <p><strong>Mentee:</strong> {fb.menteeId?.name || 'Anonymous'}</p>
            <p><strong>Rating:</strong> {fb.rating}/5</p>
            <p><strong>Comments:</strong> {fb.comments}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SessionFeedback;
