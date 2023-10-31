// Gameboard, returns 2d board array and reset method
const gameboard = (() => {
  const _initGameboard = () => {
    const _gameboardArray = [];
    for (let i = 0; i < 9; i++) {
      _gameboardArray.push(undefined);
    }
    return _gameboardArray;
  }
  const board = _initGameboard();
  const reset = _initGameboard;

  return { board, reset };
})();

// Player, sets player token
const createPlayer = (token) => {
  let _playerWins = 0;
  const hasWon = () => _playerWins++;

  return { token }
}

const runGame = ((gameboard) => {
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");

  const gameboardDom = document.querySelector('[data-board]');
  const gameCellsDom = document.querySelectorAll('[data-cell]');

  let _currentPlayer = player1;

  const _gameRound = (e) => {
    const target = e.target;
    const currentCell = target.getAttribute('data-cell');
    
    // returning if spot is taken
    if (gameboard.board[currentCell]) return;

    gameboard.board[currentCell] = _currentPlayer.token;
    target.classList.add(`is-${_currentPlayer.token}`);

    let hasWin = _checkForWin();
    
    if (hasWin) {
      _currentPlayer._playerWins++;
      console.log(`congratulations ${_currentPlayer.token}, you have won the game!`);
      gameCellsDom.forEach(elem => {
        elem.classList.remove('is-X', 'is-O');
      })
      gameboard.reset();
      return;
    }

    _currentPlayer = _currentPlayer === player1 ? player2 : player1;
  }

  const _checkForWin = () => {
    const checkWinner = (currentLine) => {
      return currentLine.every(val => val != undefined && val === currentLine[0]);
    };
    
    //checking rows
    for (i = 0; i <= 6; i += 3) {
      let currentLine = [];
      for (j = 0; j < 3; j++) {
        let currentIndex = i + j;
        currentLine.push(gameboard.board[currentIndex]);
      }
      if (checkWinner(currentLine)) return currentLine[0];
    }

    //checking columns
    for (i = 0; i < 3; i++) {
      let currentLine = [];
      for (j = 0; j <= 6; j += 3) {
        let currentIndex = i + j;
        currentLine.push(gameboard.board[currentIndex]);
      }
      if (checkWinner(currentLine)) return currentLine[0];
    }

    //checking diagonals
    for (i = 0; i <= 6; i+=6) {
      if (i === 0) {
        let currentLine = [];
        for (let j = 0; j <= 8; j += 4) {
          let currentIndex = i + j;
          currentLine.push(gameboard.board[currentIndex]);
        }
        if (checkWinner(currentLine)) return currentLine[0];
      } else {
        let currentLine = [];
        for (let j = 0; j <= 4; j += 2) {
          let currentIndex = i - j;
          currentLine.push(gameboard.board[currentIndex]);
        }
        if (checkWinner(currentLine)) return currentLine[0];
      }
    }
  }

  gameboardDom.addEventListener('click', _gameRound);

  // runGame();
})(gameboard);