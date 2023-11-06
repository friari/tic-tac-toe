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
const createPlayer = (name, token, num) => {
  let _playerWins = 0;
  const _playerId = `player${num}`;
  let _playerName = name;

  const getId = () => _playerId;

  const getName = () => _playerName;
  const setName = (name) => _playerName = name;

  const increaseWins = () => _playerWins++;
  const printWins = () => _playerWins;

  return { token, increaseWins, printWins, getId, getName, setName }
}

const controller = (() => {
  const gameboardDom = document.querySelector('[data-board]');
  const gameCellsDom = document.querySelectorAll('[data-cell]');
  const modalContainer = document.querySelector('[data-modal-container]');
  const playButtons = document.querySelectorAll('[data-start-game]');
  const changeNameTriggers = document.querySelectorAll('[data-change-name-trigger]');
  const changeNameButtons = document.querySelectorAll('[data-submit-name]')

  const player1 = createPlayer("Player One", "X", 1);
  const player2 = createPlayer("Player Two", "O", 2);

  const players = [player1, player2];

  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      _closeModal();
    }
  });

  changeNameTriggers.forEach(button => {
    button.addEventListener('click', (e) => {
      const playerId = e.target.closest('[data-player]').getAttribute('data-player');
      const playerDetails = players.find(player => playerId === player.getId());
      _openModal("name", playerDetails);
    })
  });

  changeNameButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const parentContainer = e.target.closest('[data-player-name]');
      const playerId = parentContainer.getAttribute('data-player-name');
      const playerCard = document.querySelector(`[data-player=${playerId}`);
      console.log(playerCard);
      const playerToChange = players.find(player => playerId === player.getId());
      const input = parentContainer.querySelector('.input');

      playerToChange.setName(input.value);
      playerCard.querySelector('[data-player-name]').innerText = playerToChange.getName();

      input.value = '';

      _closeModal();
    })
  });

  const _cleanBoard = () => {
    gameCellsDom.forEach(elem => {
      elem.classList.remove('is-X', 'is-O');
    });
  }

  const _closeModal = () => {
    modalContainer.classList.add('hidden');
  }

  const _openModal = (modalType, playerDetails) => {
    modalContainer.classList.remove('hidden');

    if (modalType === "win") {
      modalContainer.classList.add('is-win');
      modalContainer.querySelector('[data-winning-player]').innerText = playerDetails.getName();
      return;
    }

    modalContainer.classList.add('is-player');
    modalContainer.querySelector('.modal__player').setAttribute('data-player-name', playerDetails.getId());
  }

  playButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!modalContainer.classList.contains('hidden')) {
        _closeModal();
      }

      runGame(gameboard.init());
    });
  })

  const runGame = (board) => {
    _cleanBoard();
    let hasWin = false;
  
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
        _currentPlayer.increaseWins();
        console.log(`congratulations ${_currentPlayer.token}, you have won the game!`);
        gameboardDom.removeEventListener('click', _gameRound);
        setTimeout(() => {
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
})();