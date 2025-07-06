import React, { useState } from 'react';
import axios from 'axios';

interface FeedbackFormProps {
  sessionId: string;
  token: string;  // user auth token
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ sessionId, token }) => {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/feedback`,
        { sessionId, rating, comments },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Feedback submitted successfully!');
    } catch (error) {
      setMessage('Error submitting feedback.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit Feedback</h3>
      <label>
        Rating (1-5):
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
      </label>
      <br />
      <label>
        Comments:
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Your comments (optional)"
        />
      </label>
      <br />
      <button type="submit">Send Feedback</button>
      <p>{message}</p>
    </form>
  );
};

export default FeedbackForm;
