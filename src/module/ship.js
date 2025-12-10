export class Ship {
    constructor(name, length){
        this.name = name;
        this.length = length;
        this.hit = 0;
    }
    isSunk(){
        return this.length <= this.hit;
    }
    gotHit(){
        this.hit += 1;
    }
}