/**
 * Controller layer for the multiplication table app.
 * - Focus moves to Next button after answer
 * - Enter works for both submit and next
 * - Exit button supported
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

export class GameController {
  constructor(app) {
    this.app = app;
    this.state = createInitialState();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
  }

  init() {
    this.renderStart();
  }

  renderStart() {
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
    if (this.state.count >= TOTAL_QUESTIONS) {
      this.showResults();
      return;
    }

    this.state.current = getCurrentQuestion(this.state);
    const progress = getProgressPercent(this.state.count);

    renderQuestionView(this.app, this.state, TOTAL_QUESTIONS, progress);
    this.attachHandlers();
    this.focusInput();
  }

  attachHandlers() {
    const input = getAnswerInput();
    if (input) {
      input.addEventListener("keydown", this.handleKeyDown);
      input.addEventListener("input", this.handleInput);
    }

    const submit = getSubmitButton();
    if (submit) {
      submit.addEventListener("click", this.checkAnswer);
    }

    const exitBtn = document.getElementById("exit-btn");
    if (exitBtn) {
      exitBtn.addEventListener("click", () => this.renderStart());
    }
  }

  handleKeyDown(event) {
    const input = getAnswerInput();
    const nextBtn = document.getElementById("next-btn");

    if (event.key === "Enter") {
      if (input && input.disabled && nextBtn) {
        nextBtn.click();
        return;
      }

      event.preventDefault();
      this.checkAnswer();
    }
  }

  handleInput(event) {
    const target = event.target;
    target.value = sanitizeNumericValue(target.value);
  }

  focusInput() {
    const input = getAnswerInput();
    if (!input) return;

    input.focus();
    const len = input.value.length;
    input.setSelectionRange(len, len);
  }

  checkAnswer() {
    const input = getAnswerInput();
    const submit = getSubmitButton();

    if (!input || input.disabled || !this.state.current) return;

    const value = input.value.trim();
    if (!value) {
      this.focusInput();
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
    if (submit) submit.disabled = true;

    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
      nextBtn.style.display = "block";
      nextBtn.focus();
      nextBtn.addEventListener("click", () => this.nextQuestion());
    }
  }

  showResults() {
    const time = formatElapsedTime(this.state.startTime, Date.now());
    const percent = getScorePercent(this.state.correct);

    renderResultsView(this.app, this.state, TOTAL_QUESTIONS, percent, time);

    const playAgain = getPlayAgainButton();
    if (playAgain) {
      playAgain.addEventListener("click", () => this.renderStart());
    }
  }
}
