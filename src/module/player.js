import { Gameboard } from "./game-board.js";

export class Player {
    constructor(name, identity){
        this.name = name;
        this.identity = identity;
        this.board = new Gameboard();
    }
}