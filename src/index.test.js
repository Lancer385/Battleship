import { Ship } from "./module/ship";
import { Gameboard } from "./module/game-board";
import { GameController } from "./module/game-controller";
import { Player } from "./module/player";

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
    test("board initializes correctly with 10x10 grid", () => {
        const board = new Gameboard();
        board.makeBoard();
        
        expect(board.board.length).toBe(10);
        expect(board.board[0].length).toBe(10);
        expect(board.board[9][9]).toBe(99); // all cells start as 99
    })

    test("canPlace returns false when ships would touch diagonally", () => {
        const board = new Gameboard();
        board.makeBoard();

        // Place first ship
        const ship1 = board.ships[6]; // Patrol Boat - length 1
        board.canPlace(ship1, [5, 5]);
        board.placeShip(ship1);

        // Try to place another ship diagonally adjacent
        const ship2 = board.ships[7]; // Speedboat - length 1
        const result = board.canPlace(ship2, [4, 4]); // diagonal to [5, 5]
        
        expect(result).toBe(false);
    });


    test("placeShip correctly adds ship to board and placedShips array", () => {
        const board = new Gameboard();
        board.makeBoard();

        const ship = board.ships[6]; // Patrol Boat
        board.canPlace(ship, [0, 0]);
        board.placeShip(ship);
        
        expect(board.placedShips.length).toBe(1);
        expect(board.board[0][0]).toBe(6); // ship's ID
    });

    test("receiveAttack marks hit correctly", () => {
        const board = new Gameboard();
        board.makeBoard();

        const ship = board.ships[6];
        board.canPlace(ship, [5, 5]);
        board.placeShip(ship);
        
        const result = board.receiveAttack([5, 5]);
        
        expect(result).toBe(true);
        expect(board.board[5][5]).toBe(69); // hit marker
        expect(ship.hit).toBe(1);
    });

    test("receiveAttack marks miss correctly", () => {
        const board = new Gameboard();
        board.makeBoard();
        
        const result = board.receiveAttack([3, 3]); // empty cell
        
        expect(result).toBe(true);
        expect(board.board[3][3]).toBe(-1); // miss marker
    });

    test("receiveAttack returns false when attacking same spot twice", () => {
        const board = new Gameboard();
        board.makeBoard();
        // first attack (miss)
        board.receiveAttack([2, 2]); 
        const secondAttack = board.receiveAttack([2, 2]); // second attack
        
        expect(secondAttack).toBe(false);
    });

    test("reportSunkenShips returns true when all ships are sunk", () => {
        const board = new Gameboard();
        board.makeBoard();

        // Place and sink a single ship
        const ship = board.ships[6]; // Patrol Boat - length 1
        board.canPlace(ship, [0, 0]);
        board.placeShip(ship);
        
        // Manually set all ships as sunk for testing
        board.ships.forEach(s => s.hit = s.length);
        
        expect(board.reportSunkenShips()).toBe(true);
    });

    test("reportSunkenShips returns false when ships are still afloat", () => {
        const board = new Gameboard();
        board.makeBoard();

        const ship = board.ships[6]; // Patrol Boat
        board.canPlace(ship, [0, 0]);
        board.placeShip(ship);
        
        expect(board.reportSunkenShips()).toBe(false);
    });
});

describe("Player", () => {

    test("pickShip sets the picked ship", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        
        const ships = player.getShips();
        player.pickShip(ships[0]);
        
        expect(player.pickedShip).toBe(ships[0]);
    });

    test("placeShip returns false if no ship is picked", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        
        const result = player.placeShip([0, 0]);
        
        expect(result).toBe(false);
    });

    test("placeShip successfully places a valid ship", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        
        const ships = player.getShips();
        player.pickShip(ships[6]); // Patrol Boat
        const result = player.placeShip([5, 5]);
        
        expect(result).toBe(true);
        expect(player.getPlacedShips().length).toBe(1);
        expect(player.pickedShip).toBe(null); // cleared after placing
    });

    test("placeShip returns false for invalid placement", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        
        const ships = player.getShips();
        player.pickShip(ships[0]); // Carrier - length 5
        const result = player.placeShip([0, 8]); // out of bounds
        
        expect(result).toBe(false);
        expect(player.getPlacedShips().length).toBe(0);
    });

    test("placeShip returns false if ship is already placed", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        
        const ships = player.getShips();
        player.pickShip(ships[6]);
        player.placeShip([5, 5]); 
        
        player.pickShip(ships[6]); 
        const result = player.placeShip([7, 7]); 
        
        expect(result).toBe(false);
        expect(player.getPlacedShips().length).toBe(1); 
    });

    test("randomizePlacement places all 8 ships", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        
        player.randomizePlacement();
        
        expect(player.getPlacedShips().length).toBe(8);
        expect(player.isPlaced()).toBe(true);
    });

    test("receiveAttack delegates to board", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        
        const result = player.receiveAttack([3, 3]);
        
        expect(result).toBe(true);
        expect(player.getBoard()[3][3]).toBe(-1);
    });

    test("reportSunkenShips returns false initially", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        player.randomizePlacement();
        
        expect(player.reportSunkenShips()).toBe(false);
    });

    test("resetBoardState clears placed ships and resets board", () => {
        const player = new Player("TestPlayer", 1, "blue");
        player.makeBoard();
        player.randomizePlacement();
        
        expect(player.getPlacedShips().length).toBe(8);
        
        player.resetBoardState();
        
        expect(player.getPlacedShips().length).toBe(0);
        const board = player.getBoard();
        expect(board[0][0]).toBe(99); // board reset to empty
    });
});

describe("Game Controller", () => {
    test("two complete games should be played successfully with reset in between", () => {
        const game = new GameController();

        game.makeBluePlayer("lancer", "blue");
        game.makeRedPlayer("radish", "red");
        
        // first game
        
        // place ships
        game.randomizePlacement(); // Blue places ships
        game.switchTurn();
        game.randomizePlacement(); // Red places ships
        game.switchTurn(); 
        
        // verify ships placed
        expect(game.players.blue.getPlacedShips().length).toBe(8);
        expect(game.players.red.getPlacedShips().length).toBe(8);
        
        // lancer sinks radish's ships
        const radishShips = game.players.red.getPlacedShips();
        
        for (let ship of radishShips) {
            for (let coord of ship.coordinates) {
                // blue attacks
                const hitResult = game.attack(coord);
                expect(hitResult).toBe(true);
                // should hit all the ships
                expect(game.players.red.getBoard()[coord[0]][coord[1]]).toBe(69); 
                
                // red's turn
                game.switchTurn();
                game.attack([0, 0]);
                game.switchTurn(); 
            }
        }  
        // check game 1 result
        const game1Result = game.checkGameState();
        expect(game1Result.isGameOver).toBe(true);
        expect(game1Result.whoLost.name).toBe("radish");
        
        // resetting
        game.resetTheGame();
        expect(game.players.blue.getPlacedShips().length).toBe(0);
        expect(game.players.red.getPlacedShips().length).toBe(0);
        
        // second game (basically doing the same thing again)
        game.activePlayer = game.players.blue;
        game.randomizePlacement();
        console.table(game.players.blue.getBoard());
        
        game.switchTurn();
        game.randomizePlacement();
        console.table(game.players.red.getBoard());
        
        // verify ships placed
        expect(game.players.blue.getPlacedShips().length).toBe(8);
        expect(game.players.red.getPlacedShips().length).toBe(8);
        
        // radish sinks lancer's ships
        const lancerShips = game.players.blue.getPlacedShips();
        
        for (let ship of lancerShips) {
            for (let coord of ship.coordinates) {
                // radish attacks
                const hitResult = game.attack(coord);
                expect(hitResult).toBe(true);
                // should hit
                expect(game.players.blue.getBoard()[coord[0]][coord[1]]).toBe(69);
                
                // lancer's turn
                game.switchTurn();
                game.attack([0, 0]);
                game.switchTurn(); // back to radish
            }
        }
                
        // check game 2 result
        const game2Result = game.checkGameState();
        expect(game2Result.isGameOver).toBe(true);
        expect(game2Result.whoLost.name).toBe("lancer");
    });
    
    test("attack should return false when attacking same coordinate twice", () => {
        const game = new GameController();
        
        game.makeBluePlayer("player1", "blue");
        game.makeRedPlayer("player2", "red");
        
        game.randomizePlacement();
        game.switchTurn();
        game.randomizePlacement();
        game.switchTurn();
        
        // Get a coordinate with a ship
        const targetShip = game.players.red.getPlacedShips()[0];
        const [x, y] = targetShip.coordinates[0];
        
        // First attack should succeed
        const firstAttack = game.attack([x, y]);
        expect(firstAttack).toBe(true);
        expect(game.players.red.getBoard()[x][y]).toBe(69);
        
        // Second attack on same spot should fail
        const secondAttack = game.attack([x, y]);
        expect(secondAttack).toBe(false);
    });
    
    test("attack on empty cell should mark as miss", () => {
        const game = new GameController();
        
        game.makeBluePlayer("player1", "blue");
        game.makeRedPlayer("player2", "red");
        
        game.randomizePlacement();
        game.switchTurn();
        game.randomizePlacement();
        game.switchTurn();
        
        // Find an empty cell (value 99)
        let emptyX, emptyY;
        const board = game.players.red.getBoard();
        
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (board[i][j] === 99) {
                    emptyX = i;
                    emptyY = j;
                    break ;
                }
            }
        }
        
        // Attack empty cell
        const missResult = game.attack([emptyX, emptyY]);
        expect(missResult).toBe(true);
        expect(game.players.red.getBoard()[emptyX][emptyY]).toBe(-1); // Miss marker
    });
});