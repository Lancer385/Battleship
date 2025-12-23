import { GameController } from "../module/game-controller";
import './style.css';


export class DOM {
    constructor(){
        this.game = new GameController();
        this.sea = {
            red : document.querySelector(".red"),
            blue : document.querySelector(".blue")
        };
        this.menu = document.querySelector("form")
        this.gameUI = document.querySelector(".container");
    }

    updateGrid(player){
        const board = player.getBoard();
        for (let x of Object.values(this.sea)){
            for (let [rowIndex, row] of board.entries()){
                for (let [colIndex, column] of row.entries()){
                    const cell = document.createElement("button");
                    cell.classList.add("cell");
                    cell.dataset.row = rowIndex;
                    cell.dataset.column = colIndex;
                    x.appendChild(cell);
                }
            }
        }
    }
    submit(){
        this.menu.addEventListener("submit", (e) => {
            e.preventDefault();
            const blue = this.menu.elements["blue"].value;
            const red = this.menu.elements["red"].value;
            this.game.makePlayers(blue);
            this.game.makePlayers(red);
            this.menu.classList.add("hidden");
            this.gameUI.classList.remove("hidden");
            document.querySelector("body").style.background = `linear-gradient(to left,#3d1419 50%,#0d2f4d 50%)`
        });
    }; 
}


const controls = {
    blue: document.querySelector(".blue-controls"),
    red : document.querySelector(".red-controls")
}

const sea = {
    blue: document.querySelector(".blue-sea"),
    red: document.querySelector(".red-sea")
}








