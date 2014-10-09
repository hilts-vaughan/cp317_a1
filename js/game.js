/*
	CP 317: Software Engineering, Assignment #1

	Simple Goblin Knight game

	Authours: Vaughan Hilts [120892740], Brandon Smith[120201510], Colin Gidzinski

 */
var TO_RADIANS = Math.PI / 180
var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var TILE_SIZE = 32;
var FRAME_SIZE = 64;
var CHICKEN_FRAME_SIZE = 32;
var CHICKEN_FRAMES = 4;
var CHICKEN_FRAME_TIME = 0.15;
var CHICKEN_SPAWN_RATE = 3000;
var MILLISECOND_PER_SECOND =1000;
var BOARDER_WIDTH=0.98;
var DEGREES_IN_CIRCLE = 360;
var BULLET_SPEED =512;
var BULLET_ANGULAR_SPEED = 256;
var HERO_SPEED =128;
var HERO_WIDTH = 32;
var HERO_HEIGHT = 40;
var HERO_INITIAL_X = 64;
var HERO_INITIAL_Y = 128;
var CHICKEN_WIDTH = 32;
var CHICKEN_HEIGHT = 32;
var CHICKEN_SPEED = 256;
var SPAWN_BUFFER = 64;
var SCORE_X = 40;
var SCORE_Y = 50;
var HERO_RIGHT_PADDING=2.5;
var HERO_LOWER_PADDING=2.0;
var HERO_LEFT_PADDING=.5;
/*
	Describes a 2D matrix array of tile ID's that allow us to define our backgounr
*/
var tilemap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Create the HTML5 game canvas elements
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.getElementById("holder").appendChild(canvas);

// Begin playing the game audio
var bgMusic = new Audio("audio/copycat.mp3"); // buffers automatically when created
bgMusic.play();
bgMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

// The chicken sound effect that plays when a chicken is caught
var chickenSe = new Audio("audio/chicken.mp3");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "images/tilemap.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
    heroReady = true;
};
heroImage.src = "images/SaraFullSheet.png";

var starReady = false;
var starImage = new Image();
starImage.onload = function() {
    starReady = true;
};
starImage.src = "images/star.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
    monsterReady = true;
};
monsterImage.src = "images/chicken.png";

// Define our hero game object
var hero = {
    speed: HERO_SPEED, // movement in pixels per second
    dir: 2,
    width: HERO_WIDTH,
    height: HERO_HEIGHT
};

hero.x = HERO_INITIAL_X;
hero.y = HERO_INITIAL_Y;

/*
    A quick object enumeration with direction codes
*/
var Direction = {
    up: 0,
    left: 1,
    down: 2,
    right: 3
};

// Load our game save files
var monstersCaught = parseInt(localStorage["monsters"]);

// Check for save files that aren't initialized yet
if (isNaN(monstersCaught)) {
    monstersCaught = 0;
}

// Two simple object lists to keep track of things we need
var chickens = [];
var bullets = [];

// Some mouse data
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;

// Disable right clicking
document.oncontextmenu = document.body.oncontextmenu = function() {return false;}


addEventListener("mousedown", function(e) {

   // Set our flags, do stuff in the game loop
    mouseX = (e.clientX - canvas.offsetLeft) / scale;
    mouseY = (e.clientY - canvas.offsetTop) / scale;

    if(e.button == 0) {
        mouseDown = true;
    }
    else {
        fireBullet();
    }

}, false);


addEventListener("mouseup", function(e) {
    if(e.button == 0) {
        mouseDown = false;
    }
}, false);


addEventListener("mousemove", function(e) {

    // Set our flags, do stuff in the game loop
    mouseX = (e.clientX - canvas.offsetLeft) / scale;
    mouseY = (e.clientY - canvas.offsetTop) / scale;

    // The various multiplication factors are to relax the boundaries a bit (sprite padding)
    var rightBoundary = GAME_WIDTH - hero.width * HERO_RIGHT_PADDING;
    var leftBoundary = hero.width * HERO_LEFT_PADDING;
    var bottomBoundary = GAME_HEIGHT - (hero.height * HERO_BOTTOM_PADDING);

    if (mouseX > rightBoundary)
        mouseX = rightBoundary;

    if (mouseX < leftBoundary)
        mouseX = leftBoundary;

    if (mouseY < hero.height / 2)
        mouseY = hero.height / 2;

    if (mouseY > bottomBoundary)
        mouseY = bottomBoundary;

}, false);



// Creates a moving chicken and places it on the screen
var spawn = function() {

    // Generate a chicken
    var chicken = {};

    var boundaryBuffer = SPAWN_BUFFER;

    // Throw the monster somewhere on the screen randomly
    chicken.x = boundaryBuffer + (Math.random() * (GAME_WIDTH - boundaryBuffer * 2));
    chicken.y = boundaryBuffer + (Math.random() * (GAME_HEIGHT - boundaryBuffer * 2));


    chicken.width = CHICKEN_WIDTH;
    chicken.height = CHICKEN_HEIGHT;
    chicken.speed = CHICKEN_SPEED;
    chicken.frame = 0;
    chicken.frameTime = 0;

    // Generate a random angle between 0 and 360 degrees
    angle = Math.random() * DEGREES_IN_CIRCLE;

    chicken.vx = Math.sin(angle * TO_RADIANS) * chicken.speed;
    chicken.vy = Math.cos(angle * TO_RADIANS) * chicken.speed;

    chickens.push(chicken);

};

// Update game objects
var update = function(modifier) {

    if (mouseDown) {
        hero.x = mouseX;
        hero.y = mouseY;
    }

    var c = 0;
    bullets.forEach(function(bullet) {

        bullet.x += bullet.vx * modifier;
        bullet.y += bullet.vy * modifier;

        bullet.rotation += (bullet.angularSpeed * modifier);
        bullet.rotation = bullet.rotation % DEGREES_IN_CIRCLE;

        if(bullet.x < 0 || bullet.x > GAME_WIDTH || bullet.y < 0 || bullet.y > GAME_HEIGHT)
            bullets.splice(c, 1);

        c++;
    });

    // Do a y based sort to make sure the chickens order properly
    chickens.sort(function(a, b) {
        if(a.y < b.y)
            return 1;

        else if(a.y < b.y)
            return -1;

        return 0;
    });

    chickens.forEach(function(chicken) {

        // Update the position of the chicken
        chicken.x += chicken.vx * modifier;
        chicken.y += chicken.vy * modifier;

        // Update the chicken animations if required
        chicken.frameTime += modifier;
        if(chicken.frameTime > CHICKEN_FRAME_TIME) {
            chicken.frame = (chicken.frame + 1) % CHICKEN_FRAMES;
            chicken.frameTime = 0;
        }


        // Prevent the chickens from going off screen
        if (chicken.x > GAME_WIDTH - chicken.width * 2) {
            chicken.x = GAME_WIDTH - chicken.width * 2;
            chicken.vx *= -1;
        }

        if (chicken.x < chicken.width) {
            chicken.x = chicken.width;
            chicken.vx *= -1;
        }


        if (chicken.y < chicken.height) {
            chicken.y = chicken.height;
            chicken.vy *= -1;
        }


        if (chicken.y > GAME_HEIGHT - chicken.height * 1.5) {
            chicken.y = GAME_HEIGHT - chicken.height * 1.5;
            chicken.vy *= -1;
        }


        // Update direction of the chicken given the absolute magnitude of the velocity
        if(Math.abs(chicken.vy) > Math.abs(chicken.vx)) {
            if(chicken.vy > 0)
                chicken.dir = Direction.down;
            else
                chicken.dir = Direction.up;
        }
        else {
            if(chicken.vx > 0)
                chicken.dir = Direction.right;
            else
                chicken.dir = Direction.left;
        }


        // Award a point to the player if the chicken and player are touching
        if (intersects(hero, chicken)) {
            chickens.splice(chickens.indexOf(chicken), 1);
            performScore();
        }

        var c = 0;
        bullets.forEach(function(bullet) {

            if(intersects(bullet, chicken)) {
                chickens.splice(chickens.indexOf(chicken), 1);
                bullets.splice(c, 1);
                performScore();
            }

            c++;
        });


    });


};


var performScore = function() {

    localStorage["monsters"] = ++monstersCaught;

    // spawn sound effect and play it
    chickenSe.currentTime = 0;
    chickenSe.play();

}

/*
	Our basic render function. We perform all the draw calls we need to here, painting the screen.
*/
var render = function() {

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = 'transparent';

    if (bgReady) {
        // First, we render our tilemap. It's at our feet
        renderTilemap();
    }

    // Prepare for scaling
    ctx.save()
    ctx.scale(scale, scale);
    // Draw our hero
    if (heroReady) {
        ctx.drawImage(heroImage, 0, FRAME_SIZE * 2, FRAME_SIZE, FRAME_SIZE, Math.round(hero.x), Math.round(hero.y), FRAME_SIZE, FRAME_SIZE);
    }
    //Draws our chickens
    if (monsterReady) {
        chickens.forEach(function(chicken) {
            ctx.drawImage(monsterImage, chicken.frame * chicken.width, chicken.dir * chicken.height, chicken.width, chicken.height, Math.round(chicken.x),
            	Math.round(chicken.y), chicken.width, chicken.height);
        });
    }
    //Draws our bullets
    if(starReady) {
        bullets.forEach(function(bullet) {

            ctx.translate(bullet.x, bullet.y);
            ctx.rotate(bullet.rotation * TO_RADIANS);

            ctx.drawImage(starImage, -starImage.width / 2, -starImage.height/2, starImage.width, starImage.height);

            ctx.rotate(-(bullet.rotation * TO_RADIANS));
            ctx.translate(-bullet.x, -bullet.y);


        })
    }

    // Draw our score
    drawStroked("Chickens caught: " + monstersCaught, SCORE_X, SCORE_Y);

    ctx.restore();
};

/*
		Draws a stroked text on the screen

		@param	{string}	text 	The text to be drawn on the screen
		@param 	{number}	x 		The X cordinate in world cordinates to draw at
		@param	{number}	y 		The Y cordinate in world cordinates to draw at
*/
function drawStroked(text, x, y) {
    ctx.font = "24px VT323"
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
}


/*
	A basic method that will iterate our hard-coded array and generate a nice tile map for us with minimal effort
 */
var renderTilemap = function() {
    for (var x = 0; x < tilemap.length; x++)
        for (var y = 0; y < tilemap[0].length; y++) {
            ctx.drawImage(bgImage, 0 * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, Math.ceil(y * TILE_SIZE * scale),
            	Math.ceil(x * TILE_SIZE * scale), Math.ceil(TILE_SIZE * scale), Math.ceil(TILE_SIZE * scale));
            ctx.drawImage(bgImage, tilemap[x][y] * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, Math.ceil(y * TILE_SIZE * scale),
            	Math.ceil(x * TILE_SIZE * scale), Math.ceil(TILE_SIZE * scale), Math.ceil(TILE_SIZE * scale));
        }
}


var intersects = function (a, b) {

     return a.x < b.x + b.width &&
     a.x + a.width > b.x &&
     a.y < b.y + b.height &&
     a.y + a.height > b.y;

}


var fireBullet = function() {


    // We need to check if the point is inside the hero

    var centerX = hero.x + (hero.width/2);
    var centerY = hero.y + (hero.height/2);

    // Compute our angle and re-adjust
    var angle = Math.atan2(centerX - mouseX, centerY - mouseY) / TO_RADIANS;
    if(angle < 0)
        angle += DEGREES_IN_CIRCLE;

    bullet = {};

    bullet.x = centerX + hero.width/2;
    bullet.y = centerY + hero.height/2;

    bullet.width = starImage.width;
    bullet.height = starImage.height;


    // A special type of intersection with different values
    if(hero.x <= (mouseX + bullet.width) && mouseX <= (hero.x + FRAME_SIZE) && hero.y <= (mouseY + bullet.height)
        && mouseY <= (hero.y + FRAME_SIZE)) {
        return;
    }

    bullet.speed = BULLET_SPEED;
    bullet.angularSpeed = BULLET_ANGULAR_SPEED;
    bullet.rotation = 0;

    bullet.vx = -1 *  Math.sin(angle * TO_RADIANS) * bullet.speed;
    bullet.vy = -1 * Math.cos(angle * TO_RADIANS) * bullet.speed;

    bullets.push(bullet);
}

/*
	The main game loop which is called
*/
var main = function() {

	// compute delta
    var now = Date.now();
    var delta = now - then;

    // 1000ms in a second
    update(delta / MILLISECOND_PER_SECOND);
    render();

    then = now;
};


// Begin our resize logic

var resize = function() {
        // We shrink the game window slightly to leave a small border
    playableHeight = window.innerHeight * BOARDER_WIDTH;
    playableWidth = window.innerWidth * BOARDER_WIDTH;

    scaleWidth = playableWidth / GAME_WIDTH
    scaleHeight = playableHeight / GAME_HEIGHT
    scale = Math.min(Number.MAX_SAFE_INTEGER, Math.max(0.1, Math.min(scaleWidth, scaleHeight)));

    canvas.width = GAME_WIDTH * scale;
    canvas.height = GAME_HEIGHT * scale;
};


addEventListener("resize", resize);

var scale = 1;
resize();

// Spawn our initial chicken
spawn();

//
setInterval(function() {
    spawn();
}, CHICKEN_SPAWN_RATE)

var then = Date.now();
setInterval(main, 1);
