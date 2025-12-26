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
        if (board.canPlace(ship1, [0, 3])) {
            board.placeShip(ship1);
        }

        // try placing another one illegally (diagonal neighbor)
        const ship2 = board.ships[3]; // Submarine
        if (board.canPlace(ship2, [1, 3])) {
            board.placeShip(ship2);
        }

        // NO new ship should be added to placedShips
        expect(board.placedShips.length).toBe(1);

        // board must remain unchanged at that spot
        expect(board.board[1][3]).toBe(99);
    });

    test("out of bounds horizontal placement is rejected", () => {
        const board = new Gameboard();
        board.makeBoard();

        const ship = board.ships[2]; // Cruiser - length 3
        if (board.canPlace(ship, [0, 8])) { // would go to columns 8, 9, 10 (out of bounds)
            board.placeShip(ship);
        }

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
        if (board.canPlace(ship, [8, 5])) {
            board.placeShip(ship);
        }

        expect(board.placedShips.length).toBe(0);
        expect(board.board[8][5]).toBe(99);
    });

    test("vertical ships cannot touch diagonally", () => {
        const board = new Gameboard();
        board.makeBoard();

        const ship1 = board.ships[4]; // Destroyer
        ship1.changePosition(); // vertical
        if (board.canPlace(ship1, [3, 3])) {
            board.placeShip(ship1);
        }

        const ship2 = board.ships[3]; // Submarine
        ship2.changePosition(); // vertical
        if (board.canPlace(ship2, [2, 4])) {
            board.placeShip(ship2);
        }

        expect(board.placedShips.length).toBe(1);
    });
});

describe("Game Controller", () => {
    test("two complete games should be played successfully with reset in between", () => {
        const game = new GameController();

        game.makeBluePlayer("lancer", "blue");
        game.makeRedPlayer("radish", "red");
        
        // first game
        
        // place ships
        game.randomizer(); // Blue (lancer) places ships
        console.table(game.players.blue.board.board);
        
        game.switchTurn();
        game.randomizer(); // Red (radish) places ships
        console.table(game.players.red.board.board);
        
        game.switchTurn(); // back to blue
        
        // verify ships placed
        expect(game.players.blue.board.placedShips.length).toBe(5);
        expect(game.players.red.board.placedShips.length).toBe(5);
        
        // lancer sinks radish's ships
        const radishShips = game.players.red.board.placedShips;
        
        for (let ship of radishShips) {
            for (let coord of ship.coordinates) {
                // lancer attacks
                const hitResult = game.attack(coord);
                expect(hitResult).toBe(true);
                expect(game.players.red.board.board[coord[0]][coord[1]]).toBe(69); // Hit!
                
                // radish's turn
                game.switchTurn();
                game.attack([0, 0]);
                game.switchTurn(); // back to lancer
            }
        }
        
        console.table(game.players.red.board.board);
        
        // check game 1 result
        const game1Result = game.checkGameState();
        expect(game1Result.isGameOver).toBe(true);
        expect(game1Result.whoLost.name).toBe("radish");
        
        // resetting
        game.resetTheGame();
        expect(game.players.blue.board.placedShips.length).toBe(0);
        expect(game.players.red.board.placedShips.length).toBe(0);
        
        // second game
        game.activePlayer = game.players.blue;
        game.randomizer();
        console.table(game.players.blue.board.board);
        
        game.switchTurn();
        game.randomizer();
        console.table(game.players.red.board.board);
        
        // verify ships placed
        expect(game.players.blue.board.placedShips.length).toBe(5);
        expect(game.players.red.board.placedShips.length).toBe(5);
        
        // radish sinks lancer's ships
        const lancerShips = game.players.blue.board.placedShips;
        
        for (let ship of lancerShips) {
            for (let coord of ship.coordinates) {
                // radish attacks
                const hitResult = game.attack(coord);
                expect(hitResult).toBe(true);
                expect(game.players.blue.board.board[coord[0]][coord[1]]).toBe(69); // Hit!
                
                // lancer's turn
                game.switchTurn();
                game.attack([0, 0]);
                game.switchTurn(); // back to radish
            }
        }
        
        console.table(game.players.blue.board.board);
        
        // check game 2 result
        const game2Result = game.checkGameState();
        expect(game2Result.isGameOver).toBe(true);
        expect(game2Result.whoLost.name).toBe("lancer");
    });
    
    test("attack should return false when attacking same coordinate twice", () => {
        const game = new GameController();
        
        game.makeBluePlayer("player1", "blue");
        game.makeRedPlayer("player2", "red");
        
        game.randomizer();
        game.switchTurn();
        game.randomizer();
        game.switchTurn();
        
        // Get a coordinate with a ship
        const targetShip = game.players.red.board.placedShips[0];
        const [x, y] = targetShip.coordinates[0];
        
        // First attack should succeed
        const firstAttack = game.attack([x, y]);
        expect(firstAttack).toBe(true);
        expect(game.players.red.board.board[x][y]).toBe(69);
        
        // Second attack on same spot should fail
        const secondAttack = game.attack([x, y]);
        expect(secondAttack).toBe(false);
    });
    
    test("attack on empty cell should mark as miss", () => {
        const game = new GameController();
        
        game.makeBluePlayer("player1", "blue");
        game.makeRedPlayer("player2", "red");
        
        game.randomizer();
        game.switchTurn();
        game.randomizer();
        game.switchTurn();
        
        // Find an empty cell (value 99)
        let emptyX, emptyY;
        const board = game.players.red.board.board;
        
        outerLoop: for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (board[i][j] === 99) {
                    emptyX = i;
                    emptyY = j;
                    break outerLoop;
                }
            }
        }
        
        // Attack empty cell
        const missResult = game.attack([emptyX, emptyY]);
        expect(missResult).toBe(true);
        expect(game.players.red.board.board[emptyX][emptyY]).toBe(-1); // Miss marker
    });
});