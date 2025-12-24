import { GameController } from "../module/game-controller";
import './style.css';


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
            randomize: document.querySelector("#randomize")
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
                    x.classList.contains("blue") ? cell.id = 1 : cell.id = 2;
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
            this.game.makePlayers(blue);
            this.game.makePlayers(red);
            this.menu.classList.add("hidden");
            this.gameUI.classList.remove("hidden");
            this.#backgroundTransition();
            this.makeGrid()
            this.#selectShip()
        });
    }; 
 

    placeShip(){
        this.buttons.submit.addEventListener("click", () => {
            this.#pickAndPlaceShip();
            this.#updateGrid();
        })
    }

    getShips(){
        return this.game.getShips();
    }

    viewShips(){
        this.inputShip.addEventListener('input', (event) => {
            if (event.target.value.length === 2){
                let ship = this.#findShipByName();
                console.log(ship)
            }
        })
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
                if (col !== 99){
                    document.querySelector(`button[id ="${this.game.getID()}"][data-row="${rowIndex}"][data-column="${colIndex}"]`).textContent = col;
                };
            }
        }
    }
    #pickAndPlaceShip(){
        this.game.pickShip(this.#findShipByName());
        let coord = this.#coordinateTranslate()
        this.game.placeShip(coord[0], coord[1]);
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

    #findShipByName(){
        return this.getShips().find((e) => e.name === this.shipOptions.value);
    }

}







