import { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:3001/api';

export const PortfolioProvider = ({ children }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch portfolio items from API
  const fetchPortfolioItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/portfolio`);
      const data = await response.json();
      
      if (data.success) {
        setPortfolioItems(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch portfolio items');
      }
    } catch (err) {
      console.error('Error fetching portfolio items:', err);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  // Load portfolio items on component mount
  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const addPortfolioItem = async (itemData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the list to get the latest data
        await fetchPortfolioItems();
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to add portfolio item');
      }
    } catch (err) {
      console.error('Error adding portfolio item:', err);
      throw err;
    }
  };

  const updatePortfolioItem = async (itemId, itemData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/portfolio/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the list to get the latest data
        await fetchPortfolioItems();
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to update portfolio item');
      }
    } catch (err) {
      console.error('Error updating portfolio item:', err);
      throw err;
    }
  };

  const deletePortfolioItem = async (itemId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/portfolio/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the list to get the latest data
        await fetchPortfolioItems();
        return true;
      } else {
        throw new Error(data.error || 'Failed to delete portfolio item');
      }
    } catch (err) {
      console.error('Error deleting portfolio item:', err);
      throw err;
    }
  };

  const getPortfolioItemById = (itemId) => {
    return portfolioItems.find(item => item.id === itemId);
  };

  const getPortfolioItemsByCategory = (categoryId) => {
    if (categoryId === 'all') {
      return portfolioItems;
    }
    return portfolioItems.filter(item => item.category === categoryId);
  };

  const value = {
    portfolioItems,
    isLoading,
    error,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    getPortfolioItemById,
    getPortfolioItemsByCategory,
    refreshPortfolioItems: fetchPortfolioItems
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}; 