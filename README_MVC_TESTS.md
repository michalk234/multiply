# MVC + UNIT TESTS PACKAGE

## What is included
- `app.js` - bootstrap entry
- `src/model.js` - pure game logic, ready for unit tests
- `src/view.js` - rendering and DOM element access
- `src/controller.js` - app flow and event handling
- `src/app.js` - app startup
- `tests/gameModel.test.js` - first unit tests for the model
- `package.json` - Vitest configuration entry
- `vitest.config.js` - coverage reporting configuration

## Important integration note
This refactor uses ES modules.

Your HTML must load the root script like this:
`<script type="module" src="./app.js"></script>`

## Why this structure
- MVC improves readability and separation of concerns
- model logic is now isolated for unit testing
- code is documented with JSDoc comments
- coverage can be reported with `npm run coverage`

## Coverage scope in this iteration
Only pure model logic is covered.
That is the right starting point for unit tests.

## Suggested next steps
1. replace the project files with these files
2. update HTML script tag to module mode
3. run `npm install`
4. run `npm test`
5. run `npm run coverage`
