import api from './api';

export const getMenuItems = async () => {
  try {
    let response;
    try {
      response = await api.get('/api/menu/get-all');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        response = await api.get('/api/menu');
      } else {
        throw err;
      }
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error.response?.data?.message || 'Failed to load menu items.';
  }
};

export const createMenuItem = async (itemData) => {
  try {
    const isFormData = itemData instanceof FormData;
    const response = await api.post('/api/menu/add-item', itemData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error.response?.data?.message || 'Failed to create menu item.';
  }
};

export const updateMenuItem = async (id, itemData) => {
  try {
    const isFormData = itemData instanceof FormData;
    const response = await api.put(`/api/menu/update-item/${id}`, itemData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error.response?.data?.message || 'Failed to update menu item.';
  }
};

export const deleteMenuItem = async (id) => {
  try {
    const response = await api.delete(`/api/menu/delete-item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error.response?.data?.message || 'Failed to delete menu item.';
  }
};
