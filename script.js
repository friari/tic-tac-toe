// Gameboard, returns 2d board array and reset method
const gameboard = (() => {
  const _initGameboardRow = () => [undefined, undefined, undefined];
  const _initGameboard = () => {
    const _gameboardArray = [];
    for (let i = 0; i < 3; i++) {
      let _gameboardRow = _initGameboardRow();
      _gameboardArray.push(_gameboardRow);
    }
    return _gameboardArray;
  }
  const board = _initGameboard();
  const reset = _initGameboard;

  return { board, reset };
})();

// Player, sets player token
const createPlayer = (playerName, token) => {
  return { playerName, token }
}

const runGame = () => {
  
}

// what does the player need to do?
// player needs to be able to place token on board
// is that all?
// controller needs to know when the player is taking its turn, so maybe the player needs a playerturn?

// winning states
// row1 = gameboard[0][0], gameboard[0][1], gameboard[0][2]
// row2 = gameboard[1][0], gameboard[1][1], gameboard[1][2]
// row3 = gameboard[2][0], gameboard[2][1], gameboard[2][2]
[[0,0],[0,1],[0,2]]

// so we'll need nested loops