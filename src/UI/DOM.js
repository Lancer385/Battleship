import { GameController } from "../module/game-controller";
import './style.css';

const human = 0;
const cpu = 1;

export class DOM {
    constructor(){
        this.game = new GameController();
        this.sea = {
            blue : document.querySelector(".blue"),
            red : document.querySelector(".red")
        };
        this.menu = document.querySelector("form")
        this.gameUI = document.querySelector(".container");
        this.shipOptions = document.querySelector("#select-ship")
        this.inputShip = document.querySelector("#place-ship");
        this.buttons = {
            submit: document.querySelector("#submit-ship"),
            randomize: document.querySelector("#randomize"),
            start : document.querySelector("#start-game")
        }
    }

    makeGrid(){
        const board = this.game.getBoard();
        for (let x of Object.values(this.sea)){
            for (let [rowIndex, row] of board.entries()){
                for (let [colIndex, column] of row.entries()){
                    const cell = document.createElement("button");
                    cell.classList.add("cell");
                    cell.dataset.row = rowIndex;
                    x.classList.contains("blue") ? cell.dataset.id = 1 : cell.dataset.id = 2;
                    cell.dataset.column = colIndex;
                    cell.textContent = column;
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
            this.game.makeBluePlayer(blue, human);
            this.game.makeRedPlayer(red, cpu);
            this.menu.classList.add("hidden");
            this.gameUI.classList.remove("hidden");
            this.#backgroundTransition();
            this.makeGrid()
            this.#selectShip()
            this.randomizePlacement();
        });
    }; 
 

    placeShip(){
        this.buttons.submit.addEventListener("click", () => {
            this.#pickAndPlaceShip();
            this.#updateGrid();
        })
    }

    viewShips(){
        this.inputShip.addEventListener('input', (event) => {
            if (event.target.value.length === 2){
                let ship = this.#findShipByName();
                console.log(ship)
            }
        })
    }

    resetGrid(){
        document.querySelectorAll(`button[data-id ="${this.game.getID()}"]`).forEach((node) => {
            node.textContent = 99;
        })
    }
    randomizer(){
        this.buttons.randomize.addEventListener('click', () => {
            this.randomizePlacement();
        })
    }

    randomizePlacement(){
            this.resetGrid();
            this.game.randomizePlacement();
            this.#updateGrid();
    }
    switchTurn(){
        this.game.switchTurn();
    }
    getShips(){
        return this.game.getShips();
    }

    startGame(){
        this.buttons.start.addEventListener("click", () => {
            this.buttons.randomize.classList.add("hidden")
            this.buttons.start.classList.add("hidden");
            this.switchTurn();
            this.randomizePlacement();
            this.switchTurn();
            this.attack();
        })
    }
    attack(){
        const cells = document.querySelectorAll(".cell");
        for (let cell of cells) {
            if (this.#getPlayerByID(cell.dataset.id).identity === human){
                cell.classList.add("unClickable");
            }
            cell.addEventListener("click", (e) => {
                let row = e.target.dataset.row
                let col = e.target.dataset.column
                if(this.game.attack([row, col])){
                   e.target.textContent = this.game.getOpponent().getBoard()[row][col];
                   this.#checkGameState();
                   this.#toggleClick(this.game.getOpponent().id)
                   this.switchTurn();
                   this.game.cpuAttack();
                   setTimeout(() => {
                     this.#updateGrid()
                     this.#toggleClick(this.game.getOpponent().id)
                     this.#checkGameState();
                   }, 3000);
                };
            })
        }
    }
    #checkGameState(){
        const gameState = this.game.checkGameState()
        if (gameState.isGameOver){
            console.log(`loser is: ${gameState.whoLost.name}`)
        }
    }
    #backgroundTransition(){
        document.querySelector("body").style.background = `linear-gradient(to left,#3d1419 50%,#0d2f4d 50%)`
    }
    #selectShip(){
        let ships = this.getShips();
        for (let ship of ships){
            let item = document.createElement("option");
            [item.textContent, item.value] = [ship.name, ship.name];
            this.shipOptions.appendChild(item);
        }
    }
    #updateGrid(){
        const board = this.game.getBoard()
        for (let [rowIndex, row] of board.entries()){
            for (let [colIndex, col] of row.entries()){
                let cell = document.querySelector(`button[data-id ="${this.game.getID()}"][data-row="${rowIndex}"][data-column="${colIndex}"]`);
                    cell.textContent = col;
            }
        }
    }
    #toggleClick(id){
        for (let cell of document.querySelectorAll(`button[data-id="${id}"]`)){
            cell.classList.contains("unClickable")? cell.classList.remove("unClickable"): cell.classList.add("unClickable");
        }
    }
    #pickAndPlaceShip(){
        this.game.pickShip(this.#findShipByName());
        let coord = this.#coordinateTranslate()
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
    #getPlayerByID(id){
        return Object.values(this.game.players).find(player => player.id === Number(id) )
    }
    #findShipByName(){
        return this.getShips().find(e => e.name === this.shipOptions.value);
    }

}







