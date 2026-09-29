import express from 'express';
import { Router } from 'express';
import { getRestaurantInfo, updateRestaurantInfo } from '../controllers/restaurantController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public route for customer UI and AI
router.get('/info', getRestaurantInfo);

// Protected route for Admin
router.put('/update-info', protectAdmin, updateRestaurantInfo);

export default router;