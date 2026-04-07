/**
 * View layer for the multiplication table app.
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

export function renderQuestionView(app, state, totalQuestions, progress) {
  const currentNumber = state.count + 1;

  app.innerHTML = `
    <div class="container">
      <div class="game-header">
        <div class="game-meta">Pytanie ${currentNumber}/${totalQuestions}</div>
        <div class="game-meta">Poprawne: ${state.correct}</div>
      </div>

      <div class="progress-track">
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
          autofocus
        >
        <button id="submit-btn" class="primary-button" type="button">
          OK
        </button>
      </div>

      <div class="status" id="status"></div>

      <button id="next-btn" class="secondary-button" style="display:none;">
        Dalej
      </button>
    </div>
  `;
}

export function renderResultsView(app, state, totalQuestions, percent, time) {
  app.innerHTML = `
    <div class="container">
      <h1>Wynik</h1>
      <p class="result-summary">Brawo! Zobacz, jak Ci poszło.</p>

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
      </div>

      <button id="play-again" class="primary-button" type="button">
        Jeszcze raz
      </button>
    </div>
  `;
}

export function showCorrectAnswerStatus() {
  const status = document.getElementById("status");
  if (status) status.innerHTML = "Dobrze! ✅";
}

export function showWrongAnswerStatus(userAnswer, correctAnswer) {
  const status = document.getElementById("status");
  if (status) {
    status.innerHTML = `${userAnswer} → ${correctAnswer}`;
  }
}

export function getAnswerInput() {
  return document.getElementById("answer");
}

export function getSubmitButton() {
  return document.getElementById("submit-btn");
}

export function getLevelButtons() {
  return document.querySelectorAll(".level-button");
}

export function getPlayAgainButton() {
  return document.getElementById("play-again");
}
