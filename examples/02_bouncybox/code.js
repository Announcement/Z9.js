/*
 *  Ghost.js - Example 02 - Bouncy Box
 * 
 */
 
// bouncy box class
function BouncyBox(me, options) {
	// position and velocity of the box
	var pos = { x: options.x, y: options.y };
	var vel = { x: options.vel_x, y: options.vel_y };

	this.animate = function(delta) {
		// bounce the box around
		pos.x += vel.x * delta;
		pos.y += vel.y * delta;
		if (pos.x <= 0 || pos.x >= 350)
			vel.x = -vel.x;
		if (pos.y <= 0 || pos.y >= 250)
			vel.y = -vel.y;
	};

	this.draw = function() {
		// we have access to state's paint
		me.paint.rectFill(pos.x, pos.y, 50, 50, options.color);
	};
}

// create the main game sstate
var myState = new ghost.State();

myState.init = function() {
	// attach a custom object
	this.box = new BouncyBox(this, { // we pass the state for context
		x: 100, // position
		y: 100,
		vel_x: 1, // velocity
		vel_y: 1.8,
		color: 'orange'
	});
};

myState.update = function(delta) {
	// animate the bouncy square
	this.box.animate(delta);
};

myState.draw = function() {
	// draw the bouncy square
	this.box.draw();
};

// setup and run the game
var myGame = new ghost.Game({
	canvasId: 'ghostexample',
	state: myState,
	background: '#000', // background fill color (optional)
	fps: 60, // frames to draw per second (optional, default=60)
	framerate: 60 // frames to update per second (optional, default=60)
});

// run game on window load
window.addEventListener('load', myGame.run);