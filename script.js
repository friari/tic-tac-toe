// Gameboard, returns 2d board array and reset method
const gameboard = (() => {
  const init = () => {
    const _gameboardArray = [];
    for (let i = 0; i < 9; i++) {
      _gameboardArray.push(undefined);
    }
    return _gameboardArray;
  }

  return { init };
})();

// Player, sets player token
const createPlayer = (name, token) => {
  let _playerWins = 0;
  const increaseWins = () => _playerWins++;
  const printWins = () => _playerWins;

  return { token, increaseWins }
}

const runGame = (board) => {
  let hasWin = false;
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");

  const gameboardDom = document.querySelector('[data-board]');
  const gameCellsDom = document.querySelectorAll('[data-cell]');

  let _currentPlayer = player1;

  const _gameRound = (e) => {
    const target = e.target;
    const currentCell = target.getAttribute('data-cell');
    
    // returning if spot is taken
    if (board[currentCell]) return;

    board[currentCell] = _currentPlayer.token;
    target.classList.add(`is-${_currentPlayer.token}`);

    hasWin = _checkForWin();
    
    if (hasWin) {
      _currentPlayer._playerWins++;
      console.log(`congratulations ${_currentPlayer.token}, you have won the game!`);
      setTimeout(() => {
        gameCellsDom.forEach(elem => {
          elem.classList.remove('is-X', 'is-O');
        });
        board = gameboard.init();
        hasWin = false;
      }, 2000);
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
        currentLine.push(board[currentIndex]);
      }
      if (checkWinner(currentLine)) return currentLine[0];
    }

    //checking columns
    for (i = 0; i < 3; i++) {
      let currentLine = [];
      for (j = 0; j <= 6; j += 3) {
        let currentIndex = i + j;
        currentLine.push(board[currentIndex]);
      }
      if (checkWinner(currentLine)) return currentLine[0];
    }

    //checking diagonals
    for (i = 0; i <= 6; i+=6) {
      if (i === 0) {
        let currentLine = [];
        for (let j = 0; j <= 8; j += 4) {
          let currentIndex = i + j;
          currentLine.push(board[currentIndex]);
        }
        if (checkWinner(currentLine)) return currentLine[0];
      } else {
        let currentLine = [];
        for (let j = 0; j <= 4; j += 2) {
          let currentIndex = i - j;
          currentLine.push(board[currentIndex]);
        }
        if (checkWinner(currentLine)) return currentLine[0];
      }
    }
  }

  gameboardDom.addEventListener('click', _gameRound);
};

runGame(gameboard.init());