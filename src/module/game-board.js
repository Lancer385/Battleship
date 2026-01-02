import { Ship } from "./ship.js";

// magic numbers
const hit = 69
const miss = -1
const empty = 99
export class GameBoard {
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
        this.board[i].push(empty);
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

  placeShip(ship) {
    if (!ship) {
        return;
    }
    for (let i = 0; i < ship.getLength(); i++) {
      this.board[ship.getCoordinates()[i][0]][ship.getCoordinates()[i][1]] = ship.getID();
    }
    this.placedShips.push(ship);
  }

  isPlaced(){
    return this.placedShips.length === this.ships.length;
  }

  receiveAttack(coords){
    const [x, y] = coords;
    if (this.board[x][y] === miss|| this.board[x][y] === hit){
      return false;
    }
    if (this.board[x][y] === empty){ 
      this.board[x][y] = miss; 
    }
    else {
     this.ships[this.board[x][y]].receiveHit();
     this.board[x][y] = hit;
    }
    return true;
  }


  isSunk(ship){
    return this.ships[ship].isSunk();
  }
  
  reportSunkenShips(){
    return this.ships.every(sunk => sunk.isSunk());
  }

  #checkNearestNeighbor(board, ship) {
    // edge cases: all the cells around a ship
    const directions = [
      [-1, -1],
      [-1, 0], 
      [-1, 1], 
      [0, -1], 
      [0, 1],
      [+1, -1],
      [+1, 0],
      [+1, 1],
    ];
    // saved coordinates for where the ship is going to be placed
    let coordinates = ship.getCoordinates();

    // checking all 8 directions for each cell, are they empty? then place it
    // (also excluding the same cell id to work well)
    for (let i = 0; i < coordinates.length; i++) {
      for (let j = 0; j < directions.length; j++) {
        let checkX = coordinates[i][0] + directions[j][0];
        let checkY = coordinates[i][1] + directions[j][1];
        if (checkX < 0 || checkX > 9 || checkY < 0 || checkY > 9) {
          continue;
        }
        if (board[checkX][checkY] !== empty && board[checkX][checkY] !== ship.getID()) {
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
    let placement = ship.getCoordinates();
    // checks out of bounds
    for (let coord of placement) {
        if (coord[0] < 0 || coord[0] >= this.size || 
            coord[1] < 0 || coord[1] >= this.size) {
            return false;
        }
    }
    for (let i = 0; i < placement.length; i++) {
      if (mockBoard[placement[i][0]][placement[i][1]] !== empty) {
        return false;
      }
      mockBoard[placement[i][0]][placement[i][1]] = ship.getID();
    }

    if (!this.#checkNearestNeighbor(mockBoard, ship)) {
      return false;
    }
    return true;
  }
}

