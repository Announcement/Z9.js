/*
 *  Ghost.js - Example 01 - Minimal
 * 
 */

// create a game state
var myState = new ghost.State();

// called when state initializes
myState.init = function() {
	console.log('state initialized!');
};

// draw some shapes
myState.draw = function() {
	// every state inherits the global surface which can be drawn to
	// this.paint is a shorthand for this.surface.render
	this.surface.render.rect(50, 20, 10, 10, 'red'); // full syntax
	this.paint.rect(50, 70, 70, 30, 'orange'); // shorthand method
	this.paint.circleFill(200, 120, 50, 'blue');
	this.paint.rectFill(290, 170, 60, 100, '#e2f');
};

// setup game
var myGame = new ghost.Game({
	canvasId: 'ghostexample', // canvas element to initialize the game on
	state: myState, // starting game state
	simpleLoop: true // use a simple game loop that only draws and doesn't call update
});

// run game on window load
window.addEventListener('load', myGame.run);
