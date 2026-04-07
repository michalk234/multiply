/**
 * Controller layer for the multiplication table app.
 * This file coordinates model, view, DOM events, focus handling and round flow.
 */

import {
  TOTAL_QUESTIONS,
  buildQuestionPool,
  createInitialState,
  formatElapsedTime,
  getCurrentQuestion,
  getProgressPercent,
  getScorePercent,
  isAnswerCorrect,
  sanitizeNumericValue
} from "./model.js";
import {
  getAnswerInput,
  getLevelButtons,
  getPlayAgainButton,
  getSubmitButton,
  renderQuestionView,
  renderResultsView,
  renderStartView,
  showCorrectAnswerStatus,
  showWrongAnswerStatus
} from "./view.js";

const QUESTION_DELAY_MS = 1100;
const FOCUS_KEEPER_INTERVAL_MS = 300;

export class GameController {
  /**
   * @param {HTMLElement} app
   */
  constructor(app) {
    this.app = app;
    this.state = createInitialState();
    this.focusInterval = null;
    this.nextQuestionTimeout = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.ensureAnswerFocus = this.ensureAnswerFocus.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
  }

  /**
   * Start the controller.
   */
  init() {
    this.renderStart();
  }

  /**
   * Render the start screen and attach start screen events.
   */
  renderStart() {
    this.stopFocusKeeper();
    this.clearNextQuestionTimeout();
    renderStartView(this.app);

    getLevelButtons().forEach((button) => {
      button.addEventListener("click", () => {
        this.startGame(Number(button.dataset.max));
      });
    });
  }

  /**
   * Start a new game.
   * @param {number} max
   */
  startGame(max) {
    this.state = createInitialState(max);
    this.state.startTime = Date.now();
    this.state.questions = buildQuestionPool(max);
    this.nextQuestion();
  }

  /**
   * Render the next question or finish the game.
   */
  nextQuestion() {
    this.clearNextQuestionTimeout();

    if (this.state.count >= TOTAL_QUESTIONS) {
      this.showResults();
      return;
    }

    this.state.current = getCurrentQuestion(this.state);
    const progress = getProgressPercent(this.state.count);

    renderQuestionView(this.app, this.state, TOTAL_QUESTIONS, progress);
    this.attachInputHandlers();
    this.ensureAnswerFocus();
  }

  /**
   * Attach handlers for the current question view.
   */
  attachInputHandlers() {
    const input = getAnswerInput();
    if (!input) {
      return;
    }

    input.addEventListener("keydown", this.handleKeyDown);
    input.addEventListener("input", this.handleInput);

    const submitButton = getSubmitButton();
    if (submitButton) {
      submitButton.addEventListener("click", this.checkAnswer);
    }

    const focusEvents = ["click", "touchstart", "pointerdown"];
    focusEvents.forEach((eventName) => {
      document.addEventListener(eventName, this.ensureAnswerFocus, true);
    });

    this.startFocusKeeper();
  }

  /**
   * Handle Enter key submit.
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.checkAnswer();
    }
  }

  /**
   * Sanitize answer input to digits only.
   * @param {Event} event
   */
  handleInput(event) {
    const target = /** @type {HTMLInputElement} */ (event.target);
    target.value = sanitizeNumericValue(target.value);
  }

  /**
   * Keep focus in the answer input.
   */
  ensureAnswerFocus() {
    const input = getAnswerInput();
    if (!input || input.disabled) {
      this.stopFocusKeeper();
      return;
    }

    if (document.activeElement !== input) {
      input.focus({ preventScroll: true });
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  }

  /**
   * Start the focus keeper interval.
   */
  startFocusKeeper() {
    this.stopFocusKeeper();

    this.focusInterval = window.setInterval(() => {
      this.ensureAnswerFocus();
    }, FOCUS_KEEPER_INTERVAL_MS);
  }

  /**
   * Stop focus interval and focus-capture listeners.
   */
  stopFocusKeeper() {
    if (this.focusInterval) {
      window.clearInterval(this.focusInterval);
      this.focusInterval = null;
    }

    const focusEvents = ["click", "touchstart", "pointerdown"];
    focusEvents.forEach((eventName) => {
      document.removeEventListener(eventName, this.ensureAnswerFocus, true);
    });
  }

  /**
   * Clear delayed transition to the next question.
   */
  clearNextQuestionTimeout() {
    if (this.nextQuestionTimeout) {
      window.clearTimeout(this.nextQuestionTimeout);
      this.nextQuestionTimeout = null;
    }
  }

  /**
   * Check the current answer and update the state.
   */
  checkAnswer() {
    const input = getAnswerInput();
    const submitButton = getSubmitButton();

    if (!input || input.disabled || !this.state.current) {
      return;
    }

    const value = input.value.trim();
    if (!value) {
      this.ensureAnswerFocus();
      return;
    }

    const numericAnswer = Number(value);

    if (isAnswerCorrect(value, this.state.current.answer)) {
      this.state.correct += 1;
      showCorrectAnswerStatus();
    } else {
      showWrongAnswerStatus(numericAnswer, this.state.current.answer);
    }

    this.state.count += 1;
    input.disabled = true;

    if (submitButton) {
      submitButton.disabled = true;
    }

    this.stopFocusKeeper();
    this.nextQuestionTimeout = window.setTimeout(() => {
      this.nextQuestion();
    }, QUESTION_DELAY_MS);
  }

  /**
   * Render the final result screen.
   */
  showResults() {
    this.stopFocusKeeper();
    this.clearNextQuestionTimeout();

    const time = formatElapsedTime(this.state.startTime, Date.now());
    const percent = getScorePercent(this.state.correct);

    renderResultsView(this.app, this.state, TOTAL_QUESTIONS, percent, time);

    const playAgainButton = getPlayAgainButton();
    if (playAgainButton) {
      playAgainButton.addEventListener("click", () => {
        this.renderStart();
      });
    }
  }
}
