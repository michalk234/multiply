const app = document.getElementById("app");

const TOTAL_QUESTIONS = 10;
const QUESTION_DELAY_MS = 1100;

let focusInterval = null;
let nextQuestionTimeout = null;

let state = createInitialState();

function createInitialState(max = 30) {
  return {
    max,
    count: 0,
    correct: 0,
    startTime: null,
    current: null,
    questions: []
  };
}

function renderStart() {
  stopFocusKeeper();
  clearNextQuestionTimeout();

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

  document.querySelectorAll(".level-button").forEach((button) => {
    button.addEventListener("click", () => {
      startGame(Number(button.dataset.max));
    });
  });
}

function startGame(max) {
  state = createInitialState(max);
  state.startTime = Date.now();
  state.questions = buildQuestionPool(max);
  nextQuestion();
}

function buildQuestionPool(max) {
  const pool = [];

  for (let a = 1; a <= 10; a += 1) {
    for (let b = 1; b <= 10; b += 1) {
      const answer = a * b;
      if (answer <= max) {
        pool.push({ a, b, answer });
      }
    }
  }

  shuffle(pool);
  return pool.slice(0, TOTAL_QUESTIONS);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function nextQuestion() {
  clearNextQuestionTimeout();

  if (state.count >= TOTAL_QUESTIONS) {
    showResults();
    return;
  }

  state.current = state.questions[state.count];

  const currentNumber = state.count + 1;
  const progress = (state.count / TOTAL_QUESTIONS) * 100;

  app.innerHTML = `
    <div class="container">
      <div class="game-header">
        <div class="game-meta">Pytanie ${currentNumber}/${TOTAL_QUESTIONS}</div>
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

  attachInputHandlers();
  ensureAnswerFocus();
}

function attachInputHandlers() {
  const input = document.getElementById("answer");
  if (!input) {
    return;
  }

  input.addEventListener("keydown", handleKeyDown);
  input.addEventListener("input", sanitizeInput);

  const submitButton = document.getElementById("submit-btn");
  if (submitButton) {
    submitButton.addEventListener("click", checkAnswer);
  }

  const focusEvents = ["click", "touchstart", "pointerdown"];
  focusEvents.forEach((eventName) => {
    document.addEventListener(eventName, ensureAnswerFocus, true);
  });

  startFocusKeeper();
}

function handleKeyDown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    checkAnswer();
  }
}

function sanitizeInput(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, "");
}

function ensureAnswerFocus() {
  const input = document.getElementById("answer");
  if (!input || input.disabled) {
    stopFocusKeeper();
    return;
  }

  if (document.activeElement !== input) {
    input.focus({ preventScroll: true });
    const length = input.value.length;
    input.setSelectionRange(length, length);
  }
}

function startFocusKeeper() {
  stopFocusKeeper();
  focusInterval = window.setInterval(() => {
    ensureAnswerFocus();
  }, 300);
}

function stopFocusKeeper() {
  if (focusInterval) {
    window.clearInterval(focusInterval);
    focusInterval = null;
  }

  const focusEvents = ["click", "touchstart", "pointerdown"];
  focusEvents.forEach((eventName) => {
    document.removeEventListener(eventName, ensureAnswerFocus, true);
  });
}

function clearNextQuestionTimeout() {
  if (nextQuestionTimeout) {
    window.clearTimeout(nextQuestionTimeout);
    nextQuestionTimeout = null;
  }
}

function checkAnswer() {
  const input = document.getElementById("answer");
  const status = document.getElementById("status");

  if (!input || !status || input.disabled) {
    return;
  }

  const value = input.value.trim();
  if (!value) {
    ensureAnswerFocus();
    return;
  }

  const num = Number(value);

  if (num === state.current.answer) {
    state.correct += 1;
    status.innerHTML = `<span class="correct">Dobrze! ✅</span>`;
  } else {
    status.innerHTML = `
      <div class="wrong-wrap">
        <span class="wrong">${num}</span>
        <span>Poprawna odpowiedź: ${state.current.answer}</span>
      </div>
    `;
  }

  state.count += 1;
  input.disabled = true;

  const submitButton = document.getElementById("submit-btn");
  if (submitButton) {
    submitButton.disabled = true;
  }

  stopFocusKeeper();

  nextQuestionTimeout = window.setTimeout(nextQuestion, QUESTION_DELAY_MS);
}

function showResults() {
  stopFocusKeeper();
  clearNextQuestionTimeout();

  const time = ((Date.now() - state.startTime) / 1000).toFixed(1);
  const percent = Math.round((state.correct / TOTAL_QUESTIONS) * 100);

  app.innerHTML = `
    <div class="container">
      <h1>Wynik</h1>
      <p class="result-summary">Koniec rundy. Zobacz, jak Ci poszło!</p>

      <div class="result-grid">
        <div class="result-card">
          <div class="result-label">Poprawne odpowiedzi</div>
          <div class="result-value">${state.correct}/${TOTAL_QUESTIONS}</div>
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

  const playAgainButton = document.getElementById("play-again");
  if (playAgainButton) {
    playAgainButton.addEventListener("click", renderStart);
  }
}

renderStart();
