---
description: REST conventions for the HTTP layer
globs: src/api/**
---
# API design rules (src/api only)
- Version every route under /v1. Use plural resource nouns: /v1/tasks.
- Validate the request body/params with Zod at the top of the handler.
- Controllers stay thin: parse -> call a service -> map to a DTO.
- Return DTOs, never raw Prisma models (no leaking internal columns).
- Use correct status codes: 200/201/204, 400 validation, 404 missing,
409 conflict. Errors go through the central error handler.