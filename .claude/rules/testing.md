---
paths:
 - "**/*.test.ts"
 - "**/*.test.js"
 - "vitest.config.ts"
---

# Testing

## What earns a test
- Anything that is not trivial: branching, transformation, normalization, invariants.
- Anything that prevents a regression: every bug fix comes with the test that would have caught it.
- Anything beyond simple CRUD: authorization, validation, cross-store behavior, lint rules.

A thin wrapper that passes values straight to the database gets no unit test; the types and the smoke checks cover it.

## How tests read
- Name each test after the behavior it protects (`answers 404, not 403, when the profile is not a member`). When the reason is not obvious from the name, add a one-line comment above the test saying what would break without it.
- One top-level `describe` per module and one nested `describe` per public function or behavior.
- Cover the happy path, every early return, invalid input, authorization failures, and dependency failures.

## Mechanics
- Vitest runs from the repo root (`npm test`, config in `vitest.config.ts`). Tests sit next to the code as `<name>.test.ts`.
- Unit tests never open a database connection. Mock the service or client module with `vi.mock(...)` before importing code that reads `env.ts`, and reset mocks with `vi.clearAllMocks()` in `beforeEach`.
- Use `vi.mocked(fn)` for typed mocks instead of broad casts.
- Lint rules in `eslint/` are tested with ESLint's `RuleTester` in `eslint/rules.test.js`.
- Run the focused test first, then `npm test` and `npm run typecheck`.
