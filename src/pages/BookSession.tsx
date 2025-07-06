// src/pages/BookSession.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface Mentor {
  _id: string;
  name: string;
  email: string;
}

const BookSession = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/mentors`);
        setMentors(res.data.mentors);
      } catch (error) {
        console.error('❌ Failed to load mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  const isPastDate = (selectedDate: string, selectedTime: string) => {
    const now = new Date();
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    return dateTime < now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('');

    // ✅ Validation
    if (!selectedMentor || !date || !time || !topic.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isPastDate(date, time)) {
      setError('Date and time must be in the future.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `${API_BASE_URL}/api/sessions`,
        {
          mentorId: selectedMentor,
          date,
          time,
          topic,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus('✅ Session booked successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('❌ Booking error:', error);
      setError('❌ Booking failed. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2>Book a Mentorship Session</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {status && <p style={{ color: 'green' }}>{status}</p>}

      {/* Mentor Dropdown */}
      <label>Choose a Mentor:</label><br />
      <select
        value={selectedMentor}
        onChange={(e) => setSelectedMentor(e.target.value)}
        required
      >
        <option value="">-- Select Mentor --</option>
        {mentors.map((mentor) => (
          <option key={mentor._id} value={mentor._id}>
            {mentor.name} ({mentor.email})
          </option>
        ))}
      </select>
      <br /><br />

      {/* Date Field */}
      <label>Date:</label><br />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <br /><br />

      {/* Time Field */}
      <label>Time:</label><br />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <br /><br />

      {/* Topic */}
      <label>Topic:</label><br />
      <input
        type="text"
        placeholder="What do you want to learn?"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        required
      />
      <br /><br />

      {/* Notes (optional) */}
      <label>Notes (optional):</label><br />
      <textarea
        placeholder="Any extra notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <br /><br />

      <button type="submit">Book Session</button>
    </form>
  );
};

export default BookSession;
