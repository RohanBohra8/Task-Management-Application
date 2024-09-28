import Task from '../models/Task.js';
import User from '../models/User.js';

// Create a new task
export const createTask = async (req, res) => {
    const { title, description, dueDate, status, assignedUser, priority } = req.body;

    try {
        const task = new Task({
            title,
            description,
            dueDate,
            status,
            assignedUser,
            priority,
            creator: req.user.id, // Use the logged-in user's ID
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ creator: req.user.id }).populate('assignedUser', 'name');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;

    try {
        const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
