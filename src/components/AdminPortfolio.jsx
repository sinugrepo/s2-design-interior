import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  PhotoIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useCategories } from '../contexts/CategoryContext';

export default function AdminPortfolio() {
  const { portfolioItems, isLoading, error, addPortfolioItem, updatePortfolioItem, deletePortfolioItem, getPortfolioItemsByCategory } = usePortfolio();
  const { categories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    src: '',
    alt: '',
    category: categories.find(cat => cat.id !== 'all')?.id || 'living-room',
    width: 6,
    height: 8
  });

  // Filter items based on selected category
  const filteredItems = getPortfolioItemsByCategory(selectedCategory);

  const resetForm = () => {
    setFormData({
      src: '',
      alt: '',
      category: categories.find(cat => cat.id !== 'all')?.id || 'living-room',
      width: 6,
      height: 8
    });
    setEditingItem(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        src: item.src,
        alt: item.alt,
        category: item.category,
        width: item.width,
        height: item.height
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const openImageModal = (item) => {
    setSelectedImage(item);
    setImageModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Handle keyboard events for image modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && imageModalOpen) {
        closeImageModal();
      }
    };

    if (imageModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (editingItem) {
        // Update existing item
        await updatePortfolioItem(editingItem.id, formData);
      } else {
        // Add new item
        await addPortfolioItem(formData);
      }
      
      closeModal();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await deletePortfolioItem(id);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading portfolio</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600 mt-2">Manage your design portfolio items</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-brown-600 hover:bg-brand-brown-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.id
                  ? 'bg-brand-brown-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Fixed height container for consistent layout */}
              <div className="relative w-full h-64">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImageModal(item)}
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => openImageModal(item)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    title="View Image"
                  >
                    <EyeIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => openModal(item)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    title="Edit Item"
                  >
                    <PencilIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    title="Delete Item"
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{item.alt}</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {categories.find(cat => cat.id === item.category)?.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.width} × {item.height} aspect ratio
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items</h3>
          <p className="text-gray-500 mb-6">
            {selectedCategory === 'all' 
              ? 'Get started by adding your first portfolio item.'
              : 'No items found in this category. Try selecting a different category.'
            }
          </p>
          {selectedCategory === 'all' && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-brown-600 hover:bg-brand-brown-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Portfolio Item
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="src" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="src"
                    name="src"
                    value={formData.src}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="alt"
                    name="alt"
                    value={formData.alt}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent"
                    placeholder="Beautiful modern living room"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent"
                  >
                    {categories.filter(cat => cat.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                      Width Ratio
                    </label>
                    <input
                      type="number"
                      id="width"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      Height Ratio
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {formData.src && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                    <div className="w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                      <img
                        src={formData.src}
                        alt={formData.alt || 'Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-brand-brown-600 hover:bg-brand-brown-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {isSubmitting ? 'Saving...' : (editingItem ? 'Update' : 'Add') + ' Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={closeImageModal}></div>

            <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedImage.alt}
                  </h3>
                  <button
                    onClick={closeImageModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  />
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    <p className="capitalize">
                      Category: {categories.find(cat => cat.id === selectedImage.category)?.name}
                    </p>
                    <p>Aspect Ratio: {selectedImage.width} × {selectedImage.height}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 