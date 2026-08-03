const tasks = require('../data/taskData');

// Auto-increment id based on existing data
let nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

function getAllTasks(filters = {}) {
  let result = tasks;

  if (filters.completed !== undefined) {
    const completedBool = filters.completed === 'true';
    result = result.filter((t) => t.completed === completedBool);
  }

  if (filters.priority) {
    result = result.filter((t) => t.priority === filters.priority);
  }

  return result;
}

function getTaskById(id) {
  return tasks.find((t) => t.id === Number(id));
}

function createTask({ title, completed, priority }) {
  const newTask = {
    id: nextId++,
    title,
    completed: completed ?? false,
    priority,
  };
  tasks.push(newTask);
  return newTask;
}

function updateTask(id, updates) {
  const task = getTaskById(id);
  if (!task) return null;
  Object.assign(task, updates);
  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === Number(id));
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
