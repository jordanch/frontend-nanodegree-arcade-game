//global variables
var RIGHTOFCANVAS = window.canvas.width + 50,
    LEFTOFCANVAS = -100,
    ENEMYSPEED = 100;


function getRandomArbitrary(min, max) { //random movement helper function. Code from: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    return (Math.random() * (max - min) + min);
};

function getRandomArbitraryWhole(min, max) { 
    /**
     * Returns a random whole number between min (inclusive) and max (exclusive)
     */
    return Math.round((Math.random() * (max - min) + min));
};

var Enemy = function(y) {
    this.movement = getRandomArbitrary(3, 10); // random movement speed for instanstiated enemy object 
    this.x = LEFTOFCANVAS;
    this.y = y;
    this.width = 101;
    this.height = 77;
    this.sprite = 'images/enemy-bug.png';
};

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.movement * dt * ENEMYSPEED;   
};

Enemy.prototype.collission = function() {
    var playerXLength = player.x + player.width;
    var enemyXLength = this.x + this.width;
    var playerYLength = player.y + player.height;
    var enemyYLength = this.y + this.height;
    if (this.x < player.x + player.width && // Thanks to Luca from cohort Friday: 12PM SAST for assisting with collision code. 
        this.x + this.width > player.x && 
        this.y < player.y + player.height && 
        this.y + this.height > player.y) {
            player.playerRespawnNegative();
    };
};

Enemy.prototype.render = function() {
    if (this.x < RIGHTOFCANVAS) { // 505px is the width of the canvas. Add 50px so that the enemy passes the screen and more, thus allowing some time before respawning on the left
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
    }
    else {
        this.movement = getRandomArbitrary(3, 5); // when an enemy reaches the canvas's "virtual" right hand side, it's movement must be randomly adjusted before it respawns. 
        this.x = LEFTOFCANVAS;
        this.y = enemyPosition[getRandomArbitraryWhole(0, 2)];
    };
};

// since there is only one player, no prototype property will be utilised
var player = function() {
    
    var PLAYERHORIZONTALVELOCITY = 100,
        PLAYERVERTICLEVELOCITY = 82;

    var playerUp = -1 * PLAYERVERTICLEVELOCITY,
        playerDown = PLAYERVERTICLEVELOCITY,
        playerRight = PLAYERHORIZONTALVELOCITY,
        playerLeft = -1 * PLAYERHORIZONTALVELOCITY;

    this.sprite = 'images/char-boy.png';
    this.movement = [0, 0]; // declare and initialize this.movement array. index 0 is horizontal and index 1 is verticle
    this.width = 62;
    this.height = 71;
    this.center = [this.width / 2, this.height / 2];
    this.userKeyPress = false; // flag
    this.points = 0;
    this.hasReachedEnd = false // flag -- initialized
    
    this.playerRespawnNegative = function() {
        if (player.points !== 0) {
            player.points -= 1;
            document.getElementById("points").innerHTML = player.points;
        };
        this.x = 218; 
        this.y = 470; 
    };

    this.playerRespawnPositive = function() {
        player.points += 1;
        document.getElementById("points").innerHTML = player.points;
        this.x = 218; 
        this.y = 470; 
        this.hasReachedEnd = false;  
    };

    this.update = function() {
        this.x += this.movement[0];
        this.movement[0] = 0; // reset movement[0] Z vector after each frame update
        this.y += this.movement[1];
        this.movement[1] = 0; // reset movement[1] Y vector after each frame update
        if (this.y < 100 && this.hasReachedEnd == false) {
            this.hasReachedEnd = true;   
            console.log(this.hasReachedEnd);
            var timeout = window.setTimeout(this.playerRespawnPositive.bind(this), 2000); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#As_an_object_method
        }
        if (this.y > 100 && this.hasReachedEnd == true) {
            window.clearTimeout(timeout);
            console.log('clear');
        };
    };

    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    
    this.handleInput = function(keyCode) {
        if (keyCode == 'left') { // left movement on keyup
            if (this.x + playerLeft > 0) {
                if (this.userKeyPress != true) {
                    this.movement[0] += playerLeft;
                    this.playerMovement = 'left';
                    this.userKeyPress = true;
                };
            };
        }
        else if (keyCode == 'right') { // right movement on keyup
            if (this.x + playerRight < window.canvas.width) {
                if (this.userKeyPress != true) {
                    this.movement[0] += playerRight;
                    this.playerMovement = 'right';
                    this.userKeyPress = true;
                };
            };
        }
        else if (keyCode == 'up') { // up movement on keyup
            if (this.y + playerUp > 0) {
                if (this.userKeyPress != true) {
                    this.movement[1] += playerUp;
                    this.playerMovement = 'up';
                    this.userKeyPress = true;
                };
            };         
        }
        else if (keyCode == 'down') { // down movement on keyup
            if (this.y + playerDown < window.canvas.height - PLAYERVERTICLEVELOCITY) {
                if (this.userKeyPress != true) {
                    this.movement[1] += playerDown;
                    this.playerMovement = 'down';
                    this.userKeyPress = true;
                };
            }; 
        };
    };

    this.handleKeyUp = function(keyCodeString) {
        if (keyCodeString == 'down' || keyCodeString == 'up' || keyCodeString == 'left' || keyCodeString == 'right') { 
                this.userKeyPress = false;
        }; 
    };
};

var allEnemies = [];

var enemyPosition = {
    0: 134,
    1: 218,
    2: 300
};

var enemyOne = new Enemy(enemyPosition[getRandomArbitraryWhole(0, 2)]);
var enemyTwo = new Enemy(enemyPosition[getRandomArbitraryWhole(0, 2)]);
var enemyThree = new Enemy(enemyPosition[getRandomArbitraryWhole(0, 2)]);

allEnemies[0] = enemyOne;
allEnemies[1] = enemyTwo;
allEnemies[2] = enemyThree;

var player = new player();
player.playerRespawnNegative();

document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleKeyUp(allowedKeys[e.keyCode]); //implementtion for callback with event object parameter 'keyCode' :  http://www.w3schools.com/jsref/event_key_keycode.asp
});


//helpful article: http://stackoverflow.com/questions/5353254/javascript-onkeydown-event-fire-only-once