/**
 * Application bootstrap.
 * This file wires the app root with the controller.
 */

import { GameController } from "./controller.js";

/**
 * Start the multiplication table application.
 */
export function startApp() {
  const app = document.getElementById("app");

  if (!app) {
    throw new Error('Missing root element with id="app".');
  }

  const controller = new GameController(app);
  controller.init();
}
