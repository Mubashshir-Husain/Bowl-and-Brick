import express from 'express';
import { Router } from 'express';
import { createOrder, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import {protectAdmin} from '../middleware/authMiddleware.js';

const router = Router();

// Endpoint: POST /api/orders/place-order
router.post('/place-order', createOrder);

// Endpoint: GET /api/orders/details/:id
router.get('/details/:id', getOrderById);


// Endpoint: PATCH /api/orders/update-status/:id
router.patch('/update-status/:id', protectAdmin, updateOrderStatus);

router.get('/all-orders', protectAdmin, getAllOrders);

export default router;