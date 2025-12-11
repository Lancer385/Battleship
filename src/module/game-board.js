import { Ship } from "./ship"

export class Gameboard {
    constructor(){
        this.board = [];
        this.size = 10;
    }
    makeBoard(){
        if (this.board.length === this.size){
            return;
        }
        for (let i = 0; i < this.size; i++){
            this.board.push([]);
            for(let j = 0; j < this.size; j++){
                this.board[i].push(0);
            }
        };
    }
    placeShip(coordinates){

    }
}


