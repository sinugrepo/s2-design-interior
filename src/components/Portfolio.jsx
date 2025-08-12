import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useCategories } from '../contexts/CategoryContext';

export default function Portfolio() {
  const { portfolioItems, getPortfolioItemsByCategory } = usePortfolio();
  const { categories } = useCategories();
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showMore, setShowMore] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Filter portfolio data based on active category
  const allFilteredPortfolio = getPortfolioItemsByCategory(activeCategory);
  
  // Limit items for "all" category with show more functionality
  const filteredPortfolio = activeCategory === 'all' && !showMore 
    ? allFilteredPortfolio.slice(0, 12)
    : allFilteredPortfolio;

  const hasMoreItems = activeCategory === 'all' && allFilteredPortfolio.length > 12;

  const openLightbox = (index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setCurrentImage((currentImage + filteredPortfolio.length - 1) % filteredPortfolio.length);
  };

  const goToNext = () => {
    setCurrentImage((currentImage + 1) % filteredPortfolio.length);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  // Reset show more when category changes
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setShowMore(false);
  };

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-brand-brown-600">Portfolio</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              200+ Projects. But Our Goal Is Always the Same: Making You Feel at Home.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Every project we take on tells a different story   from cozy living rooms to spacious kitchens, from playful kids' rooms to welcoming cafés. We design spaces that work for your daily life, not just look good in photos. Browse our portfolio and discover how we've helped others transform their space   maybe yours is next.
            </p>
          </motion.div>
        </div>
        
        {/* Category Filter Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`
                  px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105
                  ${activeCategory === category.id
                    ? 'bg-brand-brown-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          {/* Improved Gallery Grid with consistent sizing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredPortfolio.map((photo, index) => {
              // Simplified aspect ratio logic
              const aspectRatio = photo.width / photo.height;
              const isPortrait = aspectRatio < 1.0;
              
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  {/* Fixed height container for consistent layout */}
                  <div className="relative w-full h-64 sm:h-72 lg:h-80">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 text-center transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-3 mx-auto w-fit">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium px-4">{photo.alt}</p>
                        <p className="text-xs text-gray-300 mt-1 capitalize">
                          {categories.find(cat => cat.id === photo.category)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                Showing {filteredPortfolio.length} of {allFilteredPortfolio.length} projects
              </p>
            </motion.div>
          )}
          
          {/* Empty state when no items match filter */}
          {filteredPortfolio.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500">No projects match the selected category. Try selecting a different category.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Custom Lightbox */}
        {viewerIsOpen && filteredPortfolio.length > 0 && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            style={{ outline: 'none' }}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>

            {/* Previous button */}
            {filteredPortfolio.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeftIcon className="w-8 h-8" />
              </button>
            )}

            {/* Next button */}
            {filteredPortfolio.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRightIcon className="w-8 h-8" />
              </button>
            )}

            {/* Image container */}
            <div 
              className="relative max-w-7xl max-h-full mx-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={currentImage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={filteredPortfolio[currentImage].src}
                alt={filteredPortfolio[currentImage].alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
              
              {/* Image info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-1">{filteredPortfolio[currentImage].alt}</h3>
                <p className="text-sm text-gray-300 capitalize">
                  {categories.find(cat => cat.id === filteredPortfolio[currentImage].category)?.name}
                </p>
                {filteredPortfolio.length > 1 && (
                  <p className="text-xs text-gray-400 mt-2">
                    {currentImage + 1} of {filteredPortfolio.length}
                  </p>
                )}
              </div>
            </div>

            {/* Image counter dots */}
            {filteredPortfolio.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {filteredPortfolio.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImage ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
} 