import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  PhotoIcon,
  UserIcon,
  TagIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
  { name: 'Portfolio', href: '/admin/portfolio', icon: PhotoIcon },
  { name: 'Testimonials', href: '/admin/testimonials', icon: UserIcon },
  { name: 'Categories', href: '/admin/categories', icon: TagIcon },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl"
        >
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-brand-brown-600">S2 Admin</h1>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-brand-brown-100 text-brand-brown-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-brand-brown-600">S2 Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-brand-brown-100 text-brand-brown-700 border border-brand-brown-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-brand-brown-100 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-brand-brown-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HomeIcon className="mr-3 h-4 w-4" />
                View Website
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-40 lg:hidden">
          <div className="flex h-16 items-center justify-between bg-white px-4 shadow-sm border-b border-gray-200">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 