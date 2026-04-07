# DEVGUIDE

This document defines HOW we build software.

## Principles
- Keep architecture simple (pragmatic MVC)
- Prefer readability over cleverness
- Ensure separation of concerns
- Keep Model independent from DOM
- Think about testability first
- MVC is preferred but not mandatory — if skipped, it must be discussed
- Avoid unnecessary architectural changes
- Refactor should be minimal and justified

## Workflow
- NEVER require copy-paste of code
- ALWAYS deliver ready-to-use files for git replacement
- Deliver COMPLETE working sets when architecture changes
- Work in small, working iterations

## Code Documentation
- Code must always be documented
- Each function should explain:
  - purpose
  - inputs
  - outputs
- Code should be readable without execution

## Testing
- Always write tests for business logic
- Maintain test coverage
- Track coverage using Vitest
- Include coverage reports when discussing tests
- Structure code to allow unit testing
- Separate logic from UI (DOM)
- Focus on testing model/business logic first

## Lessons Learned
- Keep files small and modular
- Avoid over-engineering
- Always align documentation with actual code
- Prefer simple structures for small apps

## Commits
- Always include commit description when delivering code
- Provide:
  - short commit message (1 line)
  - full extended description (multi-line)
- Commit descriptions must be in English
