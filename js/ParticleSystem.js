
//***************** EDIT THESE VARIBLES
var speed    = 5;		// Speed of each particle
var burstNum = 10;		// How many particles will appear when clicking
var size     = 5;		// Size of each particle
var maxParticleNum = 200;	// Total number of particles that can exist at once
//***************** DONT EDIT STUFF PAST HERE


var canvas = document.getElementById("c");
var ctx = canvas.getContext('2d');
var canvWidth, canvHeight;
var system1 = new particleSystem(maxParticleNum);
var mousePos = {
	x : 0,
	y : 0
};

//set listener to get mouse position
updMouse = function(e) {
	var rect = canvas.getBoundingClientRect();
    mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

window.addEventListener('mousemove', updMouse, false);

//set listener to handle mouse clicks
handleClick = function(e) {
	system1.burst(mousePos.x, mousePos.y, speed, burstNum);
}

canvas.addEventListener('click', handleClick, false);

//set listener for 'clear' button
$("#clear").click(clear);

//Initialize the document
$(document).ready(initDocument);
function initDocument() {	
	//get the canvas and context
	canvWidth = canvas.width;
	canvHeight = canvas.height;

	//Set off burst of particles
	system1.burst(canvWidth/2, canvHeight/2, speed, burstNum);
	
	//initialize the simulation
    setInterval(loop, 30);
}

//Main loop
function loop() {
	update();
	draw();
}

//Handles update for simulation
function update() {
	system1.update();
}

//Handles drawing of simulation
function draw() {
	ctx.globalAlpha = .2;
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0,0,canvWidth,canvHeight);
	system1.draw();
}

//Clears all particles
function clear() {
	console.log("ran");
	system1.particles = [];
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0,0,canvWidth,canvHeight);
}

//Handles particle creation and maintenance
function particleSystem(maxParticles) {
	this.particles = [];
	this.maxParticles = maxParticles;
	this.emit = function(x,y, speed, color) {
		if(this.particles.length >= this.maxParticles)
			this.particles.shift();
		this.particles.push(new particle(x,y, speed, color));
	}
	this.burst = function(x,y, speed, amount) {
		//generate random color
		var color = randomColor();
		for(var i = 0; i < amount; i++) {
			this.emit(x,y, speed, color);
		}
	}
	this.update = function() {
		for(i in this.particles) {
			this.particles[i].update();
		}
	}
	this.draw = function() {
		for(i in this.particles) {
			this.particles[i].draw();
		}
	}
}

//Handles an individual particle
function particle(x, y, speed, color) {
	this.radius = size/2;
	this.position = [x,y];
	this.color = color;
	var dir = Math.random()*Math.PI*2;
	this.velocity = [Math.cos(dir)*speed, Math.sin(dir)*speed];
	this.update = function() {
		this.position[0] += this.velocity[0];
		this.position[1] += this.velocity[1];
		
		//Collision checking
		if(this.position[0] >= canvWidth-this.radius){
			this.position[0] = canvWidth-this.radius;
			this.velocity[0] = this.velocity[0]*-1;
		}
		else if(this.position[0] <= this.radius){
			this.position[0] = this.radius;
			this.velocity[0] = this.velocity[0]*-1;
		}
		if(this.position[1] >= canvHeight-this.radius){
			this.position[1] = canvHeight-this.radius;
			this.velocity[1] = this.velocity[1]*-1;
		}
		else if(this.position[1] <= this.radius){
			this.position[1] = this.radius;
			this.velocity[1] = this.velocity[1]*-1;
		}
			
	};
	this.draw = function() {
		ctx.beginPath();
		ctx.globalAlpha = 1;
		ctx.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = color;
		ctx.fill();
	};
}

//Generates a random color
function randomColor() {
	return rgbToHex( Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255) );
}

//converts RGB value to Hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}