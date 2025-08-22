import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { HomeIcon, UserGroupIcon, WrenchScrewdriverIcon, BuildingOfficeIcon, XMarkIcon, PlayIcon } from '@heroicons/react/24/outline';

// Import workshop assets
import workshopOffice1 from '../assets/workshop_office_1.jpg';
import workshopOffice2 from '../assets/workshop_office_2.jpg';
import workshopOffice3 from '../assets/workshop_office_3.mp4';
import workshopProd1 from '../assets/workshop_prod_1.jpg';
import workshopProd2 from '../assets/workshop_prod_2.jpg';
import workshopProd3 from '../assets/workshop_prod_3.mp4';

const stats = [
  { id: 1, name: 'Years of Experience', value: '12+', icon: HomeIcon },
  { id: 2, name: 'Projects Completed', value: '200+', icon: BuildingOfficeIcon },
  { id: 3, name: 'In-House Workshops', value: '2', icon: WrenchScrewdriverIcon },
  { id: 4, name: 'Happy Clients', value: '150+', icon: UserGroupIcon },
];

const workshops = [
  {
    id: 1,
    title: "Design Workshop",
    description: "Where creativity meets precision planning and 3D visualization",
    media: [
      {
        type: 'image',
        url: workshopOffice1,
        alt: "Design workshop office space 1"
      },
      {
        type: 'image',
        url: workshopOffice2,
        alt: "Design workshop office space 2"
      },
      {
        type: 'video',
        url: workshopOffice3,
        thumbnail: workshopOffice1, // Use first image as thumbnail
        alt: "Design workshop in action"
      }
    ]
  },
  {
    id: 2,
    title: "Production Workshop",
    description: "Where skilled craftsmen build your custom furniture with care",
    media: [
      {
        type: 'image',
        url: workshopProd1,
        alt: "Production workshop space 1"
      },
      {
        type: 'image',
        url: workshopProd2,
        alt: "Production workshop space 2"
      },
      {
        type: 'video',
        url: workshopProd3,
        thumbnail: workshopProd1, // Use first image as thumbnail
        alt: "Production workshop in action"
      }
    ]
  }
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [previewModal, setPreviewModal] = useState({ open: false, media: null, type: null });
  const [videoLoaded, setVideoLoaded] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});
  
  // Custom slider state for each workshop
  const [currentSlides, setCurrentSlides] = useState({ 1: 0, 2: 0 });
  const [isHovered, setIsHovered] = useState({ 1: false, 2: false });
  const [isDragging, setIsDragging] = useState({ 1: false, 2: false });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [activeWorkshop, setActiveWorkshop] = useState(null);

  // Use refs to access current state in interval
  const isHoveredRef = useRef(isHovered);
  const isDraggingRef = useRef(isDragging);
  
  // Update refs when state changes
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);
  
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Auto-slide functionality - Fixed to prevent getting stuck
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlides(prev => {
        const newSlides = { ...prev };
        const currentHovered = isHoveredRef.current;
        const currentDragging = isDraggingRef.current;
        
        // Workshop 1
        if (!currentHovered[1] && !currentDragging[1]) {
          newSlides[1] = (prev[1] + 1) % workshops[0].media.length;
        }
        
        // Workshop 2
        if (!currentHovered[2] && !currentDragging[2]) {
          newSlides[2] = (prev[2] + 1) % workshops[1].media.length;
        }
        
        return newSlides;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent interval restart

  // Navigation functions
  const nextSlide = (workshopId) => {
    setCurrentSlides(prev => ({
      ...prev,
      [workshopId]: (prev[workshopId] + 1) % workshops[workshopId - 1].media.length
    }));
    // Brief pause after manual navigation
    setIsDragging(prev => ({ ...prev, [workshopId]: true }));
    setTimeout(() => {
      setIsDragging(prev => ({ ...prev, [workshopId]: false }));
    }, 1000);
  };

  const prevSlide = (workshopId) => {
    setCurrentSlides(prev => ({
      ...prev,
      [workshopId]: prev[workshopId] === 0 
        ? workshops[workshopId - 1].media.length - 1 
        : prev[workshopId] - 1
    }));
    // Brief pause after manual navigation
    setIsDragging(prev => ({ ...prev, [workshopId]: true }));
    setTimeout(() => {
      setIsDragging(prev => ({ ...prev, [workshopId]: false }));
    }, 1000);
  };

  const goToSlide = (workshopId, slideIndex) => {
    setCurrentSlides(prev => ({
      ...prev,
      [workshopId]: slideIndex
    }));
    // Brief pause after manual navigation
    setIsDragging(prev => ({ ...prev, [workshopId]: true }));
    setTimeout(() => {
      setIsDragging(prev => ({ ...prev, [workshopId]: false }));
    }, 1000);
  };

  // Mouse handlers
  const handleMouseEnter = (workshopId) => {
    setIsHovered(prev => ({ ...prev, [workshopId]: true }));
  };

  const handleMouseLeave = (workshopId) => {
    setIsHovered(prev => ({ ...prev, [workshopId]: false }));
  };

  // Touch handlers with better mobile support
  const handleTouchStart = (e, workshopId) => {
    setActiveWorkshop(workshopId);
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    setTouchEnd({ x: 0, y: 0 });
    setIsDragging(prev => ({ ...prev, [workshopId]: true }));
  };

  const handleTouchMove = (e) => {
    if (!touchStart.x) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    setTouchEnd({
      x: currentX,
      y: currentY
    });

    // Prevent default scrolling if horizontal swipe is detected
    const deltaX = Math.abs(currentX - touchStart.x);
    const deltaY = Math.abs(currentY - touchStart.y);
    
    if (deltaX > 10 && deltaX > deltaY) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!activeWorkshop) {
      setTouchStart({ x: 0, y: 0 });
      setTouchEnd({ x: 0, y: 0 });
      return;
    }

    if (!touchStart.x || !touchEnd.x) {
      // Reset without swipe action
      setTouchStart({ x: 0, y: 0 });
      setTouchEnd({ x: 0, y: 0 });
      setTimeout(() => {
        setIsDragging(prev => ({ ...prev, [activeWorkshop]: false }));
      }, 100);
      setActiveWorkshop(null);
      return;
    }

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = Math.abs(touchStart.y - touchEnd.y);
    const minSwipeDistance = 30; // Reduced for easier swiping

    // Only process horizontal swipes
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        // Swipe left - next slide
        nextSlide(activeWorkshop);
      } else {
        // Swipe right - previous slide
        prevSlide(activeWorkshop);
      }
    }

    // Reset states with a delay to allow auto-slide to resume
    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
    
    setTimeout(() => {
      setIsDragging(prev => ({ ...prev, [activeWorkshop]: false }));
    }, 500);
    
    setActiveWorkshop(null);
  };



  const handleMediaClick = (media) => {
    setPreviewModal({ open: true, media: media, type: media.type });
  };

  const closePreview = () => {
    setPreviewModal({ open: false, media: null, type: null });
  };

  const handleVideoLoad = (videoId) => {
    setVideoLoaded(prev => ({ ...prev, [videoId]: true }));
  };

  const handleImageLoad = (imageId) => {
    setImagesLoaded(prev => ({ ...prev, [imageId]: true }));
  };

  // Enhanced image component with persistent loading state
  const EnhancedImage = ({ src, alt, className, isVideo = false, ...props }) => {
    const [error, setError] = useState(false);
    
    // Create unique ID for this image
    const imageId = `${src}`;
    const isLoaded = imagesLoaded[imageId] || false;

    const handleLoad = () => {
      handleImageLoad(imageId);
    };

    const handleError = () => {
      setError(true);
    };

    return (
      <div className={`relative ${className}`}>
        {/* Wireframe skeleton loader - only show if not loaded yet */}
        {!isLoaded && !error && (
          <div className="absolute inset-0 transition-opacity duration-300">
            <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
              {/* Wireframe elements */}
              <div className="w-full h-full relative overflow-hidden rounded-lg">
                {/* Top elements */}
                <div className="absolute top-4 left-4 w-20 h-3 bg-gray-300 rounded-full"></div>
                <div className="absolute top-8 left-4 w-32 h-2 bg-gray-300 rounded-full delay-100"></div>
                
                {/* Center image placeholder */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 border-2 border-gray-300 rounded-xl flex items-center justify-center bg-gray-100">
                    {isVideo ? (
                      <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Bottom elements */}
                <div className="absolute bottom-8 left-4 w-28 h-2 bg-gray-300 rounded-full delay-75"></div>
                <div className="absolute bottom-4 left-4 w-16 h-3 bg-gray-300 rounded-full delay-150"></div>
                
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Actual image */}
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 hover:scale-105`}
          onLoad={handleLoad}
          onError={handleError}
          initial={false}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: 1
          }}
          transition={{ 
            opacity: { duration: isLoaded ? 0.4 : 0, ease: "easeOut" },
            scale: { duration: 0.4, ease: "easeOut" }
          }}
          {...props}
        />

        {/* Error state */}
        {error && (
          <motion.div 
            className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">Image failed to load</p>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <section id="about" className="py-24 bg-brand-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-brand-gray-600">About Us</h2>
            <p className="mt-2 text-6xl font-bold tracking-tight text-brand-gray-900 sm:text-4xl">
              We Don't Just Design Spaces <br />
              We Help You Feel at Home.
            </p>
            <p className="mt-6 text-lg leading-8 text-brand-gray-700">
              At S2 Design, we understand that a home is more than just walls and furniture it's where you return, rest, and live your story.
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-brand-gray-700 flex flex-col items-center">
                  <div className="mb-4 rounded-full bg-brand-gray-200 p-3">
                    <stat.icon className="h-8 w-8 text-brand-gray-600" />
                  </div>
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-brand-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg leading-8 text-brand-gray-700 mb-6">
                With over <span className="font-semibold text-brand-gray-600">12 years of experience</span> and nearly <span className="font-semibold text-brand-gray-600">200 projects completed</span> across Jakarta and other cities, we've helped homeowners, apartment dwellers, and business owners transform their spaces into something they love.
              </p>
              <p className="text-lg leading-8 text-brand-gray-700 mb-6">
                We have <span className="font-semibold text-brand-gray-600">two in-house workshops</span> located in West Jakarta to ensure that every detail   from design to execution   is managed and built with precision.
              </p>
              <p className="text-lg leading-8 text-brand-gray-700 mb-8">
                Our design team combines creativity with technical know-how, while our craftsmen bring those ideas to life with high-quality custom furniture.
              </p>
              <div className="bg-brand-gray-100 border-l-4 border-brand-gray-500 p-6 rounded-r-lg">
                <p className="text-xl font-medium text-brand-gray-800 italic">
                  "Your vision, our commitment   let's build something beautiful together."
                </p>
              </div>
            </div>
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative"
              >
                <img
                  className="w-full rounded-2xl shadow-xl"
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modern interior design workspace"
                />
                <div className="absolute -bottom-6 -right-6 bg-brand-gray-50 p-6 rounded-xl shadow-lg border border-brand-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-gray-600">200+</div>
                    <div className="text-sm text-brand-gray-700">Happy Homes</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Workshop Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mt-20 max-w-6xl"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-12">
              <WrenchScrewdriverIcon className="h-12 w-12 text-brand-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-brand-gray-900 mb-4">In-House Workshop Excellence</h3>
              <p className="text-lg text-brand-gray-700">
                Our two workshops in West Jakarta ensure quality control from concept to completion
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {workshops.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.2 }}
                  className="bg-brand-gray-100 rounded-xl p-6"
                >
                  {/* Custom Workshop Media Slider */}
                  <div 
                    className="relative mb-6 overflow-hidden rounded-lg shadow-md select-none group"
                    onMouseEnter={() => handleMouseEnter(workshop.id)}
                    onMouseLeave={() => handleMouseLeave(workshop.id)}
                    onTouchStart={(e) => handleTouchStart(e, workshop.id)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ 
                      touchAction: 'pan-y',
                      WebkitUserSelect: 'none',
                      userSelect: 'none'
                    }}
                  >
                    {/* Slider Container */}
                    <div className="relative h-48 sm:h-56 w-full">
                      {workshop.media.map((media, mediaIndex) => (
                        <div
                          key={mediaIndex}
                          className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
                            mediaIndex === currentSlides[workshop.id] 
                              ? 'opacity-100 transform translate-x-0 z-10' 
                              : mediaIndex < currentSlides[workshop.id]
                              ? 'opacity-0 transform -translate-x-full z-0'
                              : 'opacity-0 transform translate-x-full z-0'
                          }`}
                          style={{
                            pointerEvents: mediaIndex === currentSlides[workshop.id] ? 'auto' : 'none'
                          }}
                        >
                          {media.type === 'image' ? (
                            <div className="w-full h-full relative">
                              <EnhancedImage
                                src={media.url}
                                alt={media.alt}
                                className="w-full h-full"
                                isVideo={false}
                              />
                              {/* Click area for image preview - center area only */}
                              <div 
                                className="absolute top-1/4 left-1/4 w-1/2 h-1/2 cursor-pointer z-20 flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMediaClick(media);
                                }}
                                title="Click to preview"
                              >
                                <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-full p-2">
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative w-full h-full">
                              <EnhancedImage
                                src={media.thumbnail}
                                alt={media.alt}
                                className="w-full h-full"
                                isVideo={true}
                              />
                              {/* Video play overlay */}
                              <div 
                                className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer z-20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMediaClick(media);
                                }}
                                title="Click to play video"
                              >
                                <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors duration-300">
                                  <PlayIcon className="h-8 w-8 text-brand-gray-800" />
                                </div>
                              </div>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs pointer-events-none z-10">
                                Video
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Navigation Arrows - Desktop - Only on hover */}
                      {workshop.media.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevSlide(workshop.id);
                            }}
                            className="hidden sm:flex absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-auto shadow-lg hover:shadow-xl items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextSlide(workshop.id);
                            }}
                            className="hidden sm:flex absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-auto shadow-lg hover:shadow-xl items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Mobile Navigation - Touch zones only */}
                      {workshop.media.length > 1 && (
                        <>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              prevSlide(workshop.id);
                            }}
                            className="sm:hidden absolute left-0 top-0 w-20 h-full flex items-center justify-center z-30 cursor-pointer"
                          >
                            <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 opacity-50">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </div>
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              nextSlide(workshop.id);
                            }}
                            className="sm:hidden absolute right-0 top-0 w-20 h-full flex items-center justify-center z-30 cursor-pointer"
                          >
                            <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 opacity-50">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Slide Indicators */}
                      {workshop.media.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                          {workshop.media.map((media, mediaIndex) => (
                            <button
                              key={mediaIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                goToSlide(workshop.id, mediaIndex);
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                                mediaIndex === currentSlides[workshop.id]
                                  ? 'bg-white' 
                                  : 'bg-white/50 hover:bg-white/80'
                              } ${media.type === 'video' ? 'ring-1 ring-white/30' : ''}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Workshop Info */}
                  <div className="text-center">
                    <div className="bg-brand-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-brand-gray-600">{workshop.id}</span>
                    </div>
                    <h4 className="font-semibold text-brand-gray-900 mb-3 text-lg">{workshop.title}</h4>
                    <p className="text-brand-gray-700 leading-relaxed">{workshop.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      {previewModal.open && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        >
          <div 
            className="relative max-w-4xl w-full"
          >
            {previewModal.type === 'image' ? (
              <div className="relative">
                <img
                  src={previewModal.media.url}
                  alt={previewModal.media.alt}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
                {/* Close button for image */}
                <button
                  onClick={closePreview}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close preview"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <video
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[80vh] rounded-lg shadow-2xl"
                  onLoadStart={() => handleVideoLoad(previewModal.media.url)}
                  preload="none"
                  playsInline
                >
                  <source src={previewModal.media.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Close button for video */}
                <button
                  onClick={closePreview}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
                  aria-label="Close preview"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                
                {!videoLoaded[previewModal.media.url] && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm sm:text-base">Loading video...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
} 