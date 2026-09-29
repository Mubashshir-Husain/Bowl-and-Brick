import api from './api';

export const adminLogin = async ({ email, password }) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error.response?.data?.message || 'Login failed. Please check credentials.';
  }
};

export const adminRegister = async ({ name, email, password }) => {
  try {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Admin register error:', error);
    throw error.response?.data?.message || 'Registration failed.';
  }
};
