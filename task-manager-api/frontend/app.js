const API_URL = 'http://localhost:5000/api/tasks';

const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const priorityInput = document.getElementById('priority');
const priorityFilter = document.getElementById('priority-filter');
const statusFilter = document.getElementById('status-filter');
const errorMessage = document.getElementById('error-message');

function showError(message) {
  errorMessage.textContent = message;
  setTimeout(() => (errorMessage.textContent = ''), 4000);
}

function buildQuery() {
  const params = new URLSearchParams();
  if (priorityFilter.value) params.append('priority', priorityFilter.value);
  if (statusFilter.value) params.append('completed', statusFilter.value);
  const query = params.toString();
  return query ? `${API_URL}?${query}` : API_URL;
}

async function fetchTasks() {
  try {
    const res = await fetch(buildQuery());
    if (!res.ok) throw new Error('Failed to load tasks');
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    showError(err.message);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<li>No tasks found.</li>';
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-checkbox" />
      <span class="title">${escapeHtml(task.title)}</span>
      <span class="badge ${task.priority}">${task.priority}</span>
      <button class="delete-btn" data-id="${task.id}" title="Delete task">✕</button>
    `;

    taskList.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function createTask(title, priority) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create task');
    return data;
  } catch (err) {
    showError(err.message);
    return null;
  }
}

// Bonus: toggle completed
async function toggleTask(id, completed) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error('Failed to update task');
  } catch (err) {
    showError(err.message);
  }
}

// Bonus: delete from UI
async function deleteTask(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
  } catch (err) {
    showError(err.message);
  }
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const priority = priorityInput.value;

  if (!title || !priority) {
    showError('Title and priority are required');
    return;
  }

  const created = await createTask(title, priority);
  if (created) {
    titleInput.value = '';
    priorityInput.value = '';
    fetchTasks();
  }
});

taskList.addEventListener('change', async (e) => {
  if (e.target.classList.contains('toggle-checkbox')) {
    const id = e.target.dataset.id;
    await toggleTask(id, e.target.checked);
    fetchTasks();
  }
});

taskList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    await deleteTask(id);
    fetchTasks();
  }
});

priorityFilter.addEventListener('change', fetchTasks);
statusFilter.addEventListener('change', fetchTasks);

// Initial load
fetchTasks();
