import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Star } from 'lucide-react';
import { useTestimonials } from '../contexts/TestimonialsContext';

export default function Testimonials() {
  const { testimonials, isLoading, error } = useTestimonials();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 30,
        },
      },
    },
  }, [
    (slider) => {
      let timeout;
      let mouseOver = false;
      
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 3000); // Reduced from 4000 to 3000ms for more frequent transitions
      }
      
      slider.on("created", () => {
        // Auto start the slider
        nextTimeout();
        
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        
        // Handle touch events for mobile
        slider.container.addEventListener("touchstart", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("touchend", () => {
          mouseOver = false;
          // Small delay before resuming auto slide after touch
          setTimeout(() => {
            if (!mouseOver) nextTimeout();
          }, 1000);
        });
      });
      
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
      slider.on("slideChanged", nextTimeout);
    },
  ]);

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-brand-gray-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-brand-gray-900 sm:text-4xl">
              What Our Clients Say
            </p>
            <p className="mt-6 text-lg leading-8 text-brand-gray-700">
              Don't just take our word for it. Here's what our satisfied clients have to say about our work.
            </p>
          </motion.div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64 mt-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gray-600"></div>
          </div>
        ) : error ? (
          <div className="mt-16 text-center">
            <p className="text-brand-gray-700">Unable to load testimonials at the moment.</p>
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16"
          >
            <div ref={sliderRef} className="keen-slider">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="keen-slider__slide">
                  <div className="bg-brand-gray-50 p-8 rounded-2xl shadow-sm h-full flex flex-col min-h-[280px] border border-brand-gray-200">
                    {/* Stars Rating - Fixed at top */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    {/* Quote - Takes available space */}
                    <blockquote className="text-brand-gray-700 leading-relaxed flex-grow mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Profile - Fixed at bottom */}
                    <div className="flex items-center mt-auto">
                      <img
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        src={testimonial.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
                        alt={testimonial.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                      <div className="ml-4">
                        <div className="font-semibold text-brand-gray-900">{testimonial.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-brand-gray-700">No testimonials available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
} 