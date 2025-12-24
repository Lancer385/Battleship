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

    makePlayers(name, identity){
        if (this.players.blue === null) {
            this.players.blue = new Player(name, 1, identity);
            this.players.blue.makeBoard();
            this.activePlayer = this.players.blue;
        } 
        else {
            this.players.red = new Player(name, 2, identity);
            this.players.red.makeBoard();

        }
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

    placeShip(x, y){
        return this.activePlayer.placePlayerShip(x, y);
    }

    attack(x, y){
        return this.getOpponent().receiveAttack(x, y);
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

