class Enemy extends Entity {
    static standardMove(player) {
        this.squareX += Math.random()/2 * Math.sign(player.x - this.x);
        this.squareY += Math.random()/2 * Math.sign(player.y - this.y);
    }

    static checkRange = (a, b, range) => {
        const dX = Math.abs(a.x - b.x);
        const dY = Math.abs(a.y - b.y);
        return dX < range && dY < range;
    }

    static standardAttack = (color, damage) => (self, player) => {
        const inRange = Enemy.checkRange(self, player, self.range);
        if (!inRange) return;
        attackAnimation(self, self.range, color);
        player.health -= damage;
    };

    /**
     * 
     * @param {number} x The starting gridX of the enemy 
     * @param {number} y The starting gridY of the enemy 
     * @param {number} health How much health this enemy has
     * @param {Function} move A function to handle movement
     * @param {Function} attack A function that is called when the enemy needs to attack
     */
    constructor(x, y, health, range, move, attack, color) {
        super(x, y, color);
        this.health = health;
        this.range = range;
        this.move = move.bind(this);
        this.attack = attack.bind(this);
    }

    onTick(player) {
        this.move(player);
        this.attack(this, player);
    }
}