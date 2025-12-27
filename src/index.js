import { DOM } from "./UI/DOM.js";
import { GameController } from "./module/game-controller.js";

const game = new GameController();;
const UI = new DOM(game);
UI.submit();
UI.viewShips();
UI.placeShip();
UI.randomizer();
UI.startGame();
UI.retry();