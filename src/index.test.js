import { Ship } from "./module/ship";
import { Gameboard } from "./module/game-board";

describe("Ship", () => {
    test("starts afloat and eventually sinks when hit enough", () => {
        const boat = new Ship("Boat", 2, 0);

        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(true);
    });

    test("Ship identity is accessible", () => {
        const cruiser = new Ship("Cruiser", 3, 0);

        expect(cruiser.name).toBe("Cruiser");
        expect(cruiser.length).toBe(3);
    });
});

describe("Game Board", () => {
    test("testing gameboard size (default is 10)", () => {
        const gameboard = new Gameboard();
        gameboard.makeBoard();
        expect(gameboard.board.length).toBe(10);
    });

    test("testing multiple makeBoard calls and it should still be the same size", () => {
        const gameboard = new Gameboard();
        gameboard.makeBoard();
        gameboard.makeBoard();
        gameboard.makeBoard();
        gameboard.makeBoard();
        gameboard.makeBoard();
        expect(gameboard.board.length).toBe(10);
    });

    test("places a 1-length horizontal ship correctly", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("destroyer", 1, 0); // 0 = horizontal
        const ship = board.createdShips[0];
        board.placeShip(ship, 0, 3);

        expect(board.board[0][3]).toBe(0);
        expect(board.placedShips.length).toBe(1);
    });

    test("does NOT place a ship if position is invalid", () => {
        const board = new Gameboard();
        board.makeBoard();

        // place first ship
        board.createShip("destroyer", 1, 0);
        const ship1 = board.createdShips[0];
        board.placeShip(ship1, 0, 3);

        // try placing another one illegally (diagonal neighbor)
        board.createShip("destroyer", 1, 0);
        const ship2 = board.createdShips[1];
        board.placeShip(ship2, 1, 3);

        // NO new ship should be added
        expect(board.placedShips.length).toBe(1);

        // board must remain unchanged at that spot
        expect(board.board[1][3]).toBe(99);
    });

    test("out of bounds horizontal placement is rejected", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("sub", 3, 0);
        const ship = board.createdShips[0];
        board.placeShip(ship, 0, 8); // would go to columns 8, 9, 10 (out of bounds)

        // ship should not be placed
        expect(board.placedShips.length).toBe(0);

        // board stays empty
        for (const row of board.board) {
            expect(row.every(c => c === 99)).toBe(true);
        }
    });

    test("horizontal ship occupies correct cells when placed", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("cruiser", 3, 0);
        const ship = board.createdShips[0];
        board.placeShip(ship, 2, 4); // horizontal at (2,4)

        expect(board.board[2][4]).toBe(0);
        expect(board.board[2][5]).toBe(0);
        expect(board.board[2][6]).toBe(0);
    });
    
    test("can place multiple horizontal ships in valid non-touching positions", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("destroyer", 2, 0);
        const ship1 = board.createdShips[0];
        board.placeShip(ship1, 0, 0);

        board.createShip("submarine", 3, 0);
        const ship2 = board.createdShips[1];
        board.placeShip(ship2, 2, 5);

        expect(board.placedShips.length).toBe(2);

        expect(board.board[0][0]).toBe(0);
        expect(board.board[0][1]).toBe(0);

        expect(board.board[2][5]).toBe(1);
        expect(board.board[2][6]).toBe(1);
        expect(board.board[2][7]).toBe(1);
    });
    
    test("horizontal ships do NOT overwrite each other on the board", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("destroyer", 2, 0);
        const ship1 = board.createdShips[0];
        board.placeShip(ship1, 0, 0);

        board.createShip("patrol", 2, 0);
        const ship2 = board.createdShips[1];
        board.placeShip(ship2, 0, 1);

        expect(board.placedShips.length).toBe(1);

        expect(board.board[0][0]).toBe(0);
        expect(board.board[0][1]).toBe(0);
    });

    test("places a vertical ship correctly", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("destroyer", 3, 1);
        const ship = board.createdShips[0];
        board.placeShip(ship, 2, 4);
        
        expect(board.board[2][4]).toBe(0);
        expect(board.board[3][4]).toBe(0);
        expect(board.board[4][4]).toBe(0);
        expect(board.placedShips.length).toBe(1);
    });

    test("vertical ship goes out of bounds and gets rejected", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("cruiser", 3, 1);
        const ship = board.createdShips[0];
        board.placeShip(ship, 8, 5);

        expect(board.placedShips.length).toBe(0);
        expect(board.board[8][5]).toBe(99);
    });

    test("vertical and horizontal ships can coexist peacefully", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("destroyer", 2, 0);
        const ship1 = board.createdShips[0];
        board.placeShip(ship1, 0, 0);
        
        board.createShip("submarine", 3, 1);
        const ship2 = board.createdShips[1];
        board.placeShip(ship2, 5, 7);

        expect(board.placedShips.length).toBe(2);
        
        expect(board.board[0][0]).toBe(0);
        expect(board.board[0][1]).toBe(0);
        
        expect(board.board[5][7]).toBe(1);
        expect(board.board[6][7]).toBe(1);
        expect(board.board[7][7]).toBe(1);
    });

    test("vertical ships cannot touch diagonally", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("destroyer", 2, 1);
        const ship1 = board.createdShips[0];
        board.placeShip(ship1, 3, 3);
        
        board.createShip("patrol", 2, 1);
        const ship2 = board.createdShips[1];
        board.placeShip(ship2, 2, 4);

        expect(board.placedShips.length).toBe(1);
    });

    test("vertical ship at column 0 works fine", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("battleship", 4, 1);
        const ship = board.createdShips[0];
        board.placeShip(ship, 2, 0);

        expect(board.placedShips.length).toBe(1);
        expect(board.board[2][0]).toBe(0);
        expect(board.board[3][0]).toBe(0);
        expect(board.board[4][0]).toBe(0);
        expect(board.board[5][0]).toBe(0);
    });

    test("mixing vertical and horizontal ships with proper spacing", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.createShip("carrier", 5, 0);
        const ship1 = board.createdShips[0];
        board.placeShip(ship1, 0, 0);
        
        board.createShip("battleship", 4, 1);
        const ship2 = board.createdShips[1];
        board.placeShip(ship2, 3, 3);
        
        board.createShip("cruiser", 3, 0);
        const ship3 = board.createdShips[2];
        board.placeShip(ship3, 9, 6);

        expect(board.placedShips.length).toBe(3);
    });
});