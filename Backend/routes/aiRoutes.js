import express from 'express';
import { Router } from 'express';
import { chatWithAI } from '../controllers/aiController.js';


const router = Router();

// Public route for customers to chat
router.post('/chat', chatWithAI);

export default router;