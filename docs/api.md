# TaskFlow API reference

All routes are versioned under `/v1`. Requests and responses are JSON.
Successful responses wrap payloads in a `data` field; errors return
`{ "error": { "message": string } }` with an appropriate status code.

Auth is a workshop placeholder (`src/middleware/auth.ts`): any (or no) bearer
token is accepted and a stub user is attached.

## Health

### `GET /v1/health`

Returns `{ "status": "ok" }`.

## Projects

### `GET /v1/projects`

List all projects, newest first.

```json
{ "data": [{ "id": "…", "name": "…", "createdAt": "…", "updatedAt": "…" }] }
```

### `POST /v1/projects`

Create a project.

| Field  | Type   | Rules            |
| ------ | ------ | ---------------- |
| `name` | string | required, 1–120  |

Returns `201` with the created project DTO.

## Tasks

### `GET /v1/tasks`

List tasks, newest first. Optional query filters:

| Query       | Type                            | Notes            |
| ----------- | ------------------------------- | ---------------- |
| `projectId` | string                          | filter by project|
| `status`    | `todo` \| `in_progress` \| `done` | filter by status |

```json
{
  "data": [
    {
      "id": "…",
      "title": "…",
      "description": null,
      "status": "todo",
      "projectId": "…",
      "completedAt": null,
      "createdAt": "…",
      "updatedAt": "…"
    }
  ]
}
```

### `POST /v1/tasks`

Create a task.

| Field         | Type                              | Rules              |
| ------------- | --------------------------------- | ------------------ |
| `title`       | string                            | required, 1–200    |
| `description` | string                            | optional, ≤ 2000   |
| `status`      | `todo` \| `in_progress` \| `done` | optional (`todo`)  |
| `projectId`   | string                            | required           |

Returns `201` with the created task DTO.

## Comments

### `GET /v1/comments?taskId=…`

List comments for a task, oldest first. `taskId` is required.

### `POST /v1/comments`

Create a comment.

| Field    | Type   | Rules           |
| -------- | ------ | --------------- |
| `taskId` | string | required        |
| `body`   | string | required, 1–2000|

Returns `201` with the created comment DTO.
