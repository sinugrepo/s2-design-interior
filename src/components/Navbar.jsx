import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';

const navigation = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Our Projects', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-brand-gray-50/90 backdrop-blur-md border-b border-brand-gray-200">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center">
            <img 
              src={logo} 
              alt="S2 Design Interior" 
              className="h-12 w-auto ml-5"
            />
            {/* <div className="ml-3">
              <span className="text-xl font-bold text-brand-gray-900">S2 Design</span>
              <span className="text-brand-gray-600 ml-1 font-medium">Interior</span>
            </div> */}
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-brand-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-sm font-semibold leading-6 text-brand-gray-900 hover:text-brand-gray-600 transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={scrollToContact}
            className="rounded-md bg-brand-gray-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-gray-600 transition-colors duration-200"
          >
            Consult Now
          </button>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-brand-gray-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-brand-gray-200">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <img 
                src={logo} 
                alt="S2 Design Interior" 
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-brand-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-brand-gray-200">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-brand-gray-900 hover:bg-brand-gray-100 w-full text-left"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="py-6">
                <button
                  onClick={scrollToContact}
                  className="w-full rounded-md bg-brand-gray-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-gray-600 transition-colors duration-200"
                >
                  Consult Now
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
} 