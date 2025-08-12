import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  TagIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useProjects } from '../contexts/ProjectsContext';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';

export default function AdminCategories() {
  const { projects, categories, refreshCategories, refreshAll } = useProjects();
  const { showError, showConfirm, showSuccess, showWarning } = useModal();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    display_name: ''
  });

  const API_BASE_URL = 'http://localhost:3001/api';

  // Create new category
  const createCategory = async (categoryData) => {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'Authentication required. Please log in again.' };
      }

      const response = await fetch(`${API_BASE_URL}/projects/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Authentication failed. Please log in again.' };
        } else if (response.status === 403) {
          return { success: false, error: 'You do not have permission to perform this action.' };
        }
      }

      return await response.json();
    } catch (err) {
      console.error('Error creating category:', err);
      return { success: false, error: 'Failed to create category. Please check your connection.' };
    }
  };

  // Update existing category
  const updateCategory = async (currentName, categoryData) => {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'Authentication required. Please log in again.' };
      }

      const response = await fetch(`${API_BASE_URL}/projects/categories/${encodeURIComponent(currentName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newName: categoryData.name })
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Authentication failed. Please log in again.' };
        } else if (response.status === 403) {
          return { success: false, error: 'You do not have permission to perform this action.' };
        }
      }

      return await response.json();
    } catch (err) {
      console.error('Error updating category:', err);
      return { success: false, error: 'Failed to update category. Please check your connection.' };
    }
  };

  // Get category usage count
  const getCategoryUsage = (categoryName) => {
    return projects.filter(project => project.category === categoryName).length;
  };

  const resetForm = () => {
    setFormData({ name: '', display_name: '' });
    setEditingCategory(null);
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category, display_name: category });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory, formData);
      } else {
        result = await createCategory(formData);
      }

      if (result.success) {
        // Use the centralized refresh functions
        await refreshAll();
        closeModal();
        setError(null);
        
        // Notify user of successful operation
        if (editingCategory) {
          showSuccess('Berhasil!', `Kategori "${formData.name}" berhasil diperbarui!`);
        } else {
          showSuccess(
            'Kategori Berhasil Dibuat!', 
            `Kategori "${formData.name}" berhasil dibuat dan sekarang dapat digunakan untuk proyek.`
          );
        }
      } else {
        setError(result.error || 'Operasi gagal');
        showError('Gagal Menyimpan', result.error || 'Terjadi kesalahan saat menyimpan kategori');
      }
    } catch (err) {
      console.error('Error submitting category:', err);
      const errorMsg = 'Gagal menyimpan kategori. Silakan periksa koneksi internet Anda.';
      setError(errorMsg);
      showError('Error', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryName) => {
    const usage = getCategoryUsage(categoryName);
    
    if (usage > 0) {
      showWarning(
        'Kategori Sedang Digunakan',
        `Kategori "${categoryName}" sedang digunakan oleh ${usage} proyek. Menghapus kategori ini akan menghapus kategori dari semua proyek tersebut (proyek tidak akan dihapus, hanya kategorinya saja).`,
        async () => {
          await performDelete(categoryName, true);
        }
      );
    } else {
      showConfirm(
        'Hapus Kategori',
        `Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`,
        async () => {
          await performDelete(categoryName, false);
        }
      );
    }
  };

  const performDelete = async (categoryName, hasProjects) => {
    try {
      const token = getToken();
      if (!token) {
        showError('Autentikasi Diperlukan', 'Silakan login kembali untuk melanjutkan.');
        return;
      }

      setIsLoading(true);

      // Use the improved projects endpoint that now properly deletes from both tables
      const response = await fetch(`${API_BASE_URL}/projects/categories/${encodeURIComponent(categoryName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Successful deletion - refresh everything
        console.log('Category deleted successfully:', result);
        await refreshAll();
        
        if (result.data && result.data.affectedProjects > 0) {
          showSuccess('Berhasil!', `Kategori "${categoryName}" berhasil dihapus dari ${result.data.affectedProjects} proyek`);
        } else {
          showSuccess('Berhasil!', `Kategori "${categoryName}" berhasil dihapus`);
        }
      } else {
        // If the main deletion fails, try the cleanup endpoint as fallback
        console.log('Main deletion failed, trying cleanup fallback...');
        try {
          const cleanupResponse = await fetch(`${API_BASE_URL}/projects/categories/cleanup/${encodeURIComponent(categoryName)}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const cleanupResult = await cleanupResponse.json();
          
          if (cleanupResponse.ok && cleanupResult.success) {
            await refreshAll();
            showSuccess('Berhasil!', `Kategori "${categoryName}" berhasil dihapus (menggunakan cleanup)`);
          } else {
            throw new Error(cleanupResult.error || 'Cleanup failed');
          }
        } catch (cleanupErr) {
          console.error('Cleanup also failed:', cleanupErr);
          await refreshAll(); // Refresh anyway to see current state
          showError('Gagal Menghapus', result.error || 'Terjadi kesalahan saat menghapus kategori');
        }
      }

    } catch (err) {
      console.error('Error deleting category:', err);
      
      // Force refresh to see current state
      try {
        await refreshAll();
      } catch (refreshErr) {
        console.error('Error refreshing after failed deletion:', refreshErr);
      }
      
      showError('Error', 'Terjadi kesalahan saat menghapus kategori. Data telah direfresh.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Categories</h1>
          <p className="text-gray-600 mt-1">Manage project categories and their usage</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-brand-brown-600 hover:bg-brand-brown-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const usage = getCategoryUsage(category);
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-brand-brown-100 rounded-lg mr-3">
                    <TagIcon className="w-5 h-5 text-brand-brown-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
                    <p className="text-sm text-gray-500">
                      {usage} project{usage !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 text-gray-400 hover:text-brand-brown-600 hover:bg-brand-brown-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {usage > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-2">Used in projects:</p>
                  <div className="flex flex-wrap gap-1">
                    {projects
                      .filter(project => project.category === category)
                      .slice(0, 3)
                      .map(project => (
                        <span
                          key={project.id}
                          className="text-xs bg-white px-2 py-1 rounded border"
                        >
                          {project.title}
                        </span>
                      ))}
                    {usage > 3 && (
                      <span className="text-xs text-gray-500">
                        +{usage - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <TagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-6">Start by creating your first project category</p>
          <button
            onClick={() => openModal()}
            className="bg-brand-brown-600 hover:bg-brand-brown-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Category
          </button>
        </div>
      )}

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent"
                  placeholder="e.g., Office, Residential, Public Space"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-brand-brown-600 hover:bg-brand-brown-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
} 