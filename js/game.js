/*
	CP 317: Software Engineering, Assignment #1

	Simple Goblin Knight game

	Authours: Vaughan Hilts [120892740], Brandon Smith, Colin Gidzinski

 */

var TO_RADIANS = Math.PI / 180


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.getElementById("holder").appendChild(canvas);

ctx['imageSmoothingEnabled'] = false;
ctx['mozImageSmoothingEnabled'] = false;
ctx['oImageSmoothingEnabled'] = false;
ctx['webkitImageSmoothingEnabled'] = false;
ctx['msImageSmoothingEnabled'] = false;



var bgMusic = new Audio("audio/copycat.mp3"); // buffers automatically when created
bgMusic.play();

bgMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

var chickenSe = new Audio("audio/chicken.mp3");


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/tilemap.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/SaraFullSheet.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/zombie.png";

// Game objects
var hero = {
	speed: 128, // movement in pixels per second
	dir: 2
};

hero.x = 64;
hero.y = 128;

var monster = {};
var monstersCaught = parseInt(localStorage["monsters"]);
if(isNaN(monstersCaught)){
	monstersCaught = 0;
}
var chickens = [];


// Handle keyboard controls
var keysDown = {};
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener("mousedown", function(e) {

	mouseDown = true;

}, false);

addEventListener("mousemove", function(e) {


	// Set our flags, do stuff in the game loop
	mouseX = (e.clientX - canvas.offsetLeft) / scale;
	mouseY = (e.clientY - canvas.offsetTop) / scale;

	if(mouseX > 800 - 96)
		mouseX = 800 - 96;

	if(mouseX < 32)
		mouseX = 32;

	if(mouseY < 32)
		mouseY = 32;

	if(mouseY > 600 - 96)
		mouseY = 600 - 96;


}, false);

addEventListener("mouseup", function(e) {

	mouseDown = false;

}, false);

var resize = function() {


	playableHeight = window.innerHeight * 0.98;
    playableWidth = window.innerWidth * 0.98;
    scaleWidth = playableWidth / 800
    scaleHeight = playableHeight / 600
    scale =  Math.min(12, Math.max(0.1, Math.min(scaleWidth, scaleHeight)));

    
    canvas.width = 800 * scale;
    canvas.height = 600 * scale;


};



addEventListener("resize", resize);

// Reset the game when the player catches a monster
var reset = function () {

	// Generate a chicken
	var chicken = {};

	// Throw the monster somewhere on the screen randomly
	chicken.x = 64 + (Math.random() * (800 - 128));
	chicken.y = 64 + (Math.random() * (600 - 128));

	angle = Math.random() * 360;
	chicken.vx = Math.sin(angle * TO_RADIANS)  * 256;
	chicken.vy = Math.cos(angle * TO_RADIANS)  * 256;

	chickens.push(chicken);

};




    var scale = 1;
    resize();



// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	if(mouseDown) {
		x = -(hero.x - mouseX);
		y = -(hero.y - mouseY);

		// normalize
		if(x > 0)
			x = 1;
		else
			x = -1;

		if(y > 0)
			y = 1;
		else
			y = -1;




		//hero.x = hero.x +  x * modifier * hero.speed;
		//hero.y = hero.y +  y * modifier * hero.speed;
		hero.x = mouseX;
		hero.y = mouseY;



	}

		chickens.forEach(function(chicken) {
	
			chicken.x += chicken.vx * modifier;
			chicken.y += chicken.vy * modifier;

			var invert = false;

		if(chicken.x > 800 - 64) {
			chicken.x = 800 - 64;
		chicken.vx *= -1;
		}

	if(chicken.x < 32) {
		chicken.x = 32;
		chicken.vx *= -1;
	}
		

	if(chicken.y < 32) {
		chicken.y = 32;
	chicken.vy *= -1;
	}
		

	if(chicken.y > 600 - 64) {
		chicken.y = 600 - 64;
		chicken.vy *= -1;
	}
		


								// Are they touching?
				if (
					hero.x <= (chicken.x + 64)
					&& chicken.x <= (hero.x + 64)	
					&& hero.y <= (chicken.y + 64)
					&& chicken.y <= (hero.y + 64)
				) {
					++monstersCaught;
					localStorage["monsters"] = monstersCaught;
					chickens.splice(chickens.indexOf(chicken), 1);
					//chickenSe.stop();
					chickenSe.play();
				}


		});


};

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
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			];

// Draw everything
var render = function () {

	



	ctx.clearRect(0, 0, 800, 600);

	ctx.fillStyle = 'transparent';

	if (bgReady) {
		//ctx.drawImage(bgImage, 0, 0);
		
		// First, we render our tilemap. It's at our feet
		renderTilemap();
	}

  	ctx.save()
	ctx.scale(scale, scale);

	if (heroReady) {
		ctx.drawImage(heroImage, 0, hero.dir * 64, 64, 64, Math.round(hero.x), Math.round(hero.y), 64, 64);
	}

	if (monsterReady) {

		chickens.forEach(function(chicken) {
			ctx.drawImage(monsterImage, 0, 2 * 32, 32, 32, Math.round(chicken.x), Math.round(chicken.y), 32, 32);
		});


	}

	// Score
	drawStroked("Chickens caught: " + monstersCaught, 40, 50);

	ctx.restore();

	

};

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
var renderTilemap = function () {
	for(var x = 0; x < tilemap.length; x++)
		for(var y = 0; y < tilemap[0].length; y++) {
	         ctx.drawImage(bgImage, 0 * 32, 0, 32, 32, Math.ceil(y*32*scale), Math.ceil(x*32*scale), Math.ceil(32*scale), Math.ceil(32*scale));	// always draw the base ground first
	         ctx.drawImage(bgImage, tilemap[x][y] * 32, 0, 32, 32, Math.ceil(y*32*scale), Math.ceil(x*32*scale), Math.ceil(32*scale), Math.ceil(32*scale));
	     }
}

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();

setInterval(function() {
	reset();
}, 3000)

var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
