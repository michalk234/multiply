/**
 * View layer for the multiplication table app.
 * This file is responsible only for rendering and simple DOM reads.
 */

/**
 * Render the start screen.
 * @param {HTMLElement} app
 */
export function renderStartView(app) {
  app.innerHTML = `
    <div class="container">
      <h1>Tabliczka mnożenia</h1>
      <p class="subtitle">Wybierz poziom i rozwiąż 10 pytań.</p>
      <div class="level-buttons">
        <button class="level-button" data-max="30">Do 30</button>
        <button class="level-button" data-max="50">Do 50</button>
        <button class="level-button" data-max="100">Do 100</button>
      </div>
    </div>
  `;
}

/**
 * Render a single game question view.
 * @param {HTMLElement} app
 * @param {{
 *   current: {a:number,b:number,answer:number},
 *   count: number,
 *   correct: number
 * }} state
 * @param {number} totalQuestions
 * @param {number} progress
 */
export function renderQuestionView(app, state, totalQuestions, progress) {
  const currentNumber = state.count + 1;

  app.innerHTML = `
    <div class="container">
      <div class="game-header">
        <div class="game-meta">Pytanie ${currentNumber}/${totalQuestions}</div>
        <div class="game-meta">Poprawne: ${state.correct}</div>
      </div>

      <div class="progress-track" aria-hidden="true">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>

      <div class="question-card">
        <span class="question-label">Ile to jest?</span>
        <div class="question">${state.current.a} × ${state.current.b} = ?</div>
      </div>

      <div class="answer-row">
        <input
          id="answer"
          class="answer-input"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          aria-label="Wpisz odpowiedź"
        >
        <button
          id="submit-btn"
          class="primary-button submit-button"
          type="button"
          aria-label="Zatwierdź odpowiedź"
        >
          OK
        </button>
      </div>

      <p class="helper-text">Wpisz liczbę i naciśnij OK albo Enter.</p>
      <div class="status" id="status"></div>
    </div>
  `;
}

/**
 * Render the result screen.
 * @param {HTMLElement} app
 * @param {{
 *   correct: number,
 *   max: number
 * }} state
 * @param {number} totalQuestions
 * @param {number} percent
 * @param {string} time
 */
export function renderResultsView(app, state, totalQuestions, percent, time) {
  app.innerHTML = `
    <div class="container">
      <h1>Wynik</h1>
      <p class="result-summary">Koniec rundy. Zobacz, jak Ci poszło!</p>

      <div class="result-grid">
        <div class="result-card">
          <div class="result-label">Poprawne odpowiedzi</div>
          <div class="result-value">${state.correct}/${totalQuestions}</div>
        </div>
        <div class="result-card">
          <div class="result-label">Skuteczność</div>
          <div class="result-value">${percent}%</div>
        </div>
        <div class="result-card">
          <div class="result-label">Czas</div>
          <div class="result-value">${time}s</div>
        </div>
        <div class="result-card">
          <div class="result-label">Poziom</div>
          <div class="result-value">do ${state.max}</div>
        </div>
      </div>

      <button class="secondary-button" id="play-again">Jeszcze raz</button>
    </div>
  `;
}

/**
 * Show correct answer status.
 */
export function showCorrectAnswerStatus() {
  const status = document.getElementById("status");
  if (!status) {
    return;
  }

  status.innerHTML = `<span class="correct">Dobrze! ✅</span>`;
}

/**
 * Show wrong answer status.
 * @param {number} userAnswer
 * @param {number} correctAnswer
 */
export function showWrongAnswerStatus(userAnswer, correctAnswer) {
  const status = document.getElementById("status");
  if (!status) {
    return;
  }

  status.innerHTML = `
    <div class="wrong-wrap">
      <span class="wrong">${userAnswer}</span>
      <span>Poprawna odpowiedź: ${correctAnswer}</span>
    </div>
  `;
}

/**
 * Get the answer input element.
 * @returns {HTMLInputElement | null}
 */
export function getAnswerInput() {
  return document.getElementById("answer");
}

/**
 * Get the submit button element.
 * @returns {HTMLButtonElement | null}
 */
export function getSubmitButton() {
  return document.getElementById("submit-btn");
}

/**
 * Get all level buttons from the start screen.
 * @returns {NodeListOf<HTMLButtonElement>}
 */
export function getLevelButtons() {
  return document.querySelectorAll(".level-button");
}

/**
 * Get the play again button from the result screen.
 * @returns {HTMLButtonElement | null}
 */
export function getPlayAgainButton() {
  return document.getElementById("play-again");
}
