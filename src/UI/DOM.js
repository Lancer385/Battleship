import { GameController } from "../module/game-controller";
import './style.css';

const game = new GameController();

const controls = {
    blue: document.querySelector(".blue-controls"),
    red : document.querySelector(".red-controls")
}

const sea = {
    blue: document.querySelector(".blue-sea"),
    red: document.querySelector(".red-sea")
}


