import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.board = [];
    this.size = 10;
    this.ships = [
     new Ship("Carrier", 5, 0, 0),
     new Ship("Battleship", 4, 1, 0), 
     new Ship("Cruiser", 3, 2, 1),
     new Ship("Submarine", 3, 3, 0),
     new Ship("Destroyer", 2, 4, 1),
     new Ship("Destroyer Ultra", 2, 5, 1),
     new Ship("Patrol Boat", 1, 6, 0),
     new Ship("Speedboat", 1, 7, 0)
    ];
    this.placedShips = [];
    this.generatedCoordinates = [];
  }

  generateCoordinates(){
    if (this.generatedCoordinates.length === 0){
      for (let [rowIndex, row] of this.board.entries()){
        for (let [colIndex, col ] of row.entries()){
          this.generatedCoordinates.push([rowIndex, colIndex]);
        }
      }
    }
  }

  resetCoordinates(){
    this.generatedCoordinates = [];
    this.generateCoordinates();
  }

  resetBoard() {
    this.board.length = 0;
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

  getBoard(){
    return this.board;
  }

  getShips(){
      return this.ships;
  }

  getPlacedShips(){
    return this.placedShips;
  }

  // used for validation
  makeMockBoard() {
    return this.board.map((row) => [...row]);
  }

  changePosition(ship){
      ship.changePosition();
  }

  placeShip(ship) { // ship here is this.ships[shipID]
    if (!ship) {
        return;
    }
    for (let i = 0; i < ship.length; i++) {
      this.board[ship.coordinates[i][0]][ship.coordinates[i][1]] = ship.id;
    }
    this.placedShips.push(ship);
  }

  isPlaced(){
    return this.placedShips.length === this.ships.length;
  }

  receiveAttack(coords){
    const [x, y] = coords;
    if (this.board[x][y] === -1 /* (default number for misses) */  || this.board[x][y] === 69 /* nice! */ ){
      return false; // can't hit this, try again
    }
    if (this.board[x][y] === 99){ 
      this.board[x][y] = -1; 
    }
    else {
     this.ships[this.board[x][y]].hit += 1;
     this.board[x][y] = 69;
    }
    return true; // Goodjob hitting or... missing. it's your opponent's turn
  }

  getHitState(ship){
    return this.ships[ship].getHitState();
  }

  isSunk(ship){
    return this.ships[ship].isSunk();
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
        if (checkX < 0 || checkX > 9 || checkY < 0 || checkY > 9) {
          continue;
        }
        if (board[checkX][checkY] !== 99 && board[checkX][checkY] !== ship.id) {
          return false;
        }
      }
    }
    return true;
  }

  canPlace(ship, coords) {
    const [x, y] = coords;
    if (x < 0 || y < 0 || x > 9 || y > 9) {
      return false;
    }
    ship.setPosition(x, y);
    const mockBoard = this.makeMockBoard();
    let placement = ship.coordinates;
    // checks out of bounds
    for (let coord of placement) {
        if (coord[0] < 0 || coord[0] >= this.size || 
            coord[1] < 0 || coord[1] >= this.size) {
            return false;
        }
    }
    // 99 means empty cell
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

