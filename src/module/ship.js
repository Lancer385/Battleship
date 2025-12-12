const horizontal = 0;
const vertical = 1;

export class Ship {
    constructor(name, length , axis){
        this.name = name;
        this.length = length;
        this.hit = 0;
        this.coordinates = [];
        this.axis = axis;
        this.id;
    }
    
    isHorizontal(){
        return this.axis === horizontal;
    }

    changePosition(){
       this.axis = this.axis === horizontal ? vertical : horizontal;
    }
    isSunk(){
        return this.length <= this.hit;
    }

    gotHit(){
        this.hit += 1;
    }
}