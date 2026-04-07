/**
 * Controller layer for the multiplication table app.
 * Simplified focus handling (no timers, no global listeners).
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

export class GameController {
  constructor(app) {
    this.app = app;
    this.state = createInitialState();
    this.nextQuestionTimeout = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
  }

  init() {
    this.renderStart();
  }

  renderStart() {
    this.clearNextQuestionTimeout();
    renderStartView(this.app);

    getLevelButtons().forEach((button) => {
      button.addEventListener("click", () => {
        this.startGame(Number(button.dataset.max));
      });
    });
  }

  startGame(max) {
    this.state = createInitialState(max);
    this.state.startTime = Date.now();
    this.state.questions = buildQuestionPool(max);
    this.nextQuestion();
  }

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

  attachInputHandlers() {
    const input = getAnswerInput();
    if (!input) return;

    input.addEventListener("keydown", this.handleKeyDown);
    input.addEventListener("input", this.handleInput);

    const submitButton = getSubmitButton();
    if (submitButton) {
      submitButton.addEventListener("click", this.checkAnswer);
    }
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.checkAnswer();
    }
  }

  handleInput(event) {
    const target = event.target;
    target.value = sanitizeNumericValue(target.value);
  }

  ensureAnswerFocus() {
    const input = getAnswerInput();
    if (!input || input.disabled) return;

    input.focus();
    const length = input.value.length;
    input.setSelectionRange(length, length);
  }

  clearNextQuestionTimeout() {
    if (this.nextQuestionTimeout) {
      clearTimeout(this.nextQuestionTimeout);
      this.nextQuestionTimeout = null;
    }
  }

  checkAnswer() {
    const input = getAnswerInput();
    const submitButton = getSubmitButton();

    if (!input || input.disabled || !this.state.current) return;

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

    if (submitButton) submitButton.disabled = true;

    this.nextQuestionTimeout = setTimeout(() => {
      this.nextQuestion();
    }, QUESTION_DELAY_MS);
  }

  showResults() {
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
