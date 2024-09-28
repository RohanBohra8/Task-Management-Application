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

export const assignTask = async (req, res) => {
    const { taskId, userId } = req.body; // Expecting taskId and userId in the request body

    try {
        // Check if the requesting user exists
        const requester = await User.findById(req.user.id);

        if (!requester) {
            return res.status(404).json({ message: 'Requester not found' });
        }

        // Check if the requesting user has the admin role
        if (!requester.role || !requester.role.includes('admin')) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.assignedUser = userId; // Assign the task to the specified user
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Server error aagya', error: error.message }); // Return the error message
    }
};


export const getTaskSummary = async (req, res) => {
    const { userId, status } = req.query; // Get filters from query parameters
    try {
        const match = {
            creator: req.user.id, // Only include tasks for the logged-in user
        };

        if (userId) {
            match.assignedUser = userId; // Filter by assigned user if provided
        }
        if (status) {
            match.status = status; // Filter by status if provided
        }

        const tasks = await Task.find(match);
        const summary = {
            totalTasks: tasks.length,
            tasksByStatus: {
                'To Do': tasks.filter(t => t.status === 'To Do').length,
                'In Progress': tasks.filter(t => t.status === 'In Progress').length,
                'Completed': tasks.filter(t => t.status === 'Completed').length,
            },
        };

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
