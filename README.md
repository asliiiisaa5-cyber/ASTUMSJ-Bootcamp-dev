# Task Manager REST API

A full-stack Task Manager built with Node.js, Express, and vanilla JS, following an MVC structure.

## Project Structure

```
task-manager-api/
├── backend/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── config/env.js
│   ├── data/taskData.js
│   ├── services/taskService.js
│   ├── controllers/taskController.js
│   └── routes/taskRoutes.js
└── frontend/
    ├── index.html
    ├── style.css
    └── app.js
```

## Task Model

```json
{
  "id": 1,
  "title": "Finish lecture 2 homework",
  "completed": false,
  "priority": "high"
}
```

- `id`: auto-generated (number)
- `title`: required, non-empty string
- `completed`: boolean, defaults to `false`
- `priority`: required, one of `low` | `medium` | `high`

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

The server starts on the port defined in `.env` (default `5000`). You should see:

```
Task Manager API running on http://localhost:5000
```

### Frontend

Just open `frontend/index.html` in your browser (or serve it with any static server, e.g. `npx serve frontend`). Make sure the backend is running first, since the frontend calls `http://localhost:5000/api/tasks`.

## Environment Variables (`backend/.env`)

```
PORT=5000
APP_NAME=Task Manager API
```

## API Endpoints

| Method | Route             | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | /api/tasks        | Get all tasks (supports filters)     |
| GET    | /api/tasks/:id    | Get a single task by id              |
| POST   | /api/tasks        | Create a new task                    |
| PATCH  | /api/tasks/:id    | Update an existing task              |
| DELETE | /api/tasks/:id    | Delete a task                        |

### Filtering (bonus)

`GET /api/tasks?priority=high`
`GET /api/tasks?completed=true`
`GET /api/tasks?priority=low&completed=false`

### Example requests

**Create a task**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write README","priority":"medium"}'
```

**Toggle completed (bonus)**
```bash
curl -X PATCH http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

**Delete a task**
```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

## Error Handling

- `400 Bad Request` — missing/invalid `title` or `priority` on create/update
- `404 Not Found` — task id doesn't exist, or unknown route
- `500 Internal Server Error` — unexpected server errors (caught by global error handler)

## Middleware

- `cors()` — allows the frontend (served from a different origin/port) to call the API
- `express.json()` — parses JSON request bodies
- Custom 404 handler for unmatched routes
- Custom global error handler

## Bonus Features Implemented

- ✅ Toggle completed (checkbox in the UI, `PATCH` request)
- ✅ Filtering with query params (`priority`, `completed`)
- ✅ Delete from UI
- ⬜ Deploy online (not included — can be deployed to Render/Railway/Vercel as a next step)

## Troubleshooting

- Run `npm install` inside `backend/` if you see "module not found" errors.
- If port `5000` is already in use, change `PORT` in `.env`.
- Double-check `require()` paths if you move files around.
- Open the browser console to check for fetch/CORS errors if the frontend can't reach the API.
