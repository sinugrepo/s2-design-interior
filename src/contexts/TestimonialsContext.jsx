import { createContext, useContext, useState, useEffect } from 'react';

const TestimonialsContext = createContext();

export const useTestimonials = () => {
  const context = useContext(TestimonialsContext);
  if (!context) {
    throw new Error('useTestimonials must be used within a TestimonialsProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:3001/api';

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
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(testimonialData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to add testimonial' };
      }

      const newTestimonial = result.success ? result.data : result;
      setTestimonials(prev => [...prev, newTestimonial]);
      return { success: true, data: newTestimonial };
    } catch (error) {
      console.error('Error adding testimonial:', error);
      return { success: false, error: error.message || 'Failed to add testimonial' };
    }
  };

  const updateTestimonial = async (id, testimonialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(testimonialData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to update testimonial' };
      }

      const updatedTestimonial = result.success ? result.data : result;
      setTestimonials(prev => prev.map(testimonial => 
        testimonial.id === id ? updatedTestimonial : testimonial
      ));
      return { success: true, data: updatedTestimonial };
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return { success: false, error: error.message || 'Failed to update testimonial' };
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        const result = await response.json();
        return { success: false, error: result.error || 'Failed to delete testimonial' };
      }

      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return { success: false, error: error.message || 'Failed to delete testimonial' };
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