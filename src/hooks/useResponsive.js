import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setIsMobile(true);
        setIsTablet(false);
        setScreenSize('mobile');
      } else if (width < 1024) {
        setIsMobile(false);
        setIsTablet(true);
        setScreenSize('tablet');
      } else {
        setIsMobile(false);
        setIsTablet(false);
        setScreenSize('desktop');
      }
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    isMobile,
    isTablet,
    screenSize,
    isDesktop: screenSize === 'desktop'
  };
}; 