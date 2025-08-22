import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import logo from '../assets/whitelogo.png';

const navigation = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/s2dinterior',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/s2design_interior',
    icon: Instagram,
  }
];

export default function Footer() {
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <button
            onClick={scrollToTop}
            className="mb-6 flex items-center text-white hover:text-brand-gray-200 transition-colors duration-200"
          >
            <img 
              src={logo} 
              alt="S2 Design Interior" 
              className="h-12 w-auto mr-3"
            />
            {/* <div>
              <span className="text-xl font-bold">S2 Design</span>
              <span className="text-brand-gray-400 ml-1">Interior</span>
            </div> */}
          </button>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-brand-gray-300 transition-colors duration-200"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm text-white hover:text-brand-gray-300 transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </nav>
          
          
          
          {/* Copyright */}
          <p className="text-center text-xs leading-5 text-brand-gray-300">
            &copy; {new Date().getFullYear()} S2 Design Interior. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 