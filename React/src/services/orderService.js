import api from './api';

export const placeOrder = async (orderPayload) => {
  try {
    const response = await api.post('/api/orders/place-order', orderPayload);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error.response?.data?.message || 'Failed to place order. Please try again.';
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/details/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error.response?.data?.message || 'Failed to load order details.';
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get('/api/orders/all-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error.response?.data?.message || 'Failed to load orders.';
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/api/orders/update-status/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error.response?.data?.message || 'Failed to update order status.';
  }
};
