"use strict";
import Popup from "./popup.js";
import Game from "./game.js";

const gameFinishBanner = new Popup();

const game = new Game(3, 2, 2);
game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case "cancel":
      message = "Replay?";
      break;
    case "win":
      message = "YOU WON!!";
      break;
    case "lose":
      message = "YOU LOST~~";
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
