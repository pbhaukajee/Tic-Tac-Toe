const displayController = (() => {
  const renderMessage = (message) => {
    document.querySelector("#message").innerHTML = message;
  };
  return { renderMessage };
})();

//Module to start the gameboard
//using IIFE ()
const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  //display the gameboard
  let render = () => {
    let boardHTML = "";
    gameboard.forEach((squareValue, index) => {
      boardHTML += `<div class="square" id="square-${index}">${squareValue}</div>`;
    });

    //Add each div inside gameboard div in HTML using DOM
    document.querySelector("#gameboard").innerHTML = boardHTML;
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", Game.handleClick);
    });
  };

  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => gameboard;

  return {
    render,
    update,
    getGameboard,
  };
})();

//Factories to create players
const createPlayer = (name, symbol) => {
  return { name, symbol };
};

//Module to control the game
const Game = (() => {
  //put both players inside of an array
  let players = [];
  let currentPlayerIndex; //keep track of current player
  let gameOver;

  //create function to start the game
  const start = () => {
    players = [
      createPlayer(document.querySelector("#player1").value, "X"),
      createPlayer(document.querySelector("#player2").value, "O"),
    ];

    //track current player
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();
  };

  //log id when clicked
  const handleClick = (event) => {
    if (gameOver) {
      return;
    }

    let index = parseInt(event.target.id.split("-")[1]);

    if (Gameboard.getGameboard()[index] !== "") {
      return;
    }
    Gameboard.update(index, players[currentPlayerIndex].symbol);

    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].symbol)
    ) {
      gameOver = true;
      displayController.renderMessage(
        `${players[currentPlayerIndex].name} wins😎`
      );
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage("It's a tie!");
    }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    Gameboard.render();
    gameOver = false;
    document.querySelector("#message").innerHTML = "";
  };

  return { start, handleClick, restart };
})();

function checkForWin(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  return board.every((cell) => cell !== "");
}

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
  Game.restart();
});

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  Game.start();
});
