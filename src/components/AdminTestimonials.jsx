import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  StarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useTestimonials } from '../contexts/TestimonialsContext';
import { useModal } from '../contexts/ModalContext';

export default function AdminTestimonials() {
  const { testimonials, isLoading, error, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
  const { showError, showConfirm, showSuccess } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quote: '',
    avatar: '',
    rating: 5
  });

  const resetForm = () => {
    setFormData({
      name: '',
      quote: '',
      avatar: '',
      rating: 5
    });
    setEditingTestimonial(null);
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        quote: testimonial.quote,
        avatar: testimonial.avatar,
        rating: testimonial.rating
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.quote.trim()) {
      showError('Data Tidak Lengkap', 'Nama dan testimoni harus diisi!');
      return;
    }

    try {
      let result;
      if (editingTestimonial) {
        // Update existing testimonial
        result = await updateTestimonial(editingTestimonial.id, formData);
      } else {
        // Add new testimonial
        result = await addTestimonial(formData);
      }
      
      if (result.success) {
        showSuccess(
          'Berhasil!', 
          editingTestimonial 
            ? 'Testimoni berhasil diperbarui!' 
            : 'Testimoni baru berhasil ditambahkan!'
        );
        closeModal();
      } else {
        showError('Gagal Menyimpan', result.error || 'Terjadi kesalahan saat menyimpan testimoni');
      }
    } catch (error) {
      showError('Error', error.message || 'Terjadi kesalahan yang tidak terduga');
    }
  };

  const handleDelete = (testimonial) => {
    showConfirm(
      'Hapus Testimoni',
      `Apakah Anda yakin ingin menghapus testimoni dari "${testimonial.name}"? Tindakan ini tidak dapat dibatalkan.`,
      async () => {
        try {
          const result = await deleteTestimonial(testimonial.id);
          if (result.success) {
            showSuccess('Berhasil!', 'Testimoni berhasil dihapus');
          } else {
            showError('Gagal Menghapus', result.error || 'Terjadi kesalahan saat menghapus testimoni');
          }
        } catch (error) {
          showError('Error', error.message || 'Terjadi kesalahan yang tidak terduga');
        }
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const renderStars = (rating, interactive = false, onClick = null) => {
    return [...Array(5)].map((_, i) => {
      const isFilled = i < rating;
      const StarComponent = isFilled ? StarIconSolid : StarIcon;
      
      return (
        <StarComponent
          key={i}
          className={`w-5 h-5 ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive ? () => onClick(i + 1) : undefined}
        />
      );
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-2">Manage client testimonials and reviews</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-brown-600 hover:bg-brand-brown-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserCircleIcon className="w-8 h-8 text-brand-brown-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Testimonials</h3>
              <p className="text-2xl font-bold text-brand-brown-600">{testimonials.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                  <div className="flex items-center mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(testimonial)}
                  className="p-2 text-gray-400 hover:text-brand-brown-600 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <blockquote className="text-gray-600 text-sm leading-relaxed">
              "{testimonial.quote}"
            </blockquote>
          </motion.div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new testimonial.</p>
          <div className="mt-6">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-brown-600 hover:bg-brand-brown-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New Testimonial
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-brand-brown-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserCircleIcon className="h-6 w-6 text-brand-brown-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-brown-500 focus:border-brand-brown-500"
                            placeholder="Client name"
                          />
                        </div>

                        <div>
                          <label htmlFor="quote" className="block text-sm font-medium text-gray-700">
                            Quote *
                          </label>
                          <textarea
                            name="quote"
                            id="quote"
                            required
                            rows={4}
                            value={formData.quote}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-brown-500 focus:border-brand-brown-500"
                            placeholder="Client testimonial..."
                          />
                        </div>

                        <div>
                          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                            Avatar URL
                          </label>
                          <input
                            type="url"
                            name="avatar"
                            id="avatar"
                            value={formData.avatar}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-brown-500 focus:border-brand-brown-500"
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex items-center space-x-1">
                            {renderStars(formData.rating, true, (rating) => 
                              setFormData(prev => ({ ...prev, rating }))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-brown-600 text-base font-medium text-white hover:bg-brand-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingTestimonial ? 'Update' : 'Add'} Testimonial
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
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