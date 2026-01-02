import { GameBoard } from "./game-board.js";

export class Player {
    constructor(name, id){
        this.name = name;
        this.id = id;
        this.board = new GameBoard();
        this.pickedShip = null;
    }

    makeBoard(){
        this.board.makeBoard();
    }

    generateCoordinates(){
        this.board.generateCoordinates();
    }

    resetCoordinates(){
        this.board.resetCoordinates();
    }

    resetBoard(){
        this.board.resetBoard();
    }

    getBoard(){
        return this.board.getBoard();
    }

    getID(){
        return this.id;
    }

    isPlaced(){
        return this.board.isPlaced();
    }

    changePosition(ship){
        this.board.changePosition(ship);
    }

    pickShip(ship){
        this.pickedShip = ship; 
        return this.pickedShip;
    }

    isSunk(ship){
        return this.board.isSunk(ship);
    }

    getShips(){
        return this.board.getShips();
    }

    getPlacedShips(){
        return this.board.getPlacedShips();
    }

    placeShip(coords){
        if (!this.pickedShip || this.#isPlaced(this.pickedShip)) {
            return false;
        }
        if(this.board.canPlace(this.pickedShip, coords)){
            this.board.placeShip(this.pickedShip);
            this.pickedShip = null;
            return true;
        }
        return false;
    }

    reportSunkenShips() {
        return this.board.reportSunkenShips();
    }
    
    receiveAttack(coords) {
        return this.board.receiveAttack(coords);
    }

    randomizePlacement(){
    this.board.generateCoordinates();
        if (this.getPlacedShips().length !== 0) {
            this.resetBoardState();
        };
        for (let ship of this.getShips()) {
            if (Math.random() < 0.5) {
                this.changePosition(ship);
            }
            while (!this.#isPlaced(ship)){
                if (this.board.canPlace(ship, this.randomizer())){
                    this.board.placeShip(ship);
                }
            }
        }
    this.board.resetCoordinates();
    }

    randomizer(){
        const coords = this.board.generatedCoordinates;
        const random = Math.floor(Math.random() * coords.length);
        const value = coords[random];
        coords.splice(random, 1);
        return value;
    }

    #isPlaced(ship){
        return this.getPlacedShips().some(id => id.id === ship.id);
    }
 
    resetBoardState(){
        for (let ship of this.getPlacedShips()){
            ship.coordinates.length = 0;
        }
        this.getPlacedShips().length = 0;
        this.board.resetBoard();
        this.board.makeBoard();
    }

}