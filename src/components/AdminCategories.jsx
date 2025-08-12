import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useCategories } from '../contexts/CategoryContext';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: ''
    });
    setEditingCategory(null);
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug
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

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if slug already exists (excluding current category if editing)
    const slugExists = categories.some(cat => 
      cat.slug === formData.slug && cat.id !== editingCategory?.id
    );
    
    if (slugExists) {
      alert('Category with this name already exists!');
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        updateCategory(editingCategory.id, formData);
      } else {
        // Add new category
        addCategory(formData);
      }
      
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = (categoryId) => {
    try {
      if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
        deleteCategory(categoryId);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-2">Organize your portfolio items with categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-brown-600 hover:bg-brand-brown-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TagIcon className="w-8 h-8 text-brand-brown-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                {category.id !== 'all' && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openModal(category)}
                      className="p-2 text-gray-400 hover:text-brand-brown-600 hover:bg-brand-brown-50 rounded-full transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {category.id === 'all' && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>System Category:</strong> This category shows all portfolio items and cannot be edited or deleted.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 1 && (
        <div className="text-center py-16">
          <TagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No custom categories</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding your first portfolio category.
          </p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-brown-600 hover:bg-brand-brown-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Category
          </button>
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
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent"
                    placeholder="Living Room"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent"
                    placeholder="living-room"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL-friendly version of the category name. Auto-generated but can be customized.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-brand-brown-600 hover:bg-brand-brown-700"
                  >
                    {editingCategory ? 'Update' : 'Add'} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 