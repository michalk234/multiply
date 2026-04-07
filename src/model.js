/**
 * Pure game model for the multiplication table app.
 * This file contains only data structures and business logic.
 * It does not access DOM APIs, which makes it suitable for unit testing.
 */

export const TOTAL_QUESTIONS = 10;

/**
 * Create a fresh game state.
 * @param {number} max - Maximum allowed multiplication result.
 * @returns {{
 *   max: number,
 *   count: number,
 *   correct: number,
 *   startTime: number | null,
 *   current: {a:number,b:number,answer:number} | null,
 *   questions: Array<{a:number,b:number,answer:number}>
 * }}
 */
export function createInitialState(max = 30) {
  return {
    max,
    count: 0,
    correct: 0,
    startTime: null,
    current: null,
    questions: []
  };
}

/**
 * Check whether a multiplication task is allowed for the selected level.
 * @param {number} a
 * @param {number} b
 * @param {number} max
 * @returns {boolean}
 */
export function isTaskAllowed(a, b, max) {
  return a * b <= max;
}

/**
 * Check whether the provided answer is correct.
 * @param {string | number} userAnswer
 * @param {number} correctAnswer
 * @returns {boolean}
 */
export function isAnswerCorrect(userAnswer, correctAnswer) {
  return Number(userAnswer) === correctAnswer;
}

/**
 * Remove all non-digit characters from user input.
 * @param {string} value
 * @returns {string}
 */
export function sanitizeNumericValue(value) {
  return String(value).replace(/[^0-9]/g, "");
}

/**
 * Build a pool of all allowed multiplication questions for the selected max result.
 * @param {number} max
 * @returns {Array<{a:number,b:number,answer:number}>}
 */
export function buildQuestionPool(max) {
  const pool = [];

  for (let a = 1; a <= 10; a += 1) {
    for (let b = 1; b <= 10; b += 1) {
      const answer = a * b;
      if (isTaskAllowed(a, b, max)) {
        pool.push({ a, b, answer });
      }
    }
  }

  return shuffle([...pool]).slice(0, TOTAL_QUESTIONS);
}

/**
 * Return a shuffled copy of the provided array.
 * @template T
 * @param {T[]} items
 * @returns {T[]}
 */
export function shuffle(items) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/**
 * Get the current question from the state.
 * @param {{
 *   questions: Array<{a:number,b:number,answer:number}>,
 *   count: number
 * }} state
 * @returns {{a:number,b:number,answer:number} | null}
 */
export function getCurrentQuestion(state) {
  return state.questions[state.count] ?? null;
}

/**
 * Calculate the progress percentage before answering the current question.
 * @param {number} count
 * @returns {number}
 */
export function getProgressPercent(count) {
  return (count / TOTAL_QUESTIONS) * 100;
}

/**
 * Calculate the score percent for the finished round.
 * @param {number} correct
 * @returns {number}
 */
export function getScorePercent(correct) {
  return Math.round((correct / TOTAL_QUESTIONS) * 100);
}

/**
 * Format elapsed time in seconds with one decimal place.
 * @param {number} startTime
 * @param {number} endTime
 * @returns {string}
 */
export function formatElapsedTime(startTime, endTime) {
  return ((endTime - startTime) / 1000).toFixed(1);
}
