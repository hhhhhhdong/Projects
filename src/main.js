"use strict";
import Popup from "./popup.js";
import Field from "./field.js";

const carrotCount = 5;
const bugCount = 5;
const game_duration_sec = 5;

const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const winSound = new Audio("./sound/game_win.mp3");
const bgSound = new Audio("./sound/bg.mp3");

let started = false;
let score = 0;
let timer = undefined;

const gameFinishBanner = new Popup();
gameFinishBanner.setClickListener(() => {
  startGame();
});

const gameField = new Field(carrotCount, bugCount);
gameField.setClickListener(onItemClick);

function onItemClick(item) {
  if (!started) {
    return;
  }
  if (item === "carrot") {
    score++;
    updateScoreBoard();
    if (score === carrotCount) {
      finishGame(true);
    }
  } else if (itme === "bug") {
    finishGame(false);
  }
}

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

function startGame() {
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  playSuound(bgSound);
}
function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  gameFinishBanner.showWithText("REPLAY?");
  playSuound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  stopGameTimer();
  hideGameButton();
  if (win) {
    playSuound(winSound);
  } else {
    playSuound(bugSound);
  }
  stopSound(bgSound);
  gameFinishBanner.showWithText(win ? "YOU WON!" : "YOU LOST~");
}

function showStopBtn() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
}

function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}

function startGameTimer() {
  let remainingTimeSec = game_duration_sec;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(carrotCount === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const second = time % 60;
  gameTimer.innerText = `${minutes}:${second}`;
}

function initGame() {
  score = 0;
  gameScore.innerText = carrotCount;
  gameField.init();
}

function playSuound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerText = carrotCount - score;
}
