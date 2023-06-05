class Animation {
    constructor(draw, time) {
        this.draw = draw;
        this.time = time;
    }

    animate(context, scale) {
        this.draw(context, scale, this.time);
        this.time --;
    }
}