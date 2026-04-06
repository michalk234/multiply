const app = document.getElementById("app");

let state = {
  max: 30,
  count: 0,
  correct: 0,
  startTime: null,
  current: null
};

function renderStart() {
  app.innerHTML = `
    <div class="container">
      <h1>Tabliczka mnożenia</h1>
      <p style="color:white;">Wybierz poziom</p>
      <button onclick="startGame(30)">Do 30</button>
      <button onclick="startGame(50)">Do 50</button>
      <button onclick="startGame(100)">Do 100</button>
    </div>
  `;
}

function startGame(max) {
  state = {
    max,
    count: 0,
    correct: 0,
    startTime: Date.now(),
    current: null
  };
  nextQuestion();
}

function generateQuestion(max) {
  let a, b;
  do {
    a = Math.ceil(Math.random() * 10);
    b = Math.ceil(Math.random() * 10);
  } while (a * b > max);

  return {
    a,
    b,
    answer: a * b
  };
}

function nextQuestion() {
  if (state.count >= 10) {
    showResults();
    return;
  }

  state.current = generateQuestion(state.max);

  app.innerHTML = `
    <div class="container">
      <div class="question">${state.current.a} × ${state.current.b} = ?</div>
      <input id="answer" inputmode="numeric" autocomplete="off" autofocus onkeydown="handleKey(event)">
      <div class="status" id="status"></div>
    </div>
  `;

  const input = document.getElementById("answer");
  if (input) {
    input.focus();
  }
}

function handleKey(event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
}

function checkAnswer() {
  const input = document.getElementById("answer");
  const status = document.getElementById("status");

  if (!input || !status) {
    return;
  }

  const value = input.value.trim();
  if (!value) {
    return;
  }

  const num = Number(value);

  if (num === state.current.answer) {
    state.correct++;
    status.innerHTML = "<span class=\"correct\">Dobrze!</span>";
  } else {
    status.innerHTML = `
      <span class="wrong">${num}</span><br>
      Poprawna odpowiedź: ${state.current.answer}
    `;
  }

  state.count++;
  input.disabled = true;

  setTimeout(nextQuestion, 1000);
}

function showResults() {
  const time = ((Date.now() - state.startTime) / 1000).toFixed(1);
  const percent = Math.round((state.correct / 10) * 100);

  app.innerHTML = `
    <div class="container">
      <h1>Wynik</h1>
      <div class="result">Poprawne: ${percent}%</div>
      <div class="result">Czas: ${time}s</div>
      <button onclick="renderStart()">Jeszcze raz</button>
    </div>
  `;
}

renderStart();
