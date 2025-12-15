import { Gameboard } from "./game-board.js";
import { Player } from "./player.js";

export class GameController {
    constructor(){
        this.players = {
            blue : null,
            red : null
        }
        this.activePlayer = null;
    }

    makePlayers(name, identity){
        if (this.players.blue === null) {
            this.players.blue = new Player(name, identity);
            this.players.blue.board.makeBoard();
            this.activePlayer = this.players.blue;
        } 
        else {
            this.players.red = new Player(name, identity);
            this.players.red.board.makeBoard();

        }
    }
    switchTurn(){
        this.activePlayer = this.activePlayer === this.players.blue ? this.players.red : this.players.blue;
    }

    getOpponent(){
        return this.activePlayer === this.players.red ? this.players.blue: this.players.red;
    }

    randomizer(){
        this.activePlayer.randomizePlacement()
    }

    pickShipPrompt(shipID){
        this.activePlayer.pickShip(shipID);
    }
    placeShipPrompt(x, y){
        return this.activePlayer.placePlayerShip(x, y)
    }
    attack(x, y){
        return this.getOpponent().board.receiveAttack(x, y)
    }

    checkGameState(){
        for (let player of Object.values(this.players)){
            if (player.board.reportSunkenShips()){

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
            player.board.makeBoard();
        }
    }
}

