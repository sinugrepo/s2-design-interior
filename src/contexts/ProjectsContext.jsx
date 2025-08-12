import { createContext, useContext, useState, useEffect } from 'react';

const ProjectsContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

const API_BASE_URL = 'https://backend.sinug.my.id/api';

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/categories`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Categories fetched:', data.data);
        setCategories(data.data || []);
        return data.data || [];
      } else {
        console.error('Failed to fetch categories:', data.error);
        return [];
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      return [];
    }
  };

  // Force refresh categories (useful after category operations)
  const refreshCategories = async () => {
    try {
      console.log('Refreshing categories...');
      const response = await fetch(`${API_BASE_URL}/projects/categories`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Categories refreshed successfully:', data.data);
        setCategories(data.data || []);
        return data.data || [];
      } else {
        console.error('Failed to refresh categories:', data.error);
        setCategories([]); // Clear categories if fetch fails
        return [];
      }
    } catch (err) {
      console.error('Error refreshing categories:', err);
      setCategories([]); // Clear categories if fetch fails
      return [];
    }
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/projects`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Projects fetched:', data.data?.length, 'projects');
        setProjects(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh both projects and categories
  const refreshAll = async () => {
    try {
      console.log('Refreshing all data (projects + categories)...');
      setIsLoading(true);
      await Promise.all([
        fetchProjects(),
        refreshCategories()
      ]);
      console.log('All data refreshed successfully');
    } catch (err) {
      console.error('Error refreshing all data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single project with images
  const fetchProject = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch project');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      throw err;
    }
  };

  // Load projects and categories on component mount
  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const addProject = async (projectData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh both projects and categories
        await refreshAll();
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error || 'Failed to create project' };
      }
    } catch (err) {
      console.error('Error creating project:', err);
      return { success: false, error: 'Failed to connect to server' };
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh both projects and categories
        await refreshAll();
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error || 'Failed to update project' };
      }
    } catch (err) {
      console.error('Error updating project:', err);
      return { success: false, error: 'Failed to connect to server' };
    }
  };

  const deleteProject = async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh both projects and categories
        await refreshAll();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to delete project' };
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      return { success: false, error: 'Failed to connect to server' };
    }
  };

  const value = {
    projects,
    categories,
    isLoading,
    error,
    fetchProjects,
    fetchCategories,
    refreshCategories,
    refreshAll,
    fetchProject,
    addProject,
    updateProject,
    deleteProject
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}; 