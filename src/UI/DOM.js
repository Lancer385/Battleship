import { GameController } from "../module/game-controller";
import './style.css';

const game = new GameController();

const gameUI = document.querySelector(".container");
const controls = {
    blue: document.querySelector(".blue-controls"),
    red : document.querySelector(".red-controls")
}

const sea = {
    blue: document.querySelector(".blue-sea"),
    red: document.querySelector(".red-sea")
}

const menu = document.querySelector("form");


menu.addEventListener("submit", (e) => {
    e.preventDefault();
    const blue = menu.elements["blue"].value;
    const red = menu.elements["red"].value;
    game.makePlayers(blue);
    game.makePlayers(red);
    menu.classList.add("hidden");
    gameUI.classList.remove("hidden");
    document.querySelector("body").style.background = `linear-gradient(to left,#3d1419 50%,#0d2f4d 50%)`
    displayGrid();
})

function displayGrid(){
    const sea = {
        red : document.querySelector(".red"),
        blue : document.querySelector(".blue")
    };
    const board = game.getPlayerBoard();
    for (let x of Object.values(sea)){
        board.forEach((row, rowIndex) => { 
            row.forEach((colIndex) =>{
            const cell = document.createElement("button");
            cell.classList.add("cell");
            cell.dataset.row = rowIndex;
            cell.dataset.column = colIndex;
            x.appendChild(cell);
        });
    });
}
}