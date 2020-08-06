"use strict";

const carrotCount = 5;
const bugCount = 5;
const game_duration_sec = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message");
const popUpRefresh = document.querySelector(".pop-up__refresh");

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const winSound = new Audio("./sound/game_win.mp3");
const bgSound = new Audio("./sound/bg.mp3");

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener("click", onFieldClick);

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener("click", () => {
  startGame();
  hidePopup();
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
  showPopupWithText("REPLAY?");
  playSuound(alertSound);
  stopSound();
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
  showPopupWithText(win ? "YOU WON!" : "YOU LOST~");
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

function showPopupWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove("pop-up--hide");
}

function hidePopup() {
  popUp.classList.add("pop-up--hide");
}

function initGame() {
  score = 0;
  field.innerHTML = "";
  gameScore.innerText = carrotCount;
  addItem("carrot", carrotCount, "img/carrot.png");
  addItem("bug", bugCount, "img/bug.png");
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches(".carrot")) {
    target.remove();
    score++;
    playSuound(carrotSound);
    updateScoreBoard();
    if (score === carrotCount) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
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

function addItem(className, count, imgPath) {
  const carrotSize = 80;
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - carrotSize;
  const y2 = fieldRect.height - carrotSize;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
