import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { TestimonialsProvider } from './contexts/TestimonialsContext';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import { ScrollProvider, useScroll } from './contexts/ScrollContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminProjects from './components/AdminProjects';
import AdminCategories from './components/AdminCategories';
import AdminTestimonials from './components/AdminTestimonials';
import NotFound from './components/NotFound';
import { useEffect } from 'react';

// Route debugging component
function RouteDebugger() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
    console.log('Location state:', location.state);
  }, [location]);
  
  return null;
}

// Main homepage component
function HomePage() {
  const location = useLocation();
  const scrollContext = useScroll();

  useEffect(() => {
    console.log('HomePage component mounted/updated');
    
    // Check if this is a page refresh/reload
    const navigation = window.performance.getEntriesByType('navigation')[0];
    const isPageRefresh = navigation?.type === 'reload';
    
    if (isPageRefresh) {
      // Clear all scroll positions on page refresh
      scrollContext.clearScrollPosition('portfolio');
      return;
    }

    // Check if we're coming back from project detail with scroll position
    if (location.state?.scrollToPortfolio && location.state?.scrollPosition) {
      console.log('HomePage: Received scroll restoration request for position:', location.state.scrollPosition);
      
      // Simple restoration without complex dependencies
      const timeout = setTimeout(() => {
        const portfolioElement = document.querySelector('#portfolio');
        if (portfolioElement) {
          // Save the position for Portfolio component to restore
          scrollContext.saveScrollPosition('portfolio', location.state.scrollPosition);
          // Direct scroll restoration
          window.scrollTo({
            top: location.state.scrollPosition,
            behavior: 'auto'
          });
        }
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <ProjectsProvider>
          <TestimonialsProvider>
            <ScrollProvider>
              <Router>
                <RouteDebugger />
                <div className="min-h-screen bg-white">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/project/:id" element={<ProjectDetail />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<AdminDashboard />} />
                      <Route path="projects" element={<AdminProjects />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="testimonials" element={<AdminTestimonials />} />
                    </Route>

                    {/* 404 Catch-all Route - Must be last */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Router>
            </ScrollProvider>
          </TestimonialsProvider>
        </ProjectsProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
