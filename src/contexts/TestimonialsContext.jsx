import { createContext, useContext, useState, useEffect } from 'react';

const TestimonialsContext = createContext();

export const useTestimonials = () => {
  const context = useContext(TestimonialsContext);
  if (!context) {
    throw new Error('useTestimonials must be used within a TestimonialsProvider');
  }
  return context;
};

const API_BASE_URL = 'http://198.7.116.202:3001/api';

export const TestimonialsProvider = ({ children }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials from backend
  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/testimonials`);
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      const result = await response.json();
      // Extract data from API response format { success: true, data: testimonials }
      const testimonials = result.success ? result.data : [];
      setTestimonials(testimonials);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching testimonials:', err);
      // Fallback to empty array if backend fails
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load testimonials on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const addTestimonial = async (testimonialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testimonialData),
      });

      if (!response.ok) {
        throw new Error('Failed to add testimonial');
      }

      const result = await response.json();
      const newTestimonial = result.success ? result.data : result;
      setTestimonials(prev => [...prev, newTestimonial]);
      return newTestimonial;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  };

  const updateTestimonial = async (id, testimonialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testimonialData),
      });

      if (!response.ok) {
        throw new Error('Failed to update testimonial');
      }

      const result = await response.json();
      const updatedTestimonial = result.success ? result.data : result;
      setTestimonials(prev => prev.map(testimonial => 
        testimonial.id === id ? updatedTestimonial : testimonial
      ));
      return updatedTestimonial;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }

      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  };

  const value = {
    testimonials,
    isLoading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refetch: fetchTestimonials
  };

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
}; 