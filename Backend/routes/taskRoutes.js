import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, assignTask, getTaskSummary } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import authentication middleware

const router = express.Router();

// Protect these routes
router.use(protect);

// Task routes
router.post('/', createTask); // Create a new task
router.get('/', getTasks); // Get all tasks
router.put('/:taskId', updateTask); // Update a task
router.delete('/:taskId', deleteTask); // Delete a task
router.put('/assign', assignTask); // Assign a task to a user
router.get('/summary', getTaskSummary); // Get task summary report

export default router;
