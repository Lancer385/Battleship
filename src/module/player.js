import { Gameboard } from "./game-board.js";

export class Player {
    constructor(name, identity){
        this.name = name;
        this.identity = identity;
        this.board = new Gameboard();
        this.pickedShip = null;
    }
    makeBoard(){
        this.board.makeBoard();
    }
    resetBoard(){
        this.board.resetBoard();
    }
    getBoard(){
        return this.board.getBoard();
    }
    changePosition(ship){
        this.board.changePosition(ship);
    }
    pickShip(shipID){
        this.pickedShip = this.board.ships[shipID]; 
        return this.pickedShip;
    }

    getHitState(ship){
        return this.board.getHitState(ship);
    }

    isSunk(ship){
        return this.board.isSunk(ship);
    }
    placePlayerShip(x, y){
        if (!this.pickedShip || this.#isPlaced(this.pickedShip)) {
            return false;
        }
        if(this.board.canPlace(this.pickedShip, x, y)){
            this.board.placeShip(this.pickedShip);
            this.pickedShip = null;
            return true;
        }
        return false;
    }
    reportSunkenShips() {
        return this.board.reportSunkenShips();
    }
    
    receiveAttack(x, y) {
        return this.board.receiveAttack(x, y);
    }
    randomizePlacement(){
        if (this.board.placedShips.length !== 0) {
            this.resetBoardState();
        };
        for (let ship of this.board.ships) {
            if (Math.random() < 0.5) {
                this.changePosition(ship);
            }
            while (!this.#isPlaced(ship)){
                if (this.board.canPlace(ship, this.#randomizer0_9(), this.#randomizer0_9())){
                    this.board.placeShip(ship);
                }
            }
        }
    }

    #randomizer0_9(){
        return Math.floor(Math.random() * 10);
    }

    #isPlaced(ship){
        return this.board.placedShips.some(id => id.id === ship.id);
    }

    resetBoardState(){
        for (let ship of this.board.placedShips){
            ship.coordinates.length = 0;
        }
        this.board.placedShips.length = 0;
        this.board.resetBoard();
        this.board.createBoard();
    }

}