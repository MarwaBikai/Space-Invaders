// define the state and behaviour needed.
const state = {
  numCells: (800 / 40) * (600 / 40),
  cells: [],
  shipPosition: 289,
  alienPositions: [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77
  ],

  score: 0
};

const setupGame = (element) => {
  state.element = element;
  // draw the grid
  drawGrid();
  // draw the spaceship
  drawShip();
  // draw the aliens
  drawAliens();
  // draw the scoreboard
  drawScoreboard();
};

const drawGrid = () => {
  // create container div
  const grid = document.createElement("div");
  grid.classList.add("grid");
  // insert grid into the app
  state.element.append(grid);
  // loop through a certain number to generate cells.
  for (let i = 0; i < state.numCells; i++) {
    const cell = document.createElement("div");
    state.cells.push(cell);

    // insert cell into grid
    grid.append(cell);
  }
};

const drawShip = () => {
  // find starting point
  // add class to cell to add background image.
  state.cells[state.shipPosition].classList.add("spaceship");
};

const controlShip = (event) => {
  if (state.gameover) return;

  // demonstrate
  // console.log(event)
  if (event.code === "ArrowLeft") {
    console.log("moving to the left");
    moveShip("left");
  } else if (event.code === "ArrowRight") {
    console.log("moving to the right");
    moveShip("right");
  } else if (event.code === "Space") {
    fire();
    console.log("fire!");
  }
};

const moveShip = (direction) => {
  // remove class, update position, add class.
  // grid boundaries using modulo (left side multiples of 15, right side (15 minus 1))
  state.cells[state.shipPosition].classList.remove("spaceship");
  if (direction === "left" && state.shipPosition % 20 !== 0) {
    state.shipPosition--;
  } else if (direction === "right" && state.shipPosition % 20 !== 19) {
    state.shipPosition++;
  }
  state.cells[state.shipPosition].classList.add("spaceship");
};

const fire = () => {
  // using an interval add and remove bg image for a laser increasing up the grid
  // clear interval when laser reaches the top.
  // laser starts at ship position
  let interval;
  let laserPosition = state.shipPosition;
  console.log(laserPosition);
  console.log(state.shipPosition);
  interval = setInterval(() => {
    // first remove laser image from cell
    state.cells[laserPosition].classList.remove("laser");
    // then move up the grid
    laserPosition -= 20;
    // before we do anything, check we're still in the grid.
    if (laserPosition < 0) {
      clearInterval(interval);
      return;
    }

    // if there's an alien, BOOM!
    // clear interval, remove alien image, remove alien from positions, set a timeout for a boom emoji
    if (state.alienPositions.includes(laserPosition)) {
      clearInterval(interval);
      state.alienPositions.splice(
        state.alienPositions.indexOf(laserPosition),
        1
      );
      state.cells[laserPosition].classList.remove("alien");
      state.cells[laserPosition].classList.add("hit");
      state.score++;
      console.log(state.alienPositions);
      state.scoreElement.innerText = state.score;
      setTimeout(() => {
        state.cells[laserPosition].classList.remove("hit");
      }, 200);
      return;
    }

    // add image
    state.cells[laserPosition].classList.add("laser");
  }, 100);
};

const drawAliens = () => {
  // loop through cells, remove, and add class name to corresponding cell.
  state.cells.forEach((cell, index) => {
    // reset: if cell index is currently an alien position remove it
    if (cell.classList.contains("alien")) {
      cell.classList.remove("alien");
    }
    // update: if cell index is an alien position, add alien class
    if (state.alienPositions.includes(index)) {
      cell.classList.add("alien");
    }
  });
};

const play = () => {
  // start the aliens moving!
  let interval;
  // set starting direction
  let direction = "right";
  // set interval to repeat updating alien positions and drawing them
  interval = setInterval(() => {
    let movement;
    // if right
    if (direction === "right") {
      if (atSide("right")) {
        console.log("at the right edge!");
        // go down a row and reverse direction to the left

        movement = 20 - 1;
        direction = "left";
      } else {
        // continue right
        movement = 1;
      }
      // if left
    } else if (direction === "left") {
      if (atSide("left")) {
        console.log("at the left edge!");
        // go down a row and reverse direction to the right
        movement = 20 + 1;
        direction = "right";
      } else {
        // continue left
        movement = -1;
      }
    }
    //update alien positions
    state.alienPositions = state.alienPositions.map(
      (position) => position + movement
    );
    // redraw aliens
    drawAliens();
    // check game state (and stop the aliens, and stop the ship)
    checkGameState(interval);
  }, 500);
  // start the ability to move and fire
  window.addEventListener("keydown", controlShip);
};

const atSide = (side) => {
  if (side === "left") {
    // are there any aliens with a position in left hand column? (index multiple of 15)
    return state.alienPositions.some((position) => position % 20 === 0);
  } else if (side === "right") {
    // are there any aliens with a position in right hand column? (index multiple of 15 -1)
    return state.alienPositions.some((position) => position % 20 === 19);
  }
};

const checkGameState = (interval) => {
  // if there are no more aliens
  if (state.alienPositions.length === 0) {
    // stop aliens
    clearInterval(interval);
    // set game state
    state.gameover = true;
    // show win message
    drawMessage("HUMAN WINS!");

    // if aliens reach bottom row..ish
  } else if (
    state.alienPositions.some((position) => position >= state.shipPosition)
  ) {
    // stop aliens
    clearInterval(interval);
    // set game state
    state.gameover = true;
    // make ship go boom
    state.cells[state.shipPosition].classList.remove("spaceship");
    state.cells[state.shipPosition].classList.add("hit");
    // show lose message
    drawMessage("GAME OVER!");
  }
};

const drawMessage = (message) => {
  // add message element with class
  const messageEl = document.createElement("div");
  messageEl.classList.add("message");

  // append h1 with text
  const h1 = document.createElement("h1");
  h1.innerText = message;
  messageEl.append(h1);

  // append el to the app
  state.element.append(messageEl);
};

const drawScoreboard = () => {
  const heading = document.createElement("h1");
  heading.innerText = "Space Invaders:lvl 2";
  const heading1 = document.createElement("h2");
  heading1.innerText = "Aliens got some help...";
  const paragraph1 = document.createElement("p");
  paragraph1.innerText = "Press SPACE to shoot.";
  const paragraph2 = document.createElement("p");
  paragraph2.innerText = "Press ← and → to move";
  const scoreboard = document.createElement("div");
  scoreboard.classList.add("scoreboard");
  const scoreElement = document.createElement("span");
  scoreElement.innerText = state.score;
  const heading3 = document.createElement("h3");
  heading3.innerText = "Score: ";
  heading3.append(scoreElement);
  scoreboard.append(heading, heading1, paragraph1, paragraph2, heading3);

  state.scoreElement = scoreElement;
  state.element.append(scoreboard);
};
// query the page for the element
const appElement = document.querySelector(".app");
// insert app into the game
setupGame(appElement);
// play!
play();
