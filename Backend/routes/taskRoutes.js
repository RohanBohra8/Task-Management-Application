import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import authentication middleware

const router = express.Router();

// Protect these routes
router.use(protect);

// Task routes
router.post('/', createTask); // Create a new task
router.get('/', getTasks); // Get all tasks
router.put('/:taskId', updateTask); // Update a task
router.delete('/:taskId', deleteTask); // Delete a task

export default router;
