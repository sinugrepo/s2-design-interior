import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  PuzzlePieceIcon,
  HandRaisedIcon,
  CubeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const services = [
  {
    id: 1,
    emoji: '🛋️',
    title: 'Interior Design for Homes & Apartments',
    description: 'We create beautiful, functional, and personalized interiors   complete with 3D visuals so you know exactly what you\'re getting before we build.',
    icon: HomeIcon,
    features: ['3D Visualization', 'Personalized Design', 'Space Planning', 'Material Selection']
  },
  {
    id: 2,
    emoji: '🛠️',
    title: 'Home Renovation Services',
    description: 'Want to refresh your kitchen, open up your living room, or completely revamp your house? We handle the entire renovation process so you don\'t have to stress.',
    icon: WrenchScrewdriverIcon,
    features: ['Full Renovation', 'Kitchen Remodeling', 'Living Room Makeover', 'Project Management']
  },
  {
    id: 3,
    emoji: '🪑',
    title: 'Custom Furniture Production',
    description: 'Need a wardrobe that fits that tricky corner? Or a kitchen set that suits your exact needs? Our workshop team builds furniture that\'s tailored to your space and style   with top-notch craftsmanship.',
    icon: CubeIcon,
    features: ['Custom Wardrobes', 'Kitchen Sets', 'Built-in Storage', 'Quality Craftsmanship']
  },
  {
    id: 4,
    emoji: '🤝',
    title: '3D Design Collaboration with Contractors',
    description: 'Working with your own contractor? No problem   we can support with precise 3D designs that guide the project clearly from start to finish.',
    icon: HandRaisedIcon,
    features: ['3D Technical Drawings', 'Contractor Support', 'Project Guidance', 'Clear Documentation']
  }
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 bg-brand-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-brand-gray-600">Services</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-brand-gray-900 sm:text-4xl">
              Need a Renovation? Custom Furniture? Or Just Don't Know Where to Start?
            </p>
            <p className="mt-6 text-lg leading-8 text-brand-gray-700">
              We're Here to Help. Here's how we can help bring your space to life:
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group relative bg-white rounded-2xl border border-brand-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-brand-gray-400"
              >
                {/* Background decoration */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <service.icon className="h-16 w-16 text-brand-gray-500" />
                </div>

                <div className="relative">
                  {/* Emoji and Title */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl">{service.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-brand-gray-900 group-hover:text-brand-gray-600 transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-brand-gray-700 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <SparklesIcon className="h-4 w-4 text-brand-gray-500 flex-shrink-0" />
                        <span className="text-sm text-brand-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <div className="bg-brand-gray-100 rounded-2xl p-8 border border-brand-gray-200">
            <PuzzlePieceIcon className="h-12 w-12 text-brand-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-brand-gray-900 mb-4">
              Not Sure Where to Start?
            </h3>
            <p className="text-lg text-brand-gray-700 mb-6">
              Every great space begins with a conversation. Let's discuss your vision and find the perfect solution for your needs.
            </p>
            <button
              onClick={() => document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-gray-500 hover:bg-brand-gray-600 transition-colors duration-200 hover:scale-105 transform"
            >
              Start Your Project
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 