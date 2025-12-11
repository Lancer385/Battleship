import { Ship } from './module/ship';
import { Gameboard } from './module/game-board';

describe('Ship', () => {
    test('starts afloat and eventually sinks when hit enough', () => {
        const boat = new Ship('Boat', 2);

        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(true);
    });

    test('Ship identity is accessible', () => {
        const cruiser = new Ship('Cruiser', 3);

        expect(cruiser.name).toBe('Cruiser');
        expect(cruiser.length).toBe(3);
    });
});

describe('Game Board', () => {
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
})