import { createContext, useContext, useState, useCallback, useRef } from 'react';

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
  const restoreTimeoutRef = useRef(null);

  // Save scroll position for a specific page/section
  const saveScrollPosition = useCallback((key, position) => {
    console.log(`Saving scroll position for ${key}:`, position);
    setScrollPositions(prev => ({
      ...prev,
      [key]: position
    }));
  }, []);

  // Get saved scroll position for a specific page/section
  const getScrollPosition = useCallback((key) => {
    return scrollPositions[key] || 0;
  }, [scrollPositions]);

  // Clear scroll position for a specific page/section
  const clearScrollPosition = useCallback((key) => {
    console.log(`Clearing scroll position for ${key}`);
    setScrollPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[key];
      return newPositions;
    });
  }, []);

  // Clear all scroll positions
  const clearAllScrollPositions = useCallback(() => {
    console.log('Clearing all scroll positions');
    setScrollPositions({});
  }, []);

  // Enhanced scroll restoration function for mobile compatibility
  const restoreScrollPosition = useCallback((key, fallbackPosition = null) => {
    const savedPosition = scrollPositions[key] || fallbackPosition;
    
    if (savedPosition && savedPosition > 0) {
      // Clear any existing timeout
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
      }
      
      console.log(`Restoring scroll position for ${key} to:`, savedPosition);
      
      // Add CSS class to disable smooth scrolling during restoration
      document.documentElement.classList.add('scroll-restoring');
      
      // Multiple restoration attempts for mobile compatibility
      const attemptRestore = (attempt = 1, maxAttempts = 5) => {
        restoreTimeoutRef.current = setTimeout(() => {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          
          // If we're already at the right position, stop trying
          if (Math.abs(currentScroll - savedPosition) < 10) {
            console.log(`Scroll restoration successful on attempt ${attempt}`);
            document.documentElement.classList.remove('scroll-restoring');
            return;
          }
          
          // Try scrolling to the position
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto'
          });
          
          // For mobile, also try using requestAnimationFrame
          if (attempt === 1) {
            requestAnimationFrame(() => {
              window.scrollTo(0, savedPosition);
            });
          }
          
          // If we haven't reached max attempts and position is still wrong, try again
          if (attempt < maxAttempts) {
            const newCurrentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (Math.abs(newCurrentScroll - savedPosition) > 10) {
              console.log(`Scroll restoration attempt ${attempt} incomplete, trying again...`);
              attemptRestore(attempt + 1, maxAttempts);
            } else {
              console.log(`Scroll restoration successful on attempt ${attempt}`);
              document.documentElement.classList.remove('scroll-restoring');
            }
          } else {
            console.log(`Scroll restoration max attempts reached`);
            document.documentElement.classList.remove('scroll-restoring');
          }
        }, attempt === 1 ? 100 : 50 * attempt);
      };
      
      attemptRestore();
      return true;
    }
    return false;
  }, [scrollPositions]);

  const value = {
    saveScrollPosition,
    getScrollPosition,
    clearScrollPosition,
    clearAllScrollPositions,
    restoreScrollPosition,
    scrollPositions
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
}; 