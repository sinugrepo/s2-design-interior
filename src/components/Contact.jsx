import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const contactInfo = [
  {
    icon: MapPinIcon,
    title: 'Visit Our Office',
    details: 'Jelambar, West Jakarta',
    description: 'Come see our showroom and office in person',
    action: 'Get Directions',
    link: 'https://maps.app.goo.gl/Tk6vn5GnxHzmtpVG7'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'WhatsApp Us',
    details: '0813-6536-8638',
    description: 'Quick response for urgent inquiries',
    action: 'Chat Now',
    link: 'https://wa.me/6281365368638'
  },
  {
    icon: EnvelopeIcon,
    title: 'Email Us',
    details: 's2dinteriordesign@gmail.com',
    description: 'Send us your project details',
    action: 'Send Email',
    link: 'mailto:s2dinteriordesign@gmail.com'
  }
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-brand-brown-600">Contact Us</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Got a Project in Mind? Let's Talk.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Ready to transform your space? We'd love to hear about your vision and discuss how we can bring it to life.
            </p>
          </motion.div>
        </div>

        {/* Contact Methods */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-brown-100 group-hover:bg-brand-brown-200 transition-colors">
                  <contact.icon className="h-8 w-8 text-brand-brown-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{contact.title}</h3>
                <p className="mt-2 text-lg font-medium text-brand-brown-600">{contact.details}</p>
                <p className="mt-2 text-sm text-gray-600">{contact.description}</p>
                <a
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center px-4 py-2 border border-brand-brown-600 text-sm font-medium rounded-md text-brand-brown-600 hover:bg-brand-brown-600 hover:text-white transition-colors duration-200"
                >
                  {contact.action}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
              <p className="text-gray-600">Tell us about your project and we'll get back to you within 24 hours</p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  id="projectType"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a service</option>
                  <option value="interior-design">Interior Design</option>
                  <option value="renovation">Home Renovation</option>
                  <option value="custom-furniture">Custom Furniture</option>
                  <option value="3d-collaboration">3D Design Collaboration</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                  placeholder="Describe your space, your vision, and any specific requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-brown-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-brown-700 transition-colors duration-200 hover:scale-[1.02] transform"
              >
                Send Message
              </button>
            </form>
          </div>
        </motion.div>

        {/* Quick Contact Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="bg-brand-brown-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Need Quick Answers?</h3>
            <p className="text-brand-brown-100 mb-6">
              WhatsApp us for immediate response or visit our workshop in Jelambar to see our work firsthand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/6281365368638"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-brand-brown-600 transition-colors duration-200"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                WhatsApp Now
              </a>
              <a
                href="https://maps.app.goo.gl/Tk6vn5GnxHzmtpVG7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-brown-600 font-medium rounded-lg hover:bg-brand-brown-50 transition-colors duration-200"
              >
                <MapPinIcon className="h-5 w-5 mr-2" />
                Visit Workshop
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 