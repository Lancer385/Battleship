import { GameBoard } from "./game-board.js";
import { Player } from "./player.js";

export class GameController {
    constructor(){
        this.players = {
            blue : null,
            red : null
        };
        this.activePlayer = null;
    }
    getPlayers(){
        return this.players;
    }
    getActivePlayerID(){
        return this.activePlayer.getID();
    }

    getActivePlayerShips(){
        return this.getActivePlayer().getShips();
    }

    getActivePlayerBoard(){
        return this.activePlayer.getBoard();
    }

    makeBluePlayer(name, id){
        this.players.blue = new Player(name, id);
        this.players.blue.makeBoard();
        this.activePlayer = this.players.blue;
    }

    makeRedPlayer(name, id){
        this.players.red = new Player(name, id);
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
        return this.activePlayer;
    }

    getOpponent(){
        return this.activePlayer === this.players.red ? this.players.blue: this.players.red;
    }

    randomizePlacement(){
        this.activePlayer.randomizePlacement();
    }

    pickShip(ship){
        this.activePlayer.pickShip(ship);
    }

    placeShip(coords){
        return this.activePlayer.placeShip(coords);
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

    cpuAttack(){
        this.activePlayer.generateCoordinates();
        const random = this.activePlayer.randomizer();
        this.attack(random);
        this.switchTurn();
    }

    resetTheGame(){
        for (let player of Object.values(this.players)){
            player.board = new GameBoard();
            player.makeBoard();
        }
    }
}

