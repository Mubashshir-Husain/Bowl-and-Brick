export const validateCheckoutForm = ({ customerName, customerMobile, tableNumber, cartItems }) => {
  const errors = {};

  if (!customerName || !customerName.trim()) {
    errors.customerName = 'Customer name is required';
  }

  if (!customerMobile || !customerMobile.trim()) {
    errors.customerMobile = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(customerMobile.trim().replace(/\s+/g, ''))) {
    errors.customerMobile = 'Please enter a valid 10-digit mobile number';
  }

  if (!tableNumber || !tableNumber.toString().trim()) {
    errors.tableNumber = 'Table number is required';
  }

  if (!cartItems || cartItems.length === 0) {
    errors.cart = 'Your cart is empty. Please add items before placing an order.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
