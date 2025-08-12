import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PhotoIcon,
  UserIcon,
  TagIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useTestimonials } from '../contexts/TestimonialsContext';
import { useCategories } from '../contexts/CategoryContext';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { portfolioItems } = usePortfolio();
  const { testimonials } = useTestimonials();
  const { categories } = useCategories();
  const { user } = useAuth();

  const stats = [
    {
      name: 'Portfolio Items',
      value: portfolioItems.length,
      icon: PhotoIcon,
      color: 'bg-blue-500',
      link: '/admin/portfolio',
      action: 'Manage Portfolio'
    },
    {
      name: 'Testimonials',
      value: testimonials.length,
      icon: UserIcon,
      color: 'bg-green-500',
      link: '/admin/testimonials',
      action: 'Manage Testimonials'
    },
    {
      name: 'Categories',
      value: categories.filter(cat => cat.id !== 'all').length,
      icon: TagIcon,
      color: 'bg-purple-500',
      link: '/admin/categories',
      action: 'Manage Categories'
    },
    {
      name: 'Total Views',
      value: '2.4K',
      icon: EyeIcon,
      color: 'bg-orange-500',
      link: '/',
      action: 'View Website'
    }
  ];

  const recentActivity = [
    { action: 'Portfolio item added', item: 'Modern Kitchen Design', time: '2 hours ago' },
    { action: 'Testimonial updated', item: 'Sarah Johnson review', time: '5 hours ago' },
    { action: 'Category created', item: 'Garden Design', time: '1 day ago' },
    { action: 'Portfolio item updated', item: 'Luxury Bathroom', time: '2 days ago' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.username || 'Admin'}! Here's what's happening with your content.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Link
                to={stat.link}
                className="text-sm text-brand-brown-600 hover:text-brand-brown-700 font-medium"
              >
                {stat.action} →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/admin/portfolio"
              className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-blue-500 rounded-lg mr-4">
                <PlusIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-700">Add Portfolio Item</h3>
                <p className="text-sm text-gray-600">Upload new design work</p>
              </div>
            </Link>
            
            <Link
              to="/admin/testimonials"
              className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-green-500 rounded-lg mr-4">
                <PlusIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-green-700">Add Testimonial</h3>
                <p className="text-sm text-gray-600">Add client feedback</p>
              </div>
            </Link>
            
            <Link
              to="/admin/categories"
              className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-purple-500 rounded-lg mr-4">
                <PlusIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-purple-700">Create Category</h3>
                <p className="text-sm text-gray-600">Organize your content</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-brand-brown-100 rounded-lg mr-4">
                  <ChartBarIcon className="h-4 w-4 text-brand-brown-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="text-sm text-brand-brown-600 hover:text-brand-brown-700 font-medium">
              View all activity →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Overview Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Portfolio by Category */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Distribution</h3>
            <div className="space-y-2">
              {categories.filter(cat => cat.id !== 'all').slice(0, 4).map((category) => {
                const count = portfolioItems.filter(item => item.category === category.id).length;
                const percentage = portfolioItems.length > 0 ? (count / portfolioItems.length) * 100 : 0;
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-brand-brown-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials Rating */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Average Rating</h3>
            <div className="text-4xl font-bold text-brand-brown-600 mb-2">
              {testimonials.length > 0 
                ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-sm text-gray-600">Based on {testimonials.length} testimonials</p>
          </div>

          {/* Quick Stats */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">This Month</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New Portfolio</span>
                <span className="text-sm font-medium text-green-600">+3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New Testimonials</span>
                <span className="text-sm font-medium text-green-600">+2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="text-sm font-medium text-blue-600">{categories.length - 1}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 