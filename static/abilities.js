function attackAnimation(entity, range, color) {
    const { size: entitySize } = entity.square;
    const animationTime = 30;
    const animation = new Animation((context, scale, time) => {
        const size = range * 2 * time/30;
        const x = entity.x - size/2 + entitySize/2;
        const y = entity.y - size/2 + entitySize/2;

        const square = new Square(x, y, size, color);
        square.draw(context, scale);
    }, animationTime);
    animations.push(animation);
}


function enemiesInRange(range) {
    return enemies.filter(e => {
        return Enemy.checkRange(e, player, range);
    });
}

function attack(range, damage, color, aoe) {
    const inRange = enemiesInRange(range).sort((a, b) => {
        return a.health - b.health;
    });
    attackAnimation(player, range, color);

    if (aoe) {
        inRange.forEach(e => {
            e.health -= damage;
        })
    } else {
        const enemy = inRange[0];
        if (enemy) {
            enemy.health -= damage;
        } 
    }
}

class Ability {
    static abilities = {
        aoeThingy: new Ability(player => {
            attack(0.05, 2, "rgba(30, 30, 255, 0.5)", true);
        }),
        berserkerThingy: new Ability(player => {
            const { health } = player;
            const damage = (100 - health)/10;
            attack(0.01, damage, "rgba(100, 0, 0, 0.9)", false);
        }),
        bigMine: new Ability(player => {
            if (player.mines >= 30) {
                attack(1, 100, "rgba(0, 0, 0, 0.5)", true);
                player.health -= 30;
            }
        }),
        dash: new Ability(player => {
            const range = 0.1;
            const inRange = enemiesInRange(range);
            function generateAction(direction, sign) {
                return _ => {
                    player[direction] += 10 * sign;
                    inRange.forEach(e => {
                        e[direction] += 30 * sign;
                        e.health --;
                    });
                }
            }

            listen("a", generateAction("squareX", -1));
            listen("d", generateAction("squareX", 1));
            listen("w", generateAction("squareY", -1));
            listen("s", generateAction("squareY", 1));

            attackAnimation(player, range, "rgba(125, 125, 125, 0.5)")
        }),
        heal: new Ability(player => {
            attackAnimation(player, 0.05, "green");
            const { mines } = player;
            if (mines >= 5) {
                player.mines -= 5;
                player.health += 5;
            } else {
                player.health += mines;
                player.mines = 0;
            }
        }),
    }
    
    constructor(action) {
        this.action = action;
    }

    activate(player) {
        this.action(player);
    }
}