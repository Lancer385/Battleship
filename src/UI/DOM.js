import { GameController } from "../module/game-controller";
import "./style.css";

const human = 0;
const cpu = 1;

export class DOM {
    constructor(game){
        this.game = game;
        this.sea = {
            blue : document.querySelector(".blue"),
            red : document.querySelector(".red")
        };
        this.menu = document.querySelector("form");
        this.gameUI = document.querySelector(".container");
        this.gameOver = document.querySelector(".game-over");
        this.shipOptions = document.querySelector("#select-ship");
        this.inputShip = document.querySelector("#place-ship");
        this.winner = document.querySelector(".winner");
        this.buttons = {
            submit: document.querySelector("#submit-ship"),
            randomize: document.querySelector("#randomize"),
            start : document.querySelector("#start-game"),
            retry: document.querySelector("#retry")
        };
    }

    // event listeners
    submit(){
        this.menu.addEventListener("submit", (e) => {
            e.preventDefault();
            const blue = this.menu.elements.blue.value;
            const red = this.menu.elements.red.value;
            this.game.makeBluePlayer(blue, human);
            this.game.makeRedPlayer(red, cpu);
            this.menu.classList.add("hidden");
            this.gameUI.classList.remove("hidden");
            this.#backgroundTransition();
            this.makeGrid();
            this.#selectShip();
            this.randomizePlacement();
        });
    }; 

    randomizer(){
        this.buttons.randomize.addEventListener("click", () => {
            this.randomizePlacement();
        });
    }

    startGame(){
        this.buttons.start.addEventListener("click", () => {
            this.buttons.randomize.classList.add("hidden");
            this.buttons.start.classList.add("hidden");
            this.switchTurn();
            this.randomizePlacement();
            this.switchTurn();
            this.attack();
        });
    }

    attack(){
        const cells = document.querySelectorAll(".cell");
        for (let cell of cells) {
            if (this.#getPlayerByID(cell.dataset.id).identity === cpu){
                cell.classList.remove("unClickable");
            }
            cell.addEventListener("click", (e) => {
                let row = e.target.dataset.row;
                let col = e.target.dataset.column;
                if(this.game.attack([row, col])){
                   this.#checkGameState();
                   this.#toggleClick(this.game.getOpponent().id);
                   this.switchTurn();
                   this.#updateGrid();
                   this.game.cpuAttack();
                   setTimeout(() => {
                     this.#updateGrid();
                     this.#toggleClick(this.game.getOpponent().id);
                     this.#checkGameState();
                   }, 1500);
                };
            });
        }
    }

    retry(){
        this.buttons.retry.addEventListener("click", () =>{
            this.gameOver.classList.add("hidden");
            this.game.resetTheGame();
            this.resetGrid();
            for (let cell of document.querySelectorAll(".cell")){
                cell.classList.add("unClickable");
            };
            this.buttons.randomize.classList.remove("hidden");
            this.buttons.start.classList.remove("hidden");
        });
    }
    // helper methods - main methods

    makeGrid(){
        const board = this.game.getBoard();
        for (let x of Object.values(this.sea)){
            for (let [rowIndex, row] of board.entries()){
                for (let [colIndex, column] of row.entries()){
                    const cell = document.createElement("button");
                    cell.classList.add("cell", "unClickable");
                    cell.dataset.row = rowIndex;
                    x.classList.contains("blue") ? cell.dataset.id = 1 : cell.dataset.id = 2;
                    cell.dataset.column = colIndex;
                    x.appendChild(cell);
                }
            }
        }
    }

    randomizePlacement(){
            this.resetGrid();
            this.game.randomizePlacement();
            if (this.game.getActivePlayer().identity === human){
                this.#updateGrid();
            }
            
    }
     
    resetGrid(){
        document.querySelectorAll(`button[data-id ="${this.game.getID()}"]`).forEach((node) => {
            node.classList.remove("piece");
            node.classList.remove("hit");
            node.classList.remove("miss");
        });
    }

    switchTurn(){
        this.game.switchTurn();
    }

    getShips(){
        return this.game.getShips();
    }

    #checkGameState(){
        const gameState = this.game.checkGameState();
        if (gameState.isGameOver){
            this.gameOver.classList.remove("hidden");
            for (let player of Object.values(this.game.players)){
                if (gameState.whoLost !== player){
                    this.winner.textContent = `${player.name}`;
                }
            }
        }
    }

    #backgroundTransition(){
        document.querySelector("body").style.background = "linear-gradient(to left,#3d1419 50%,#0d2f4d 50%)";
    }

    #updateGrid(){
        const board = this.game.getBoard();
        for (let [rowIndex, row] of board.entries()){
            for (let [colIndex, col] of row.entries()){
                let cell = document.querySelector(`button[data-id ="${this.game.getID()}"][data-row="${rowIndex}"][data-column="${colIndex}"]`);
                    if (col === -1 ){
                        cell.classList.add("miss");
                    }
                    if (col === 69){
                        cell.classList.add("hit");
                    }
                    if (col >= 0 && col <= this.getShips().length){
                        cell.classList.add("piece");
                    }
            }
        }
    }

    #toggleClick(id){
        for (let cell of document.querySelectorAll(`button[data-id="${id}"]`)){
            cell.classList.contains("unClickable")? cell.classList.remove("unClickable"): cell.classList.add("unClickable");
        }
    }
 
    #getPlayerByID(id){
        return Object.values(this.game.players).find(player => player.id === Number(id) );
    }

    #findShipByName(){
        return this.getShips().find(e => e.name === this.shipOptions.value);
    }




    // unused
    placeShip(){
        this.buttons.submit.addEventListener("click", () => {
            this.#pickAndPlaceShip();
            this.#updateGrid();
        });
    }

        #pickAndPlaceShip(){
        this.game.pickShip(this.#findShipByName());
        let coord = this.#coordinateTranslate();
        this.game.placeShip(coord);
        console.table(this.game.getBoard());
    }

    #coordinateTranslate(){
        if (!this.inputShip.value){
            return [99,99];
        }
        let arr = this.inputShip.value.split("");
        let [char, num] = arr;
        arr = [char.toUpperCase().charCodeAt() - 65, num - 1];
        return arr;
    }

    #selectShip(){
        let ships = this.getShips();
        for (let ship of ships){
            let item = document.createElement("option");
            [item.textContent, item.value] = [ship.name, ship.name];
            this.shipOptions.appendChild(item);
        }
    }

    // this one isn't even complete
    viewShips(){
        this.inputShip.addEventListener("input", (event) => {
            if (event.target.value.length === 2){
                let ship = this.#findShipByName();
                console.log(ship);
            }
        });
    }

}







