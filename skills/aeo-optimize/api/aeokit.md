# AeoKit workflow

Prefer configured AeoKit MCP tools generated from the runtime's `/openapi.json`. Resolve the exact project before reading prompts, runs, citations, opportunities, and experiments.

Use `GET /api/projects/{projectId}/experiments` to recover lifecycle state, `POST /api/projects/{projectId}/experiments` to record an authorized hypothesis and baseline, and `PATCH /api/experiments/{experimentId}` to attach follow-up observations or record an outcome. Inspect the live OpenAPI schema rather than inventing fields.

Starting provider runs can spend money. Creating or updating an experiment changes AeoKit state. Require explicit authorization at the point of either action, and never expose `AEOKIT_API_KEY`.
