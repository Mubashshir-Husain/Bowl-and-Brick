import api from './api';

export const getRestaurantInfo = async () => {
  try {
    const response = await api.get('/api/restaurant/info');
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant info:', error);
    throw error.response?.data?.message || 'Failed to fetch restaurant information.';
  }
};

export const updateRestaurantInfo = async (infoData) => {
  try {
    const response = await api.put('/api/restaurant/update-info', infoData);
    return response.data;
  } catch (error) {
    console.error('Error updating restaurant info:', error);
    throw error.response?.data?.message || 'Failed to update restaurant information.';
  }
};
