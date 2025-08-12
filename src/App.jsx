import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { TestimonialsProvider } from './contexts/TestimonialsContext';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
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

// Main homepage component
function HomePage() {
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
          </TestimonialsProvider>
        </ProjectsProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
