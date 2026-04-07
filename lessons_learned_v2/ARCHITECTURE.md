# ARCHITECTURE

## General principles

- Always prefer simple and pragmatic solutions.
- Avoid over-engineering, especially in early stages.
- Architecture decisions must be justified by real needs.

## MVC

- Use a lightweight MVC structure whenever it improves:
  - readability
  - separation of concerns
  - maintainability
  - testability

- MVC is the default approach for this project.

- For small applications:
  - use pragmatic MVC (no unnecessary layers or abstractions)

- If MVC does not make sense:
  - it must be explicitly discussed before implementation

## Separation of logic

- Business logic must be separated from UI (DOM).
- Model layer should contain pure functions only.
- Model must be fully unit-testable.

## Testing alignment

- Architecture must support unit testing from the beginning.
- Avoid tightly coupling logic with UI.
- Prefer small, deterministic functions.

## Security

- Apply "shift left" principle:
  - think about security early
  - validate inputs
  - avoid unsafe patterns

