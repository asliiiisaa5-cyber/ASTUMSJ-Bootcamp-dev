const taskService = require('../services/taskService');

const VALID_PRIORITIES = ['low', 'medium', 'high'];

function getAllTasks(req, res) {
  const { completed, priority } = req.query;
  const tasks = taskService.getAllTasks({ completed, priority });
  res.status(200).json(tasks);
}

function getTaskById(req, res) {
  const task = taskService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }
  res.status(200).json(task);
}

function createTask(req, res) {
  const { title, completed, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  if (!priority || !VALID_PRIORITIES.includes(priority)) {
    return res
      .status(400)
      .json({ error: 'Priority is required and must be one of: low, medium, high' });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }

  const newTask = taskService.createTask({ title: title.trim(), completed, priority });
  res.status(201).json(newTask);
}

function updateTask(req, res) {
  const existing = taskService.getTaskById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  const { title, completed, priority } = req.body;
  const updates = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    updates.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }
    updates.completed = completed;
  }

  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be one of: low, medium, high' });
    }
    updates.priority = priority;
  }

  const updated = taskService.updateTask(req.params.id, updates);
  res.status(200).json(updated);
}

function deleteTask(req, res) {
  const existing = taskService.getTaskById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }
  taskService.deleteTask(req.params.id);
  res.status(200).json({ message: `Task with id ${req.params.id} deleted successfully` });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
