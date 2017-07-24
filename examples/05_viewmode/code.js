/*
 *  Ghost.js - Example 05 - View Mode
 * 
 */

// bouncy box class
function BouncyBox(state, options) {
	// position, velocity and size of the box
	var pos = { x: options.x, y: options.y };
	var vel = { x: options.vel_x, y: options.vel_y };
	var size = options.size;

	this.animate = function(delta) {
		// bounce the box around
		pos.x += vel.x * delta;
		pos.y += vel.y * delta;
		var max_x = state.surface.width - size;
		var max_y = state.surface.height - size;
		if (pos.x >= max_x) {
			pos.x = max_x;
			vel.x = -vel.x;
		}
		else if (pos.x <= 0) {
			vel.x = -vel.x;
		}
		if (pos.y > max_y) {
			pos.y = max_y;
			vel.y = -vel.y;
		}
		else if (pos.y <= 0) {
			vel.y = -vel.y;
		}
	};

	this.draw = function() {
		// we have access to state's paint
		state.paint.rectFill(pos.x, pos.y, size, size, options.color);
	};
}

// create the main state
var myState = new ghost.State();

// called when state initializes
myState.init = function() {
	// create several bouncing boxes
	this.boxes = [];
	for (var i = 0; i < 50; i++) {
		var box_size = ghost.getRandomInt(10, 30);
		this.boxes.push(new BouncyBox(this, {
			x: ghost.getRandomInt(0, 400 - box_size),
			y: ghost.getRandomInt(0, 300 - box_size),
			vel_x: ghost.getRandomInt(-200, 200) / 100,
			vel_y: ghost.getRandomInt(-200, 200) / 100,
			color: ghost.choose(['orange', 'red', 'blue', 'purple', 'gray', 'green']),
			size: box_size
		}));
	}
};

// draw the sprite
myState.draw = function() {
	var n_boxes = this.boxes.length;
	for (var i = 0; i < n_boxes; i++) {
		this.boxes[i].draw();
	}
};

myState.update = function(delta) {
	var n_boxes = this.boxes.length;
	for (var i = 0; i < n_boxes; i++) {
		this.boxes[i].animate(delta);
	}
};

// setup and run the game
var myGame = new ghost.Game({
	canvasId: 'ghostexample',
	state: myState
});

// force-set default view mode
// this alters the elements CSS
myGame.setViewMode('default');

// switch between view modes
selectview.addEventListener('change', function() {
	var mode = selectview.options[selectview.selectedIndex].text;
	myGame.setViewMode(mode);
});

// run game on window load
window.addEventListener('load', myGame.run);
