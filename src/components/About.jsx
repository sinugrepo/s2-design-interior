import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { HomeIcon, UserGroupIcon, WrenchScrewdriverIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const stats = [
  { id: 1, name: 'Years of Experience', value: '12+', icon: HomeIcon },
  { id: 2, name: 'Projects Completed', value: '200+', icon: BuildingOfficeIcon },
  { id: 3, name: 'In-House Workshops', value: '2', icon: WrenchScrewdriverIcon },
  { id: 4, name: 'Happy Clients', value: '150+', icon: UserGroupIcon },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
                We have <span className="font-semibold text-brand-brown-600">two in-house workshops</span> located in West Jakarta to ensure that every detail — from design to execution — is managed and built with precision.
              </p>
              <p className="text-lg leading-8 text-gray-700 mb-8">
                Our design team combines creativity with technical know-how, while our craftsmen bring those ideas to life with high-quality custom furniture.
              </p>
              <div className="bg-brand-brown-50 border-l-4 border-brand-brown-600 p-6 rounded-r-lg">
                <p className="text-xl font-medium text-brand-brown-800 italic">
                  "Your vision, our commitment — let's build something beautiful together."
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
          className="mx-auto mt-20 max-w-4xl"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-8">
              <WrenchScrewdriverIcon className="h-12 w-12 text-brand-brown-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">In-House Workshop Excellence</h3>
              <p className="text-lg text-gray-600">
                Our two workshops in West Jakarta ensure quality control from concept to completion
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-brand-brown-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-brown-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Design Workshop</h4>
                <p className="text-gray-600">Where creativity meets precision planning and 3D visualization</p>
              </div>
              <div className="text-center">
                <div className="bg-brand-brown-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-brown-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Production Workshop</h4>
                <p className="text-gray-600">Where skilled craftsmen build your custom furniture with care</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 