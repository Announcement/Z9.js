/*
 *  Abyss.js - Example 03 - Graphics
 * 
 */

// asset list
var myAssets = {
	graphics: {
		sprite: 'sprite.png'
	}
};

// asset loader
var myLoader = new abyss.AssetLoader();

// called when loader finishes loading assets
myLoader.done = function() {
	myGame.run();
};
 
// create the main state
var myState = new abyss.State();

// called when state initializes
myState.init = function() {
	this.sprite = myLoader.get('sprite');
};

// draw the sprite
myState.draw = function() {
	this.paint.graphics(this.sprite, 140, 90);
};

// setup and run the game
var myGame = new abyss.Game({
	canvasId: 'abyssexample', // canvas element to initialize the game on
	state: myState, // starting game state
	simpleLoop: true // use a simple game loop that only draws and doesn't update
});

// load assets on window load
window.addEventListener('load', function() {
	myLoader.load(myAssets);
});
