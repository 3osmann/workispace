
import { useState, useEffect } from 'react';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
}

const useEvent = (eventId?: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    }
  }, [eventId]);

  const fetchEvent = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call for now - would be replaced with actual API endpoint
      // const response = await fetch(`/api/events/${id}`);
      
      // Mock data
      const mockEvent: Event = {
        id,
        name: 'Event name',
        description: 'Event description',
        date: new Date().toISOString(),
        location: 'Event location'
      };
      
      // Simulate API delay
      setTimeout(() => {
        setEvent(mockEvent);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event');
      setLoading(false);
    }
  };

  return { event, loading, error, fetchEvent };
};

export default useEvent;
