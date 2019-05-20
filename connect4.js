/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// const width = 7;
// const height = 6;

// let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])

class Game {
  constructor(p1, p2, width = 7, height = 6){
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.width = width;
    this.height = height;
    this.board = [];
    this.gameStatus = 1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  startGame() {
    this.makeBoard();
    this.makeHtmlBoard();
  }

  restartGame() {
    this.board = [];
    this.gameOver = false;
    this.makeBoard();
    this.assignColors();
    let pieces = document.getElementsByClassName('piece');
    while(pieces.length > 0){
      pieces[0].parentNode.removeChild(pieces[0]);
    }
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const gameBoard = document.getElementById('board');
    gameBoard.innerHTML = '';
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    gameBoard.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      gameBoard.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    // setTimeout(() => {
    //   alert(msg)
    // }, 100);  //might come back later

    this.gameOver = true;
  }

  handleClick(evt) {
    
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
  
    // switch players
    this.currPlayer = 
      this.currPlayer === this.players[0] ? this.players[1] : this.players [0];

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
  
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
  }

  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells => cells.every(
        ([y, x]) => y >= 0 &&
                    y < this.height &&
                    x >= 0 &&
                    x < this.width &&
                    this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

}
/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

/** makeHtmlBoard: make HTML table and row of column tops. */

/** findSpotForCol: given column x, return top empty y (null if filled) */

/** placeInTable: update DOM to place piece into HTML board */

/** endGame: announce game end */

/** handleClick: handle click of column top to play piece */

/** checkForWin: check board cell-by-cell for "does a win start here?" */

class Player {
  constructor(color){
    this.color = color;
  }
}

document.getElementById('start').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('player1color').value);
  let p2 = new Player(document.getElementById('player2color').value);
  new Game(p1, p2)
});
