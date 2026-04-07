/**
 * View layer
 */

export function renderStartView(app) {
  app.innerHTML = `
    <div class="container">
      <h1>Tabliczka mnożenia</h1>
      <div class="level-buttons">
        <button class="level-button" data-max="30">Do 30</button>
        <button class="level-button" data-max="50">Do 50</button>
        <button class="level-button" data-max="100">Do 100</button>
      </div>
    </div>
  `;
}

export function renderQuestionView(app, state, total, progress) {
  const current = state.count + 1;

  app.innerHTML = `
    <div class="container">
      <div>Pytanie ${current}/${total}</div>

      <div>${state.current.a} × ${state.current.b} = ?</div>

      <input id="answer" type="text" autofocus />
      <button id="submit-btn">OK</button>

      <div id="status"></div>

      <button id="next-btn" style="display:none;">Dalej</button>
      <button id="exit-btn">Wyjdź</button>
    </div>
  `;
}

export function renderResultsView(app, state, total, percent, time) {
  app.innerHTML = `
    <div>
      <h1>Wynik</h1>
      <div>${state.correct}/${total}</div>
      <div>${percent}%</div>
      <div>${time}s</div>
      <button id="play-again">Jeszcze raz</button>
    </div>
  `;
}

export function showCorrectAnswerStatus() {
  const el = document.getElementById("status");
  if (el) el.innerHTML = "Dobrze!";
}

export function showWrongAnswerStatus(user, correct) {
  const el = document.getElementById("status");
  if (el) el.innerHTML = `${user} → ${correct}`;
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
