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
            this.activePlayer = this.players.blue;
        } 
        else {
            this.players.red = new Player(name, identity);

        }
    }
    switchTurn(){
        this.activePlayer = this.activePlayer === this.players.blue ? this.players.red : this.players.blue;
    }
    #isPlaced(ship){
        return this.activePlayer.board.placedShips.some(id => id.id === ship.id);
    }
    #randomizer0_9(){
        return Math.floor(Math.random() * 10);
    }

    randomizePlacement(){
        let playerBoard = this.activePlayer.board;
        playerBoard.makeBoard()
        let ships = this.activePlayer.board.ships;
        
        for (let ship of ships) {
            if (Math.random() < 0.5) {
                ship.changePosition();
            }
            while (!this.#isPlaced(ship)){
                if (playerBoard.canPlace(ship, this.#randomizer0_9(), this.#randomizer0_9())){
                    playerBoard.placeShip(ship);
                }
            }
        }
    }
}

