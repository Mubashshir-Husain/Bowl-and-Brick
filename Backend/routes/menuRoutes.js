import express from 'express';
import { Router } from 'express';
import { getMenuItems, createMenuItem, deleteMenuItem, updateMenuItem } from '../controllers/menuController.js';
import {protectAdmin} from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = Router();

// Endpoint: GET /api/menu/get-all
router.get('/get-all', getMenuItems);

// Endpoint: POST /api/menu/add-item
router.post('/add-item', protectAdmin, upload.single('image'), createMenuItem);

// Endpoint: DELETE /api/menu/delete-item/:id
router.delete('/delete-item/:id', protectAdmin, deleteMenuItem);

// Endpoint: PUT /api/menu/update-item/:id
router.put('/update-item/:id', protectAdmin, upload.single('image'), updateMenuItem);

export default router;