import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectsContext';
import { useScroll } from '../contexts/ScrollContext';
import { useResponsive } from '../hooks/useResponsive';

// Helper function to format category display
const formatCategoryName = (category) => {
  if (!category) return '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Portfolio() {
  const { projects, categories } = useProjects();
  const scrollContext = useScroll();
  const { isMobile } = useResponsive();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const ref = useRef(null);
  const portfolioSectionRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Restore scroll position on component mount - simplified
  useEffect(() => {
    // Only restore scroll position if we explicitly have location state indicating we came from project detail
    const isFromProjectDetail = location.state?.scrollToPortfolio === true;
    
    if (isFromProjectDetail && location.state?.scrollPosition) {
      const savedScrollPosition = location.state.scrollPosition;
      console.log('Attempting to restore scroll position from location state:', savedScrollPosition);
      
      // Simple timeout with direct scroll restoration
      const timeout = setTimeout(() => {
        if (savedScrollPosition > 0) {
          // Save to context for future use
          scrollContext.saveScrollPosition('portfolio', savedScrollPosition);
          
          // Direct scroll restoration with multiple attempts for mobile
          let attempts = 0;
          const maxAttempts = 3;
          
          const tryRestore = () => {
            attempts++;
            window.scrollTo({
              top: savedScrollPosition,
              behavior: 'auto'
            });
            
            // Check if we need to try again
            setTimeout(() => {
              const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
              if (Math.abs(currentScroll - savedScrollPosition) > 10 && attempts < maxAttempts) {
                console.log(`Scroll restoration attempt ${attempts} - trying again...`);
                tryRestore();
              } else {
                console.log(`Scroll restoration completed after ${attempts} attempts`);
                // Clear the navigation state
                window.history.replaceState({}, '', location.pathname);
              }
            }, 50);
          };
          
          tryRestore();
        }
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, []); // Empty dependency array to run only once on mount

  // Reset selected category if it no longer exists
  useEffect(() => {
    if (selectedCategory !== 'all' && categories.length > 0 && !categories.includes(selectedCategory)) {
      console.log(`Category "${selectedCategory}" no longer exists, resetting to "all"`);
      setSelectedCategory('all');
      setShowMore(false);
    }
  }, [categories, selectedCategory]);

  // Enhanced navigation handler for better mobile support
  const handleProjectNavigation = useCallback((project, eventType = 'click') => {
    try {
      console.log(`Card ${eventType} for project:`, project.id);
      console.log('Navigate function available:', !!navigate);
      console.log('Project object:', project);
      
      // Save scroll position
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      scrollContext.saveScrollPosition('portfolio', currentScrollPosition);
      console.log('Saved scroll position:', currentScrollPosition);
      
      // Navigate using React Router
      const targetPath = `/project/${project.id}`;
      console.log('About to navigate to:', targetPath);
      
      // Try navigation with error handling
      try {
        navigate(targetPath);
        console.log('Navigate function called successfully');
        
        // Add a small delay and check if navigation happened
        setTimeout(() => {
          const currentPath = window.location.pathname;
          console.log('Current path after navigation attempt:', currentPath);
          if (currentPath !== targetPath) {
            console.warn('Navigation may have failed, current path:', currentPath);
            // Fallback: try window.location
            console.log('Trying fallback navigation...');
            window.location.href = targetPath;
          }
        }, 100);
        
      } catch (navError) {
        console.error('Navigation function error:', navError);
        // Fallback to window.location
        window.location.href = targetPath;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate, scrollContext]);

  // Separate handlers for different event types
  const handleClick = useCallback((project) => {
    handleProjectNavigation(project, 'click');
  }, [handleProjectNavigation]);

  const handleTouch = useCallback((project, e) => {
    e.preventDefault();
    e.stopPropagation();
    handleProjectNavigation(project, 'touch');
  }, [handleProjectNavigation]);

  const handleKeyDown = useCallback((project, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleProjectNavigation(project, 'keyboard');
    }
  }, [handleProjectNavigation]);

  // Handle category filter change
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setShowMore(false); // Reset show more when changing category
  }, []);

  // Filter projects by selected category
  const getFilteredProjects = useCallback(() => {
    if (selectedCategory === 'all') {
      return projects || [];
    }
    return (projects || []).filter(project => 
      project.category && project.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [projects, selectedCategory]);

  const filteredProjects = getFilteredProjects();
  
  // Responsive limit: 8 for mobile, 12 for desktop
  const itemLimit = isMobile ? 8 : 12;
  const displayedProjects = !showMore ? filteredProjects.slice(0, itemLimit) : filteredProjects;
  const hasMoreItems = filteredProjects.length > itemLimit;

  // Don't render anything if essential data is not available
  if (!projects || !navigate) {
    return (
      <section id="portfolio" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24 bg-white" ref={portfolioSectionRef}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-brand-brown-600">Our Projects</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              200+ Projects. But Our Goal Is Always the Same: Making You Feel at Home.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Every project we take on tells a different story — from cozy residential homes to dynamic office spaces, from elegant apartments to vibrant public spaces. We design environments that work for your daily life, not just look good in photos. Browse our portfolio and discover how we've helped others transform their spaces — maybe yours is next.
            </p>
          </motion.div>
        </div>

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-brand-brown-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-brand-brown-50 hover:border-brand-brown-300'
              }`}
            >
              All Projects
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-brand-brown-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-brand-brown-50 hover:border-brand-brown-300'
                }`}
              >
                {formatCategoryName(category)}
              </button>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cursor-pointer group"
                onClick={() => handleClick(project)}
                onTouchEnd={(e) => handleTouch(project, e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(project, e)}
                aria-label={`View details for ${project.title}`}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mb-4">
                  <div className="relative w-full h-64 sm:h-72 lg:h-80">
                    <img
                      src={project.thumbnail_image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Information Below Image */}
                <div className="px-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-brown-600 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-brown-100 text-brand-brown-800">
                      {formatCategoryName(project.category)}
                    </span>
                    <div className="text-brand-brown-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Show More Button */}
          {hasMoreItems && !showMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mt-12"
            >
              <button
                onClick={() => setShowMore(true)}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-brand-brown-600 hover:bg-brand-brown-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Show More Projects
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <p className="text-gray-500 mt-3 text-sm">
                Showing {displayedProjects.length} of {filteredProjects.length} projects
                {selectedCategory !== 'all' && ` in ${formatCategoryName(selectedCategory)}`}
                {isMobile && (
                  <span className="block text-xs text-gray-400 mt-1">
                    Mobile view: {itemLimit} projects per page
                  </span>
                )}
              </p>
            </motion.div>
          )}
          
          {/* Empty state when no projects match filter */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500">
                {selectedCategory === 'all' 
                  ? "We're working on adding more amazing projects. Check back soon!" 
                  : `No projects found in ${formatCategoryName(selectedCategory)} category. Try selecting a different category.`
                }
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}