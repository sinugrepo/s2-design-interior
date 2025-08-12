import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CategoryProvider } from './contexts/CategoryContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { TestimonialsProvider } from './contexts/TestimonialsContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminPortfolio from './components/AdminPortfolio';
import AdminCategories from './components/AdminCategories';
import AdminTestimonials from './components/AdminTestimonials';

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
      <CategoryProvider>
        <PortfolioProvider>
          <TestimonialsProvider>
            <Router>
              <div className="min-h-screen bg-white">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="portfolio" element={<AdminPortfolio />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="categories" element={<AdminCategories />} />
                  </Route>
                </Routes>
              </div>
            </Router>
          </TestimonialsProvider>
        </PortfolioProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
