/*
 *  Abyss.js - Example 04 - Input
 * 
 */

function DraggableSquare(state) {
	// position
	var x = 170;
	var y = 120;
	var size = 60;
	var color = 'orange';
	
	// dragging
	var dragging = false;
	var drag_x;
	var drag_y;

	// draw the square
	this.draw = function() {
		state.paint.rectFill(x, y, size, size, color);
	};

	// register events
	inputHandler.on('press', function(coords) {
		// check if event occured within the square
		var cx = coords[0];
		var cy = coords[1];
		if (abyss.pointInRect(cx, cy, x, y, size, size)) {
			// begin dragging
			dragging = true;
			drag_x = cx - x;
			drag_y = cy - y;
		}
	});
	inputHandler.on('move', function(coords) {
		if (dragging) {
			var cx = coords[0];
			var cy = coords[1];
			// calculate new coordinates
			var next_x = cx - drag_x;
			var next_y = cy - drag_y;
			// disallow dragging beyond canvas boundaries
			var max_x = 400 - size;
			var max_y = 300 - size;
			x = abyss.clamp(next_x, 0, max_x);
			y = abyss.clamp(next_y, 0, max_y);
		}
	});
	inputHandler.on('release', function(coords) {
		// stop dragging
		dragging = false;
	});
}

// create the main state
var myState = new abyss.State();

// called when state initializes
myState.init = function() {
	this.square = new DraggableSquare(this);
};

// draw the sprite
myState.draw = function() {
	this.square.draw();
};

// setup and run the game
var myGame = new abyss.Game({
	canvasId: 'abyssexample', // canvas element to initialize the game on
	state: myState, // starting game state
	simpleLoop: true // use a simple game loop that only draws and doesn't update
});

// initialize input handler on game
var inputHandler = new abyss.Input(myGame);

// run game on window load
window.addEventListener('load', myGame.run);
