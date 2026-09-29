import { createSlice } from '@reduxjs/toolkit';
import { getOrCreateSessionId } from '../../utils/session';

const SAVED_TABLE_KEY = 'bowl_brick_table_number';
const SAVED_ORDER_KEY = 'bowl_brick_latest_order_id';
const SAVED_CUSTOMER_INFO = 'bowl_brick_customer_info';

const initialTableNumber = localStorage.getItem(SAVED_TABLE_KEY) || '';
const initialOrderId = localStorage.getItem(SAVED_ORDER_KEY) || '';
const savedCustomer = JSON.parse(localStorage.getItem(SAVED_CUSTOMER_INFO) || '{}');

const initialState = {
  tableNumber: initialTableNumber,
  isTableModalOpen: !initialTableNumber,
  sessionId: getOrCreateSessionId(),
  latestOrderId: initialOrderId,
  customerName: savedCustomer.name || '',
  customerMobile: savedCustomer.mobile || '',
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setTableNumber: (state, action) => {
      state.tableNumber = action.payload;
      if (action.payload) {
        localStorage.setItem(SAVED_TABLE_KEY, action.payload);
        state.isTableModalOpen = false;
      } else {
        localStorage.removeItem(SAVED_TABLE_KEY);
      }
    },
    openTableModal: (state) => {
      state.isTableModalOpen = true;
    },
    closeTableModal: (state) => {
      if (state.tableNumber) {
        state.isTableModalOpen = false;
      }
    },
    setLatestOrderId: (state, action) => {
      state.latestOrderId = action.payload;
      if (action.payload) {
        localStorage.setItem(SAVED_ORDER_KEY, action.payload);
      } else {
        localStorage.removeItem(SAVED_ORDER_KEY);
      }
    },
    saveCustomerDetails: (state, action) => {
      const { name, mobile } = action.payload;
      state.customerName = name;
      state.customerMobile = mobile;
      localStorage.setItem(SAVED_CUSTOMER_INFO, JSON.stringify({ name, mobile }));
    },
  },
});

export const {
  setTableNumber,
  openTableModal,
  closeTableModal,
  setLatestOrderId,
  saveCustomerDetails,
} = customerSlice.actions;

export default customerSlice.reducer;
