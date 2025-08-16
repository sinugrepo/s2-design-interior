import { createContext, useContext, useState, useEffect } from 'react';

const ScrollContext = createContext();

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};

export const ScrollProvider = ({ children }) => {
  const [scrollPositions, setScrollPositions] = useState({});

  // Save scroll position for a specific page/section
  const saveScrollPosition = (key, position) => {
    setScrollPositions(prev => ({
      ...prev,
      [key]: position
    }));
  };

  // Get saved scroll position for a specific page/section
  const getScrollPosition = (key) => {
    return scrollPositions[key] || 0;
  };

  // Clear scroll position for a specific page/section
  const clearScrollPosition = (key) => {
    setScrollPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[key];
      return newPositions;
    });
  };

  // Clear all scroll positions
  const clearAllScrollPositions = () => {
    setScrollPositions({});
  };

  const value = {
    saveScrollPosition,
    getScrollPosition,
    clearScrollPosition,
    clearAllScrollPositions,
    scrollPositions
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
}; 