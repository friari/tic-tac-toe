// Gameboard, returns 2d board array and reset method
const gameboard = (() => {
  const board = Array(9).fill(undefined);

  return {
    getBoard: () => board,
    resetBoard: () => board.fill(undefined),
  };
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
      closeModal();
    }
  });

  changeNameTriggers.forEach(button => {
    button.addEventListener('click', (e) => {
      const playerId = e.target.closest('[data-player]').getAttribute('data-player');
      const playerDetails = players.find(player => playerId === player.getId());
      openModal("player", playerDetails);
    })
  });

  changeNameButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const parentContainer = e.target.closest('[data-player-name]');
      const playerId = parentContainer.getAttribute('data-player-name');
      const playerCard = document.querySelector(`[data-player=${playerId}`);
      const playerToChange = players.find(player => playerId === player.getId());
      const input = parentContainer.querySelector('.input');

      playerToChange.setName(input.value);
      playerCard.querySelector('[data-player-name]').innerText = playerToChange.getName();

      input.value = '';

      closeModal();
    })
  });

  const cleanBoard = () => {
    gameCellsDom.forEach(elem => {
      elem.classList.remove('is-X', 'is-O');
    });
  }

  const closeModal = () => {
    modalContainer.classList.add('hidden');
  }

  const openModal = (modalType, playerDetails) => {
    modalContainer.classList.remove('hidden', 'is-player', 'is-endgame');

    if (modalType === "player") {
      modalContainer.classList.add('is-player');
      modalContainer.querySelector('.modal__player').setAttribute('data-player-name', playerDetails.getId());
      modalContainer.querySelector('#name-change').focus();
      return;
    }

    modalContainer.classList.add('is-endgame');
    let textContainer = modalContainer.querySelector('[data-endgame-text]')
    
    if (playerDetails) {
      textContainer.innerText = `${playerDetails.getName()} is the winner!`;
      return;
    }

    textContainer.innerText = 'Tie game!'
    return;
  }

  const updatePlayerWinDom = (player) => {
    const winningPlayerDom = document.querySelector(`[data-player=${player.getId()}]`);
    winningPlayerDom.querySelector('[data-wins]').innerText = player.printWins();
  }

  const highlightCurrentPlayerDom = (player) => {
    const playerCardsDom = document.querySelectorAll("[data-player]");
    playerCardsDom.forEach(card => {
      card.getAttribute('data-player') === player.getId() ? card.classList.add('is-current') : card.classList.remove('is-current');
    })
  }

  playButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!modalContainer.classList.contains('hidden')) {
        closeModal();
      }

      runGame(gameboard.getBoard());
    });
  });

  const runGame = (board) => {
    cleanBoard();
    gameboardDom.classList.add('playing');
    let hasWin = false;
  
    let currentPlayer = player1;
    highlightCurrentPlayerDom(currentPlayer);
  
    const gameRound = (e) => {
      const target = e.target;
      const currentCell = target.getAttribute('data-cell');
      
      // returning if spot is taken
      if (board[currentCell]) return;
  
      board[currentCell] = currentPlayer.token;
      target.classList.add(`is-${currentPlayer.token}`);
  
      hasWin = checkForWin();
      
      if (hasWin) {
        currentPlayer.increaseWins();
        updatePlayerWinDom(currentPlayer);
        openModal("endgame", currentPlayer);
        gameboardDom.removeEventListener('click', gameRound);
        gameboardDom.classList.remove('playing');
        gameboard.resetBoard();
        return;
      }
      
      const isBoardFull = !board.includes(undefined);

      if (isBoardFull) {
        openModal("endgame");
        gameboardDom.removeEventListener('click', gameRound);
        gameboardDom.classList.remove('playing');
        gameboard.resetBoard();
        return;
      }
  
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      highlightCurrentPlayerDom(currentPlayer);
    }
  
    const checkForWin = () => {
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
  
    gameboardDom.addEventListener('click', gameRound);
  };
})();