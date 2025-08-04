import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

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
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-brand-beige-300 transition-colors duration-200"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex flex-col items-center md:items-start">
            <button
              onClick={scrollToTop}
              className="mb-4 text-2xl font-bold text-white hover:text-brand-beige-300 transition-colors duration-200"
            >
              S2 Design <span className="text-brand-brown-400">Interior</span>
            </button>
            <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm text-gray-400 hover:text-brand-beige-300 transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <p className="text-center text-xs leading-5 text-gray-500 md:text-left">
              &copy; {new Date().getFullYear()} S2 Design Interior. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 