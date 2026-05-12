# Working Conventions for Claude Code

These rules govern how you work on this project. Follow them on every task unless I explicitly override.

## Workflow

- For non-trivial changes (multi-file, unfamiliar code, uncertain approach): enter plan mode. Explore the relevant files, produce a written plan, wait for confirmation, then implement.
- For trivial changes (one-line fixes, renames, typos, log statements, obvious refactors): skip planning and act directly.
- After implementing: run tests, type-check, and lint. Fix failures before reporting completion.
- Commit with descriptive messages. Do not add `Co-Authored-By` or attribution lines unless explicitly asked.

## Core principles

- **Simplicity first.** Make every change as small and direct as possible. No speculative abstraction, no over-engineering.
- **Root cause over symptom.** Do not suppress errors, mock around problems, or apply temporary fixes. Find the actual cause and address it.
- **Minimal impact.** Only touch what the task requires. Do not refactor adjacent code unless asked.
- **Match existing patterns.** Read nearby code before writing new code. Imitate the project's conventions for naming, structure, error handling, and testing.

## Verification (highest leverage)

- Every non-trivial task needs a concrete success criterion: a test that passes, a command that succeeds, output that matches expected.
- Write or update tests for new behavior. For bugs: write a failing test that reproduces the issue, then fix it.
- Never claim a task is done without actually running the verification.
- For UI changes, capture the result and compare against the intended design.

## Context discipline

- Use subagents for investigations that require reading many files. Return a summary to the main session, not raw file contents.
- Do not read files speculatively. Read what the current task needs and nothing more.
- For large tasks, break the work into sub-tasks with intermediate checkpoints rather than one long pass.

## Communication

- When I ask a question, answer it. Do not start implementing unless I ask you to.
- Pause and confirm before destructive operations: deleting files, rewriting modules, schema changes, force-pushing, mass renames.
- Report progress in plain summaries: what changed, what was verified, what remains.
- If a request is ambiguous, ask one targeted clarifying question rather than guessing.

## Code style

- Prefer small, single-purpose functions with clear names over clever one-liners.
- Prefer composition and explicit named modules over deep inheritance or hidden indirection.
- Make it correct, then readable, then fast — and only optimize when profiling demands it.
- Comments explain *why*, not *what*. Self-explanatory code over commented code.

## What not to do

- Do not generate placeholder implementations, fake data, or stub returns just to make tests pass.
- Do not add dependencies without checking what is already in use.
- Do not bypass the type system (`any`, `# type: ignore`, `@ts-ignore`, etc.) without a comment explaining why.
- Do not bypass linter rules or commit broken state.
- Do not write to files outside the project root without asking.

## Failure recovery

- If the same issue is corrected twice without success, stop. Summarize what was tried, what failed, and the suspected root cause.
- Prefer asking for a sharper task definition over making a third attempt with the same approach.

---

## Project-specific

<!-- Fill these in per project. Delete sections that don't apply. Keep this section tight — every line should be something Claude could not infer from the code. -->

### Commands
- Build: `<command>`
- Test: `<command>` (prefer running single tests, not full suite, for performance)
- Lint: `<command>`
- Type-check: `<command>`

### Conventions
- <e.g., "Use ES modules, not CommonJS">
- <e.g., "All API routes go in `src/routes/`; follow the pattern in `users.ts`">

### Gotchas
- <e.g., "Database migrations require `DATABASE_URL` to be set; check `.env.example`">
