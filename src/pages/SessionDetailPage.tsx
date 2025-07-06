import React from 'react';
import { useParams } from 'react-router-dom';
import FeedbackForm from '../components/FeedbackForm';

const SessionDetailPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const token = localStorage.getItem('token') || '';

  if (!sessionId) {
    return <p>Session ID is missing!</p>;
  }

  return (
    <div>
      <h2>Session Details for {sessionId}</h2>
      <FeedbackForm sessionId={sessionId} token={token} />
    </div>
  );
};

export default SessionDetailPage;
