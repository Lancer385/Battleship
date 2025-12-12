import { Ship } from "./module/ship";
import { Gameboard } from "./module/game-board";

describe("Ship", () => {
    test("starts afloat and eventually sinks when hit enough", () => {
        const boat = new Ship("Boat", 2);

        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(true);
    });

    test("Ship identity is accessible", () => {
        const cruiser = new Ship("Cruiser", 3);

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

    test("places a 1-length ship correctly", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.placeShip("destroyer", 1, 0, 3);

        expect(board.board[0][3]).toBe(0);
        expect(board.ships.length).toBe(1);
    });

    test("does NOT place a ship if position is invalid", () => {
        const board = new Gameboard();
        board.makeBoard();

        // place first ship
        board.placeShip("destroyer", 1, 0, 3);

        // try placing another one illegally
        board.placeShip("destroyer", 1, 1, 3);

        // NO new ship should be added
        expect(board.ships.length).toBe(1);

        // board must remain unchanged at that spot
        expect(board.board[1][3]).toBe(99);
    });

    test("out of bounds placement is rejected", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.placeShip("sub", 3, 0, 8);

        // ship should NOT be placed
        expect(board.ships.length).toBe(0);

        // board stays empty
        for (const row of board.board) {
            expect(row.every(c => c === 99)).toBe(true);
        }
    });

    test("ship occupies correct cells when placed", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.placeShip("cruiser", 3, 2, 4);

        expect(board.board[2][4]).toBe(0);
        expect(board.board[2][5]).toBe(0);
        expect(board.board[2][6]).toBe(0);
    });
    
    test("can place multiple ships in valid non-touching positions", () => {
    const board = new Gameboard();
    board.makeBoard();

    // Ship 0
    board.placeShip("destroyer", 2, 0, 0);
    // Ship 1
    board.placeShip("submarine", 3, 2, 5);

    expect(board.ships.length).toBe(2);

    // Check ship 0 cells
    expect(board.board[0][0]).toBe(0);
    expect(board.board[0][1]).toBe(0);

    // Check ship 1 cells
    expect(board.board[2][5]).toBe(1);
    expect(board.board[2][6]).toBe(1);
    expect(board.board[2][7]).toBe(1);
    });
    
    test("ships do NOT overwrite each other on the board", () => {
    const board = new Gameboard();
    board.makeBoard();

    // Place first ship
    board.placeShip("destroyer", 2, 0, 0);

    // Attempt to illegally overlap second ship
    board.placeShip("patrol", 2, 0, 1);

    // Should still be only 1 ship
    expect(board.ships.length).toBe(1);

    // Board must still reflect ship 0 only
    expect(board.board[0][0]).toBe(0);
    expect(board.board[0][1]).toBe(0);
    });


});
    


