// controller.js

import { focusNextButton } from './view.js';

export function handleAnswerSubmission(isCorrect) {
  // existing logic...

  // after showing feedback
  focusNextButton();
}
