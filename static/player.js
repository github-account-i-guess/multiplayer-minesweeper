class Player {
    static startingLives = 3;

    completed = 0;
    lives = Player.startingLives;

    constructor(name, grid) {
        this.name = name;
        this.grid = grid;
    }
}