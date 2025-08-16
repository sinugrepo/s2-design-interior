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

// Main homepage component
function HomePage() {
  const location = useLocation();
  const { saveScrollPosition, clearScrollPosition } = useScroll();

  useEffect(() => {
    // Check if this is a page refresh/reload
    const isPageRefresh = window.performance.getEntriesByType('navigation')[0]?.type === 'reload';
    
    if (isPageRefresh) {
      // Clear all scroll positions on page refresh
      clearScrollPosition('portfolio');
      return;
    }

    // Check if we're coming back from project detail with scroll position
    if (location.state?.scrollToPortfolio && location.state?.scrollPosition) {
      setTimeout(() => {
        // First scroll to portfolio section
        const portfolioElement = document.querySelector('#portfolio');
        if (portfolioElement) {
          // Save the position for Portfolio component to restore
          saveScrollPosition('portfolio', location.state.scrollPosition);
          // Scroll to the saved position
          window.scrollTo({
            top: location.state.scrollPosition,
            behavior: 'auto'
          });
        }
      }, 100);
    }
  }, [location.state, saveScrollPosition, clearScrollPosition]);

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
