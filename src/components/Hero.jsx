import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-brand-gray-50 to-brand-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-brand-gray-900 sm:text-6xl">
              Transform Your Space Into{' '}
              <span className="text-brand-gray-600">Art</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-brand-gray-700">
              We create stunning interior designs that reflect your personality and enhance your lifestyle. 
              From concept to completion, we bring your vision to life with elegance and sophistication.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={scrollToContact}
                className="rounded-md bg-brand-gray-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-gray-600 transition-all duration-200 hover:scale-105"
              >
                Get Free Consultation
              </button>
              <button
                onClick={() => document.querySelector('#portfolio').scrollIntoView({ behavior: 'smooth' })}
                className="text-base font-semibold leading-6 text-brand-gray-900 hover:text-brand-gray-600 transition-colors duration-200"
              >
                View Our Work <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto w-full max-w-lg"
          >
            <img
              className="w-full rounded-2xl shadow-2xl"
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="Beautiful modern interior design"
            />
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-gray-200 to-brand-gray-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  );
} 