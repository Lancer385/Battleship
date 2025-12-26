import { Gameboard } from "./game-board.js";
import { Player } from "./player.js";

export class GameController {
    constructor(){
        this.players = {
            blue : null,
            red : null
        };
        this.activePlayer = null;
    }
    getID(){
        return this.activePlayer.getID();
    }
    getShips(){
        return this.getActivePlayer().getShips();
    }

    getPlacedShips(){
        return {
            blue: this.players.blue.getPlacedShips(),
            red:  this.players.red.getPlacedShips()
        };
    }

    getBoard(){
        return this.activePlayer.getBoard();
    }
    makeBluePlayer(name, identity){
        this.players.blue = new Player(name, 1, identity);
        this.players.blue.makeBoard();
        this.activePlayer = this.players.blue;
    }
    makeRedPlayer(name, identity){
        this.players.red = new Player(name, 2, identity);
        this.players.red.makeBoard();
    }
    isPlaced(){
        return this.activePlayer.isPlaced();
    }

    isAllPlaced(){
        if (Object.values(this.players).every(Boolean)){
            return true;
        }
        return false;
    }
    switchTurn(){
        this.activePlayer = this.activePlayer === this.players.blue ? this.players.red : this.players.blue;
    }

    getActivePlayer(){
        return this.activePlayer === this.players.red ? this.players.red: this.players.blue;
    }

    getOpponent(){
        return this.activePlayer === this.players.red ? this.players.blue: this.players.red;
    }

    randomizer(){
        this.activePlayer.randomizePlacement();
    }

    pickShip(ship){
        this.activePlayer.pickShip(ship);
    }

    placeShip(coords){
        return this.activePlayer.placePlayerShip(coords);
    }

    attack(coords){
        return this.getOpponent().receiveAttack(coords);
    }

    checkGameState(){
        for (let player of Object.values(this.players)){
            if (player.reportSunkenShips()){

                return {
                    isGameOver: true,
                    whoLost: player,
                };
            }
        }
        return {isGameOver: false};
    }

    resetTheGame(){
        for (let player of Object.values(this.players)){
            player.board = new Gameboard();
            player.makeBoard();
        }
    }
}

