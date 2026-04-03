# todo-monorepo-app

A very simple Todo List with a React frontend and an Express backend. Run both with one command.

## Folder structure

```
todo-monorepo-app/
├── apps/
│   ├── frontend/     # React (Vite) — port 3000
│   └── backend/      # Express — port 5000
├── package.json      # Root: workspaces + `npm run dev`
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended) includes `npm`.

## Setup

1. Open a terminal in the project root (`todo-monorepo-app`).

2. Install all dependencies (root + workspaces):

   ```bash
   npm install
   ```

## Run (one command)

From the project root:

```bash
npm run dev
```

This starts:

- **Backend:** `http://localhost:5000` — REST API for todos
- **Frontend:** `http://localhost:3000` — open this URL in your browser

## API

| Method | Path           | Description        |
|--------|----------------|--------------------|
| GET    | `/todos`       | List all todos     |
| POST   | `/todos`       | Body: `{ "text": "..." }` |
| DELETE | `/todos/:id`   | Delete by id       |

Todos are stored **in memory** and reset when the server restarts.

## Scripts

| Location | Command      | Purpose              |
|----------|--------------|----------------------|
| Root     | `npm run dev`| Frontend + backend   |
| `apps/frontend` | `npm run dev` | Frontend only   |
| `apps/backend`  | `npm run dev` | Backend only    |
