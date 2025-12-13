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

        board.placeShip("destroyer", 1, 0, 3, 0); // 0 = horizontal

        expect(board.board[0][3]).toBe(0);
        expect(board.ships.length).toBe(1);
    });

    test("does NOT place a ship if position is invalid", () => {
        const board = new Gameboard();
        board.makeBoard();

        // place first ship
        board.placeShip("destroyer", 1, 0, 3, 0);

        // try placing another one illegally (diagonal neighbor)
        board.placeShip("destroyer", 1, 1, 3, 0);

        // NO new ship should be added
        expect(board.ships.length).toBe(1);

        // board must remain unchanged at that spot
        expect(board.board[1][3]).toBe(99);
    });

    test("out of bounds horizontal placement is rejected", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.placeShip("sub", 3, 0, 8, 0); // would go to columns 8, 9, 10 (out of bounds)

        // ship should not be placed
        expect(board.ships.length).toBe(0);

        // board stays empty
        for (const row of board.board) {
            expect(row.every(c => c === 99)).toBe(true);
        }
    });

    test("horizontal ship occupies correct cells when placed", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.placeShip("cruiser", 3, 2, 4, 0); // horizontal at (2,4)

        expect(board.board[2][4]).toBe(0);
        expect(board.board[2][5]).toBe(0);
        expect(board.board[2][6]).toBe(0);
    });
    
    test("can place multiple horizontal ships in valid non-touching positions", () => {
        const board = new Gameboard();
        board.makeBoard();

        // Ship 0
        board.placeShip("destroyer", 2, 0, 0, 0);
        // Ship 1 (far away)
        board.placeShip("submarine", 3, 2, 5, 0);

        expect(board.ships.length).toBe(2);

        // Check ship 0 cells
        expect(board.board[0][0]).toBe(0);
        expect(board.board[0][1]).toBe(0);

        // Check ship 1 cells
        expect(board.board[2][5]).toBe(1);
        expect(board.board[2][6]).toBe(1);
        expect(board.board[2][7]).toBe(1);
    });
    
    test("horizontal ships do NOT overwrite each other on the board", () => {
        const board = new Gameboard();
        board.makeBoard();

        // Place first ship
        board.placeShip("destroyer", 2, 0, 0, 0);

        // Attempt to illegally overlap second ship
        board.placeShip("patrol", 2, 0, 1, 0);

        // Should still be only 1 ship
        expect(board.ships.length).toBe(1);

        // Board must still reflect ship 0 only
        expect(board.board[0][0]).toBe(0);
        expect(board.board[0][1]).toBe(0);
    });

    // Vertical tests

    test("places a vertical ship correctly", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.placeShip("destroyer", 3, 2, 4, 1); // 1 = vertical
        
        // Check if ship occupies the right vertical cells
        expect(board.board[2][4]).toBe(0);
        expect(board.board[3][4]).toBe(0);
        expect(board.board[4][4]).toBe(0);
        expect(board.ships.length).toBe(1);
    });

    test("vertical ship goes out of bounds and gets rejected", () => {
        const board = new Gameboard();
        board.makeBoard();

        // Try placing a 3-length vertical ship at row 8
        // It would need rows 8, 9, 10 but 10 doesn't exist
        board.placeShip("cruiser", 3, 8, 5, 1);
        console.table(board.board)
        expect(board.ships.length).toBe(0);
        expect(board.board[8][5]).toBe(99);
    });

    test("vertical and horizontal ships can coexist peacefully", () => {
        const board = new Gameboard();
        board.makeBoard();

        // Horizontal ship
        board.placeShip("destroyer", 2, 0, 0, 0);
        
        // Vertical ship far away
        board.placeShip("submarine", 3, 5, 7, 1);

        expect(board.ships.length).toBe(2);
        
        // Horizontal check
        expect(board.board[0][0]).toBe(0);
        expect(board.board[0][1]).toBe(0);
        
        // Vertical check
        expect(board.board[5][7]).toBe(1);
        expect(board.board[6][7]).toBe(1);
        expect(board.board[7][7]).toBe(1);
    });

    test("vertical ships cannot touch diagonally", () => {
        const board = new Gameboard();
        board.makeBoard();

        // Place first vertical ship at (3,3) going down
        board.placeShip("destroyer", 2, 3, 3, 1);
        
        // Try placing another vertical ship diagonally adjacent at (2,4)
        board.placeShip("patrol", 2, 2, 4, 1);

        // Should reject the second ship!
        expect(board.ships.length).toBe(1);
    });

    test("vertical ship at column 0 works fine", () => {
        const board = new Gameboard();
        board.makeBoard();

        board.placeShip("battleship", 4, 2, 0, 1); // vertical at leftmost column

        expect(board.ships.length).toBe(1);
        expect(board.board[2][0]).toBe(0);
        expect(board.board[3][0]).toBe(0);
        expect(board.board[4][0]).toBe(0);
        expect(board.board[5][0]).toBe(0);
    });

    test("mixing vertical and horizontal ships with proper spacing", () => {
        const board = new Gameboard();
        board.makeBoard();

        // Horizontal at top
        board.placeShip("carrier", 5, 0, 0, 0);
        
        // Vertical in middle (with gap)
        board.placeShip("battleship", 4, 3, 3, 1);
        
        // Another horizontal at bottom (with gap)
        board.placeShip("cruiser", 3, 9, 6, 0);

        expect(board.ships.length).toBe(3);
    });
});