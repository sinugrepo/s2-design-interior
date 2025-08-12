import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { HomeIcon, UserGroupIcon, WrenchScrewdriverIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

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
    images: [
      {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Design studio with computers and planning boards"
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Interior design planning workspace"
      },
      {
        url: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "3D visualization and design tools"
      }
    ]
  },
  {
    id: 2,
    title: "Production Workshop",
    description: "Where skilled craftsmen build your custom furniture with care",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Woodworking workshop with craftsmen"
      },
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Custom furniture production area"
      },
      {
        url: "https://images.unsplash.com/photo-1609895314276-7b650d593162?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Skilled craftsmen at work"
      }
    ]
  }
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentWorkshopImages, setCurrentWorkshopImages] = useState({ 1: 0, 2: 0 });
  const [isHovered, setIsHovered] = useState({ 1: false, 2: false });

  // Auto slide for workshop images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWorkshopImages(prev => ({
        1: isHovered[1] ? prev[1] : (prev[1] + 1) % workshops[0].images.length,
        2: isHovered[2] ? prev[2] : (prev[2] + 1) % workshops[1].images.length
      }));
    }, 4000); // Changed to 4 seconds for better UX

    return () => clearInterval(interval);
  }, [isHovered]);

  // Manual navigation functions
  const handlePrevious = (workshopId) => {
    setCurrentWorkshopImages(prev => ({
      ...prev,
      [workshopId]: prev[workshopId] === 0 
        ? workshops[workshopId - 1].images.length - 1 
        : prev[workshopId] - 1
    }));
  };

  const handleNext = (workshopId) => {
    setCurrentWorkshopImages(prev => ({
      ...prev,
      [workshopId]: (prev[workshopId] + 1) % workshops[workshopId - 1].images.length
    }));
  };

  const handleDotClick = (workshopId, imageIndex) => {
    setCurrentWorkshopImages(prev => ({
      ...prev,
      [workshopId]: imageIndex
    }));
  };

  const handleMouseEnter = (workshopId) => {
    setIsHovered(prev => ({ ...prev, [workshopId]: true }));
  };

  const handleMouseLeave = (workshopId) => {
    setIsHovered(prev => ({ ...prev, [workshopId]: false }));
  };

  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-brand-brown-600">About Us</h2>
            <p className="mt-2 text-6xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              We Don't Just Design Spaces <br />
              We Help You Feel at Home.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
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
                <dt className="text-base leading-7 text-gray-600 flex flex-col items-center">
                  <div className="mb-4 rounded-full bg-brand-brown-100 p-3">
                    <stat.icon className="h-8 w-8 text-brand-brown-600" />
                  </div>
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
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
              <p className="text-lg leading-8 text-gray-700 mb-6">
                With over <span className="font-semibold text-brand-brown-600">12 years of experience</span> and nearly <span className="font-semibold text-brand-brown-600">200 projects completed</span> across Jakarta and other cities, we've helped homeowners, apartment dwellers, and business owners transform their spaces into something they love.
              </p>
              <p className="text-lg leading-8 text-gray-700 mb-6">
                We have <span className="font-semibold text-brand-brown-600">two in-house workshops</span> located in West Jakarta to ensure that every detail   from design to execution   is managed and built with precision.
              </p>
              <p className="text-lg leading-8 text-gray-700 mb-8">
                Our design team combines creativity with technical know-how, while our craftsmen bring those ideas to life with high-quality custom furniture.
              </p>
              <div className="bg-brand-brown-50 border-l-4 border-brand-brown-600 p-6 rounded-r-lg">
                <p className="text-xl font-medium text-brand-brown-800 italic">
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
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-brown-600">200+</div>
                    <div className="text-sm text-gray-600">Happy Homes</div>
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
              <WrenchScrewdriverIcon className="h-12 w-12 text-brand-brown-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">In-House Workshop Excellence</h3>
              <p className="text-lg text-gray-600">
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
                  className="bg-gray-50 rounded-xl p-6"
                >
                  {/* Workshop Image Slider */}
                  <div 
                    className="relative mb-6 overflow-hidden rounded-lg shadow-md group"
                    onMouseEnter={() => handleMouseEnter(workshop.id)}
                    onMouseLeave={() => handleMouseLeave(workshop.id)}
                  >
                    <div className="relative h-48 sm:h-56">
                      {workshop.images.map((image, imageIndex) => (
                        <motion.img
                          key={imageIndex}
                          src={image.url}
                          alt={image.alt}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            imageIndex === currentWorkshopImages[workshop.id] ? 'opacity-100' : 'opacity-0'
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: imageIndex === currentWorkshopImages[workshop.id] ? 1 : 0 
                          }}
                          transition={{ duration: 1 }}
                        />
                      ))}
                      
                      {/* Navigation buttons */}
                      {workshop.images.length > 1 && (
                        <>
                          <button
                            onClick={() => handlePrevious(workshop.id)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleNext(workshop.id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Image indicators */}
                    {workshop.images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {workshop.images.map((_, imageIndex) => (
                          <button
                            key={imageIndex}
                            onClick={() => handleDotClick(workshop.id, imageIndex)}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 hover:scale-125 transform ${
                              imageIndex === currentWorkshopImages[workshop.id] 
                                ? 'bg-white' 
                                : 'bg-white/50 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Workshop Info */}
                  <div className="text-center">
                    <div className="bg-brand-brown-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-brand-brown-600">{workshop.id}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">{workshop.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{workshop.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 