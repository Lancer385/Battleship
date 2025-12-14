import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.board = [];
    this.size = 10;
    this.ships = [
     new Ship("Carrier", 5, 0, 0),
     new Ship("Battleship", 4, 1, 0), 
     new Ship("Cruiser", 3, 2, 0),
     new Ship("Submarine", 3, 3, 0),
     new Ship("Destroyer", 2, 4, 0)
    ]
    this.placedShips = []
  }

  makeBoard() {
    if (this.board.length === this.size) {
      return;
    }
    for (let i = 0; i < this.size; i++) {
      this.board.push([]);
      for (let j = 0; j < this.size; j++) {
        this.board[i].push(99);
      }
    }
  }
  // used for validation, going to be useful later for the UI(if i actually end up implementing it 💀)
  makeMockBoard() {
    return this.board.map((row) => [...row]);
  }


  placeShip(ship, x, y) { // ship here is this.ships[shipID]
    if (x < 0 || y < 0 || x > 10 || y > 10) {
      return;
    }
    ship.setPosition(x, y);
    if (!ship || !this.#canPlace(ship)){
        return;
    }
    for (let i = 0; i < ship.length; i++) {
      this.board[ship.coordinates[i][0]][ship.coordinates[i][1]] = ship.id;
    }
    console.table(this.board)
    this.placedShips.push(ship);
  }

  receiveAttack(x, y){
    if (this.board[x][y] === -1 /* (default number for misses) */  || this.board[x][y] === 69 /* nice! */ ){
      return;
    }
    if (this.board[x][y] === 99){ 
      this.board[x][y] = -1 
    }
    else {
     this.ships[this.board[x][y]].hit += 1;
     this.board[x][y] = 69;
    }
  }
  reportSunkenShips(){
    return this.ships.every(sunk => sunk.isSunk());
  }
  #checkNearestNeighbor(board, ship) {
    // edge cases: is there anything nearby?
    const directions = [
      // Writing comments for this because it's confusing af
      [-1, -1], // top-left
      [-1, 0], // top
      [-1, 1], // top-right
      [0, -1], // left
      [0, 1], // right
      [+1, -1], // bottom-left
      [+1, 0], // bottom
      [+1, 1], // bottom-right
    ];
    // saved coordinates for where the ship is going to be placed
    let coordinates = ship.coordinates;

    // checking all 8 directions for each cell, are they empty? then place it
    // (also excluding the same cell id to work well)
    for (let i = 0; i < coordinates.length; i++) {
      for (let j = 0; j < directions.length; j++) {
        let checkX = coordinates[i][0] + directions[j][0];
        let checkY = coordinates[i][1] + directions[j][1];
        if (checkX < 0 || checkX >= 10 || checkY < 0 || checkY >= 10) {
          continue;
        }
        if (board[checkX][checkY] !== 99 && board[checkX][checkY] !== ship.id) {
          return false;
        }
      }
    }
    return true;
  }

  #canPlace(ship) {
    const mockBoard = this.makeMockBoard();
    let placement = ship.coordinates;
    // checks out of bounds
    for (let coord of placement) {
        if (coord[0] < 0 || coord[0] >= this.size || 
            coord[1] < 0 || coord[1] >= this.size) {
            return false;
        }
    }
    // 99 means empty cell, honestly i don't know what else to put so  ¯_(ツ)_/¯
    for (let i = 0; i < placement.length; i++) {
      if (mockBoard[placement[i][0]][placement[i][1]] !== 99) {
        return false;
      }
      mockBoard[placement[i][0]][placement[i][1]] = ship.id;
    }
    // check nearest neighbor
    if (!this.#checkNearestNeighbor(mockBoard, ship)) {
      return false;
    }
    return true;
  }
}

