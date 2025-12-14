import { Ship } from "./module/ship";
import { Gameboard } from "./module/game-board";
import { GameController } from "./module/game-controller";

describe("Ship", () => {
    test("starts afloat and eventually sinks when hit enough", () => {
        const boat = new Ship("Boat", 2, 0, 0);

        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(true);
    });

    test("Ship identity is accessible", () => {
        const cruiser = new Ship("Cruiser", 3, 0, 2);

        expect(cruiser.name).toBe("Cruiser");
        expect(cruiser.length).toBe(3);
    });
});

describe("Game Board", () => {
    test("does NOT place a ship if position is invalid", () => {
        const board = new Gameboard();
        board.makeBoard();

        // place first ship (destroyer - length 2)
        const ship1 = board.ships[4]; // Destroyer
        board.placeShip(ship1, 0, 3);

        // try placing another one illegally (diagonal neighbor)
        const ship2 = board.ships[3]; // Submarine
        board.placeShip(ship2, 1, 3);

        // NO new ship should be added to placedShips
        expect(board.placedShips.length).toBe(1);

        // board must remain unchanged at that spot
        expect(board.board[1][3]).toBe(99);
    });

    test("out of bounds horizontal placement is rejected", () => {
        const board = new Gameboard();
        board.makeBoard();

        const ship = board.ships[2]; // Cruiser - length 3
        board.placeShip(ship, 0, 8); // would go to columns 8, 9, 10 (out of bounds)

        // ship should not be placed
        expect(board.placedShips.length).toBe(0);

        // board stays empty
        for (const row of board.board) {
            expect(row.every(c => c === 99)).toBe(true);
        }
    });

    test("vertical ship goes out of bounds and gets rejected", () => {
        const board = new Gameboard();
        board.makeBoard();

        const ship = board.ships[2]; // Cruiser - length 3
        ship.changePosition(); // make it vertical
        board.placeShip(ship, 8, 5);

        expect(board.placedShips.length).toBe(0);
        expect(board.board[8][5]).toBe(99);
    });

    test("vertical ships cannot touch diagonally", () => {
        const board = new Gameboard();
        board.makeBoard();

        const ship1 = board.ships[4]; // Destroyer
        ship1.changePosition(); // vertical
        board.placeShip(ship1, 3, 3);
        
        const ship2 = board.ships[3]; // Submarine
        ship2.changePosition(); // vertical
        board.placeShip(ship2, 2, 4);

        expect(board.placedShips.length).toBe(1);
    });
});

