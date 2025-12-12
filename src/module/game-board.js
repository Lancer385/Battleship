import { Ship } from "./ship.js";

export class Gameboard {
    constructor(){
        this.board = [];
        this.size = 10;
        this.ships = [];
    }

    makeBoard(){
        if (this.board.length === this.size){
            return;
        }
        for (let i = 0; i < this.size; i++){
            this.board.push([]);
            for(let j = 0; j < this.size; j++){
                this.board[i].push(99);
            }
        };
    }

    makeMockBoard(){
        return this.board.map(row => [...row]);
    }

    #checkNearestNeighbor(board, ship){
        const directions = [
                // Writing comments for this because it's confusing af
                [-1, -1],  // top-left
                [-1,  0],  // top
                [-1,  1],  // top-right
                [ 0, -1],  // left
                [ 0,  1],  // right
                [+1, -1],  // bottom-left
                [+1,  0],  // bottom
                [+1,  1]   // bottom-right
            ];
        let shipID = ship.id;
        let coordinates = ship.coordinates
        for (let i = 0; i < coordinates.length; i++){
            for (let j = 0; j < directions.length; j++){
                let checkX = coordinates[i][0] + directions[j][0];
                let checkY = coordinates[i][1] + directions[j][1];
                if (checkX < 0 || checkX >= 10 || checkY < 0 || checkY >= 10){
                    continue;
                }
                if (board[checkX][checkY] !== 99 && board[checkX][checkY] !== shipID) {
                    return false;
                }
                    
            }
        }
        return true;
    }

    
    #canPlaceH(ship, x, y){
        let mockBoard = this.makeMockBoard();
        if (y + ship.length > this.size) {
            return false;
        }
        let temp = y;
        for (let i = 0; i < ship.length; i++){
            if (mockBoard[x][temp] !== 99){
                return false;
            }
            mockBoard[x][temp] = this.ships.length;
            temp++; 
        };
        let truthy = this.#checkNearestNeighbor(mockBoard, ship);
        if (!this.#checkNearestNeighbor(mockBoard, ship)){
            console.log(truthy)
            return false
        };
        return true;
    };

    #canPlaceV(ship, x){

    }
    placeShip(name, length, x, y){
        if (x < 0 || y < 0){
            return;
        }
        const ship = new Ship(name, length, 0);
        let temp1 = y;
        for (let i = 0; i < ship.length; i++){
            ship.coordinates.push([x, temp1]);
            temp1++;
        }
        ship.id = this.ships.length;
        if(!this.#canPlaceH(ship, x, y)){
            return;
        }
        let temp = y;
        for (let i = 0; i < ship.length; i++){
            this.board[x][temp] = this.ships.length;
            temp++;
        }
        this.ships.push(ship);
    }
}

const board = new Gameboard();

board.makeBoard();
board.placeShip("destroyer", 1 ,0, 3 );
board.placeShip("destroyer", 1 ,1, 3 );
console.table(board.board)
console.log(board.ships[0])
