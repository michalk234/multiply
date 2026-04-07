// view.js (updated layout fix)

export function renderQuestionView(app, state, total, progress) {
  app.innerHTML = `
    <div class="card">
      <div class="question">
        <div>Pytanie ${state.count + 1}/${total}</div>
        <div>${state.current.a} × ${state.current.b} = ?</div>
      </div>

      <div class="answer-row">
        <input id="answerInput" type="text" autocomplete="off" />
        <button id="submitButton">OK</button>
      </div>

      <div class="secondary-action">
        <a href="#" id="exitButton" class="exit-link">Wyjdź</a>
      </div>
    </div>
  `;
}

export function getAnswerInput() {
  return document.getElementById("answerInput");
}

export function getSubmitButton() {
  return document.getElementById("submitButton");
}

export function getExitButton() {
  return document.getElementById("exitButton");
}
