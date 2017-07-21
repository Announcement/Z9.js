/*
 *  Ghost.js
 *  A humble HTML5 game engine
 *
 *  0.3.0
 *
 *  (c) 2017 Danijel Durakovic
 *  MIT License
 */

/*jshint globalstrict:true */
/*jshint browser:true */

/**
 * @file Ghost.js
 * @version 0.3.0
 * @author Danijel Durakovic
 * @copyright 2017
 */

"use strict";

/**
 * Ghost namespace
 * @namespace
 */
var ghost = {};

////////////////////////////////////////////////////////////////////////////////////
//
//  Constants
//
////////////////////////////////////////////////////////////////////////////////////

var G_NULL = void 0;
var G_EMPTYF = function() {};

var G_VIEW_DEFAULT = 0;
var G_VIEW_SCALE_PRESERVERATIO = 1;
var G_VIEW_SCALE_FULL = 2;
var G_VIEW_EXPAND = 3;

////////////////////////////////////////////////////////////////////////////////////
//
//  Common functions
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Composes an object from multiple component objects.
 *
 * @param {...object} var_args - Component objects.
 *
 * @returns {object}
 */
ghost.compose = function(/**/) {
	// es6
	if (Object.assign) {
		return Object.assign.apply(null, arguments);
	}
	// non-es6
	var obj = {};
	var n_args = arguments.length;
	for (var i = 0; i < n_args; ++i) {
		var component = arguments[i];
		if (!component)
			continue;
		for (var key in component) {
			if (component.hasOwnProperty(key)) {
				obj[key] = component[key];
			}
		}
	}
	return obj;
};

/**
 * Returns a number limited to a given range.
 * 
 * @param {number} number - Input number.
 * @param {number} min - Lower range boundary.
 * @param {number} max - Upper range boundary.
 *
 * @returns {number}
 */
ghost.clamp = function(number, min, max) {
	if (number <= min)
		return min;
	else if (number >= max)
		return max;
	return number;
};

/**
 * Returns a random integer in range.
 *
 * @param {number} min - Lower range boundary.
 * @param {number} max - Upper range boundary.
 *
 * @returns {number}
 */
ghost.getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffles a list of elements. This method modifies the original array.
 *
 * @param {array} list
 */
ghost.shuffle = function(list) {
	// fisher-yates shuffle
	var i = list.length;
	while (--i) {
		var r = Math.floor(Math.random() * (i + 1));
		var tmp = list[i];
		list[i] = list[r];
		list[r] = tmp;
	}
};

/**
 * Picks an element from a list at random.
 *
 * @param {array} list
 *
 * @returns {number}
 */
ghost.choose = function(list) {
	if (list instanceof Array) {
		return list[Math.floor(Math.random() * list.length)];
	}
};

/**
 * Checks whether a point resides within a given rectangle.
 *
 * @param {number} x - Point x of coordinate.
 * @param {number} y - Point y of coordinate.
 * @param {number} rx - Rectangle x coordinate.
 * @param {number} ry - Rectangle y coordinate.
 * @param {number} rw - Rectangle width.
 * @param {number} rh - Rectangle height.
 *
 * @returns {bool}
 */
ghost.pointInRect = function(x, y, rx, ry, rw, rh) {
	return x >= rx && x < rx + rw && y >= ry && y < ry + rh;
};

/**
 * Iterates over non-function members of an object.
 *
 * @param {object} collection
 * @param {iterCallback} callback
 */
ghost.iter = function(object, callback) {
	for (var key in object) {
		var item = object[key];
		if (object.hasOwnProperty(key) && !(item instanceof Function)) {
			callback(key, item);
		}
	}
};
/**
 * @callback iterCallback
 * @param {string} key
 * @param {object} item
 */

/**
 * Retreives the extension of a filename. Outputs lowercase.
 *
 * @param {string} filename
 * 
 * @returns {string}
 */
ghost.getFilenameExtension = function(filename) {
	return filename.split('.').pop().toLowerCase();
};

////////////////////////////////////////////////////////////////////////////////////
//
//  Common classes
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a Grid2D object.
 *
 * @class ghost.Grid2D
 * @classdesc Represents a 2D game grid.
 *
 * @param {number} w - Grid width.
 * @param {number} h - Grid height.
 * @param {number} [defaultValue] - Default value. This value will be used to populate
 *   the grid on clear.
 */
ghost.Grid2D = function(w, h, defaultValue) {
	this.width = w;
	this.height = h;
	this.data = new Array(w * h);

	/**
	 * Fills the grid with default values.
	 */
	this.clear = function() {
		var n = w * h;
		for (var i = 0; i < n; ++i) {
			this.data[i] = defaultValue;
		}
	};

	/**
	 * Retreives an item from the grid.
	 *
	 * @param {number} x - x position in the grid.
	 * @param {number} y - y position in the grid.
	 */
	this.get = function(x, y) {
		return this.data[y * this.width + x];
	};
	/**
	 * Sets an item on the grid.
	 *
	 * @param {number} x - x position in the grid.
	 * @param {number} y - y position in the grid.
	 * @param {object} value - Item value.
	 */
	this.set = function(x, y, value) {
		this.data[y * this.width + x] = value;
	};
};

/**
 * Constructs an Axis-aligned bounding box object.
 *
 * @class ghost.AABB
 * @classdesc A simple AABB data structure.
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
ghost.AABB = function(x1, y1, x2, y2) {
	this.x1 = x1 || 0;
	this.y1 = y1 || 0;
	this.x2 = x2 || 0;
	this.y2 = y2 || 0;
	/**
	 * Check if two AABBs intersect.
	 *
	 * @param {ghost.AABB} aabb
	 *
	 * @returns {bool}
	 */
	this.intersects = function(aabb) {
		return (this.x2 > aabb.x1 && this.y2 > aabb.y1 &&
			this.x1 < aabb.x2 && this.y1 < aabb.y2);
	};
};

/**
 * Constructs a Timer object.
 *
 * @class ghost.Timer
 * @classdesc A simple timer that ticks at regular intervals.
 *
 * @param {number} interval - Interval at which the timer ticks.
 */
ghost.Timer = function(interval) {
	interval = interval || 1;
	var acc = 0;
	/**
	 * Indicates whether the timer has ticked or not.
	 *
	 * @name ghost.Timer#ticked
	 * @type boolean
	 * @default false
	 */
	this.ticked = false;
	/**
	 * Runs the timer and reports back the ticked state.
	 *
	 * @param {number} delta - Time from last update.
	 *
	 * @returns {bool}
	 */
	this.run = function(delta) {
		acc += delta;
		if (acc >= interval) {
			acc -= interval;
			this.ticked = true;
			return true;
		}
		this.ticked = false;
		return false;
	};
	/**
	 * Resets the timer.
	 */
	this.reset = function() {
		acc = 0;
		this.ticked = false;
	};
};

////////////////////////////////////////////////////////////////////////////////////
//
//  AssetLoader class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs an AssetLoader object.
 *
 * @class ghost.AssetLoader
 * @classdesc Preloads and stores game assets.
 *
 * @param {object} options - Functions to override
 * @param {function} [options.done] - Triggers when all assets are done loading.
 * @param {progressCallback} [options.progress] - Triggers when a single asset is loaded.
 */
ghost.AssetLoader = function(options) {
	options = options || {};

	var self = this;

	var bank = {};

	this.done = options.done || G_EMPTYF;
	this.progress = options.progress || G_EMPTYF;

	/**
	 * A list of load handlers. These can be overriden by the user to create custom
	 * asset load handlers. The name of the function and the name of the category within
	 * an asset list must match.
	 *
	 * AssetLoader provides handlers for graphics, data and text. Graphics handler is used
	 * for loading image files. Data handler is used for loading JSON files, and Text handler
	 * is used for loading plaintext files.
	 *
	 * Handler functions can be overriden by the user if needed. Custom handlers can be defined
	 * to handle custom data like audio, levels, or other custom data formats. A handler function
	 * receives a filename and passes an object to ready().
	 *
	 * @type {object}
	 *
	 * @example
	 * // Create a custom handler
	 * var loader = new ghost.AssetLoader();
	 * loader.handler.customCategory = function(filename, ready) {
	 *    // handler for customCategory
	 *    // .. do something with filename ..
	 *    var data = 'test';
	 *    // process the asset and return data with ready when done
	 *    ready(data); 
	 * };
	 * 
	 * @example
	 * // Override default graphics handler
	 * loader.handler.graphics = function(filename, ready) {
	 *    // ...
	 * };
	 */
	this.handler = {};

	// default graphics load handler - used for loading image files
	this.handler.graphics = function(filename, ready) {
		var img = new Image();
		img.src = filename;
		img.addEventListener('load', function() {
			ready(img);
		});
	};

	// default data load handler - used for loading JSON files
	this.handler.data = function(filename, ready) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', filename, true);
		xhr.send(null);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var response = xhr.responseText;
				var data = JSON.parse(response);
				ready(data);
			}
		};
	};

	// default text load handler - used for loading text files
	this.handler.text = function(filename, ready) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', filename, true);
		xhr.send(null);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var response = xhr.responseText;
				var data = response;
				ready(data);
			}
		};
	};
	/**
	 * @callback readyCallback
	 * @param {object} data - Game asset.
	 */

	/**
	 * Loads a list of assets. Iterates over categories in the list and then calls
	 * the appropriate load handler on every item in the category. Note that assets
	 * are stored in a flat array, which means that asset keys across all categories
	 * must be unique.
	 *
	 * @param {object} assetList - A categorized list of assets.
	 *
	 * @example
	 * var assetList = {
	 *    graphics: {
	 *       mysprite: 'mysprite.png',
	 *       myimage: 'myimage.jpg'
	 *    },
	 *    json: {
	 *       mydata: 'mydata.json'
	 *    }
	 * };
	 * var loader = new ghost.AssetLoader();
	 * loader.done = function() {
	 *    console.log('All assets loaded and ready!');
	 * };
	 * loader.load(assetList);
	 */
	this.load = function(assetList) {
		// count assets
		var n_loaded = 0;
		var n_toload = 0;
		var n_categories = 0;
		ghost.iter(assetList, function(category, itemList) {
			n_categories++;
			ghost.iter(itemList, function() {
				n_toload++;
			});
		});
		function advanceLoad() {
			n_loaded++;
			self.progress(n_loaded, n_toload);
			if (n_loaded === n_toload)
				self.done();
		}
		// call appropriate handlers on items
		ghost.iter(assetList, function(category, itemList) {
			var loadHandler = self.handler[category];
			if (loadHandler instanceof Function) {
				ghost.iter(itemList, function(key, filename) {
					loadHandler(filename, function(asset) {
						bank[key] = asset;
						advanceLoad();
					});
				});
			}
		});
	};
	/**
	 * Retreives a loaded asset.
	 *
	 * @param {string} key - Asset key.
	 */
	this.get = function(key) {
		return bank[key];
	};

	/**
	 * Inflates an object with loaded assets.
	 *
	 * @param {object} object - Object to inflate.
	 * @param {array} keys - A list of asset keys.
	 *
	 * @example
	 * var loader = new ghost.AssetLoader();
	 * var assets = {
	 *    graphics: {
	 *       GFX_BACKGROUND: 'background.png',
	 *       GFX_SPRITE: 'sprite.png'
	 *    }
	 * };
	 * var graphics = {};
	 * loader.load(assets);
	 * loader.done = function() {
	 *    loader.acquire(graphics, {
	 *       background: 'GFX_BACKGROUND',
	 *       sprite: 'GFX_SPRITE'
	 *    });
	 * };
	 * state.draw = function() {
	 *    // ready to use
	 *    this.paint(graphics.background, 0, 0);
	 *    this.paint(graphics.sprite, 0, 0);
	 * });
	 */
	this.acquire = function(object, keys) {
		ghost.iter(keys, function(key, item) {
			object[key] = bank[item];
		});
	};
};
/**
 * @callback progressCallback
 * @param {number} n_loaded - Total number of items loaded.
 * @param {number} n_toload - Total number of items to load.
 */

////////////////////////////////////////////////////////////////////////////////////
//
//  Input class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs an Input object.
 *
 * @class ghost.Input
 * @classdesc Provides features for dealing with mouse and touch input.
 *
 * @param {object} game - Reference to Game object to capture input on.
 */
ghost.Input = function(game) {
	// input agents
	var MOUSE = 0;
	var TOUCH = 1;

	// capture element
	var element = game.getSurface().getCanvas();
	var elementOwner = element.parentElement;

	function translateCoords(e, agent) {
		var ratio_x, ratio_y;
		switch(game.getViewMode()) {
			case G_VIEW_SCALE_PRESERVERATIO:
				ratio_x = ratio_y = (element.offsetWidth < elementOwner.offsetWidth) ?
					element.height / elementOwner.offsetHeight :
					element.width / elementOwner.offsetWidth;
				break;
			case G_VIEW_SCALE_FULL:
				ratio_x = element.width / elementOwner.offsetWidth;
				ratio_y = element.height / elementOwner.offsetHeight; 
				break;
			case G_VIEW_EXPAND:
			case G_VIEW_DEFAULT:
				ratio_x = ratio_y = 1;
				break;
		}
		var bounds = element.getBoundingClientRect();
		var px = (agent === TOUCH) ? e.changedTouches[0].clientX : e.clientX;
		var py = (agent === TOUCH) ? e.changedTouches[0].clientY : e.clientY;
		return [
			Math.floor((px - bounds.left) * ratio_x),
			Math.floor((py - bounds.top) * ratio_y)
		];
	}

	// event callback lists
	var cb = { press: [], move: [], release: [] };

	// event handlers
	function mouseHandler(callbackList, e, verifyButton) {
		if (e.preventDefault)
			e.preventDefault();
		if (verifyButton) {
			var button = e.which || e.button;
			if (button !== 1)
				return;
		}
		// translate
		var coords = translateCoords(e, MOUSE);
		// dispatch
		var i = callbackList.length;
		while (i--) {
			callbackList[i](coords);
		}
		return false;
	}

	function touchHandler(callbackList, e) {
		if (e.preventDefault)
			e.preventDefault();
		if (e.touches.length > 1)
			return;
		// translate
		var coords = translateCoords(e, TOUCH);
		// dispatch
		var i = callbackList.length;
		while (i--) {
			callbackList[i](coords);
		}
		return false;
	}

	// attach listeners
	element.addEventListener('mousedown', function(e) {
		mouseHandler(cb.press, e, MOUSE, true);
	});
	element.addEventListener('touchstart', function(e) {
		touchHandler(cb.press, e, TOUCH);
	});
	window.addEventListener('mousemove', function(e) {
		mouseHandler(cb.move, e, MOUSE, false);
	});
	window.addEventListener('touchmove', function(e) {
		touchHandler(cb.move, e, TOUCH);
	});
	window.addEventListener('mouseup', function(e) {
		mouseHandler(cb.release, e, MOUSE, true);
	});
	window.addEventListener('touchend', function(e) {
		touchHandler(cb.release, e, TOUCH);
	});
	
	/**
	 * Registers an event.
	 *
	 * @param {string} eventType - Type of event to register: press, move or release.
	 * @param {inputEventCallback} callback - Event callback.
	 */
	// TODO add state context
	this.on = function(eventType, callback) {
		cb[eventType].push(callback);
	};
	/**
	 * @callback inputEventCallback
	 * @param {array} coordinates - Event coordinates.
	 */
};

////////////////////////////////////////////////////////////////////////////////////
//
//  KeyInput class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a KeyInput object.
 *
 * @class ghost.KeyInput
 * @classdesc Provides features for dealing with keyboard input.
 */
ghost.KeyInput = function() {
	var self = this;
	
	var eventQueue = [];
	var keyBuffer = [];

	function addKeyEvent(type, keycode) {
		// add event to the queue
		eventQueue.push({
			type: type,
			keycode: keycode
		});
	}

	// event type constants
	this.KEYDOWN = 0;
	this.KEYUP = 1;

	// attach listeners
	document.addEventListener('keydown', function(e) {
		var key = e.keyCode || e.which;
		// prevent default backspace behavior
		if (key === self.keyBackspace || key === self.keyAlt)
			e.preventDefault();
		if (!keyBuffer[key]) {
			keyBuffer[key] = true;
			addKeyEvent(self.KEYDOWN, key);
		}
	});
	document.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which;
		if (key === self.keyBackspace || key === self.keyAlt)
			e.preventDefault();
		if (keyBuffer[key]) {
			delete keyBuffer[key];
			addKeyEvent(self.KEYUP, key);
		}
	});
	window.onblur = function() {
		// clear event queue and key buffer so we don't end up with dangling events
		eventQueue = [];
		keyBuffer = [];
	};

	/**
	 * Clear the event queue and key buffer.
	 */
	this.clear = function() {
		eventQueue = [];
		keyBuffer = [];
	};
	
	/**
	 * Poll a single keyboard event from the queue.
	 *
	 * @return {object}
	 */
	this.pollEvent = function() {
		return eventQueue.shift();
	};

	/**
	 * Checks if a keycode is alphanumeric.
	 *
	 * @returns {bool}
	 */
	this.isAlphanumeric = function(keycode) {
		return !(!(keycode > 47 && keycode < 58) &&
			!(keycode > 64 && keycode < 91) &&
			!(keycode > 96 && keycode < 123));
	};

	/**
	 * Converts a keycode into a character.
	 *
	 * @returns {string}
	 */
	this.getASCII = function(keycode) {
		return String.fromCharCode(keycode);
	};

	/**
	 * Gets keydown state for a given keycode.
	 *
	 * @param {number} keycode
	 *
	 * @returns {bool}
	 */
	this.isKeyDown = function(key) {
		var keyState = keyBuffer[key];
		return keyState !== undefined && keyState;
	};

	// keycodes
	this.keyCancel = 3; this.keyHelp = 6; this.keyBackspace = 8; this.keyTab = 9; this.keyClear = 12;
	this.keyReturn = 13; this.keyEnter = 14; this.keyShift = 16; this.keyControl = 17; this.keyAlt = 18;
	this.keyPause = 19; this.keyCapsLock = 20; this.keyEscape = 27; this.keySpace = 32; this.keyPageUp = 33;
	this.keyPageDown = 34; this.keyEnd = 35; this.keyHome = 36; this.keyLeft = 37; this.keyUp = 38;
	this.keyRight = 39; this.keyDown = 40; this.keyPrintscreen = 44; this.keyInsert = 45; this.keyDelete = 46;
	this.key0 = 48; this.key1 = 49; this.key2 = 50; this.key3 = 51; this.key4 = 52; this.key5 = 53; this.key6 = 54;
	this.key7 = 55; this.key8 = 56; this.key9 = 57; this.keySemicolon = 59; this.keyEquals = 61; this.keyA = 65;
	this.keyB = 66; this.keyC = 67; this.keyD = 68; this.keyE = 69; this.keyF = 70; this.keyG = 71; this.keyH = 72;
	this.keyI = 73; this.keyJ = 74; this.keyK = 75; this.keyL = 76; this.keyM = 77; this.keyN = 78; this.keyO = 79;
	this.keyP = 80; this.keyQ = 81; this.keyR = 82; this.keyS = 83; this.keyT = 84; this.keyU = 85; this.keyV = 86;
	this.keyW = 87; this.keyX = 88; this.keyY = 89; this.keyZ = 90; this.keyContextMenu = 93; this.keyNumpad0 = 96;
	this.keyNumpad1 = 97; this.keyNumpad2 = 98; this.keyNumpad3 = 99; this.keyNumpad4 = 100; this.keyNumpad5 = 101;
	this.keyNumpad6 = 102; this.keyNumpad7 = 103; this.keyNumpad8 = 104; this.keyNumpad9 = 105; this.keyMultiply = 106;
	this.keyAdd = 107; this.keySeparator = 108; this.keySubtract = 109; this.keyDecimal = 110; this.keyDivide = 111;
	this.keyF1 = 112; this.keyF2 = 113; this.keyF3 = 114; this.keyF4 = 115; this.keyF5 = 116; this.keyF6 = 117;
	this.keyF7 = 118; this.keyF8 = 119; this.keyF9 = 120; this.keyF10 = 121; this.keyF11 = 122; this.keyF12 = 123;
	this.keyF13 = 124; this.keyF14 = 125; this.keyF15 = 126; this.keyF16 = 127; this.keyF17 = 128; this.keyF18 = 129;
	this.keyF19 = 130; this.keyF20 = 131; this.keyF21 = 132; this.keyF22 = 133; this.keyF23 = 134; this.keyF24 = 135;
	this.keyNumLock = 144; this.keyScrollLock = 145; this.keyComma = 188; this.keyPeriod = 190; this.keySlash = 191;
	this.keyBackQuote = 192; this.keyOpenBracket = 219; this.keyBackSlash = 220; this.keyCloseBracket = 221;
	this.keyQuote = 222; this.keyMeta = 224;
};

////////////////////////////////////////////////////////////////////////////////////
//
//  Configuration class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a Configuration object.
 *
 * @class ghost.Configuration
 * @classdesc Provides persistent storage through HTML5 local storage.
 *
 * @param {string} key - Local storage key.
 * @param {object} defaultConfiguration - Configuration to use when local storage key
 *     is not found.
 */
ghost.Configuration = function(key, defaultConfiguration) {
	var self = this;
	/**
	 * Save configuration.
	 */
	this.save = function() {
		localStorage.setItem(key, JSON.stringify(self));
	};
	/**
	 * Load configuration.
	 */
	this.load = function() {
		var localConfig = localStorage.getItem(key);
		var config = (localConfig) ? JSON.parse(localConfig) : defaultConfiguration;
		// clear all config beforehand
		ghost.iter(self, function(key) {
			delete self[key];
		});
		// populate config
		ghost.iter(config, function(key, item) {
			self[key] = item;
		});
	};
};

////////////////////////////////////////////////////////////////////////////////////
//
//  Render class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a Render object.
 *
 * @class ghost.Render
 * @classdesc Provides various drawing functions.
 *
 * @param {object} ctx - Rendering context.
 *
 */
ghost.Render = function(ctx) {
	/**
	 * Sets the global alpha value.
	 *
	 * @param {number} [alpha=1] - A value in range from 0 to 1.
	 */
	this.setAlpha = function(alpha) {
		if (alpha === undefined)
			alpha = 1;
		else if (alpha <= 0)
			alpha = 0;
		else if (alpha >= 1)
			alpha = 1;
		ctx.globalAlpha = alpha;
	};

	/**
	 * Renders a rectangle.
	 *
	 * @param {number} x - Rectangle x position.
	 * @param {number} y - Rectangle y position.
	 * @param {number} w - Rectangle width.
	 * @param {number} h - Rectangle height.
	 * @param {string} [color="#fff"] - Rectangle line color.
	 * @param {number} [width=1] - Rectangle line width.
	 */
	this.rect = function(x, y, w, h, color, width) {
		color = (color === undefined) ? '#fff' : color;
		width = (width === undefined) ? 1 : width;
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.strokeRect(x, y, w, h);
	};

	/**
	 * Renders a filled rectangle.
	 *
	 * @param {number} x - Rectangle x position.
	 * @param {number} y - Rectangle y position.
	 * @param {number} w - Rectangle width.
	 * @param {number} h - Rectangle height.
	 * @param {string} [color="#fff"] - Rectangle fill color.
	 */
	this.rectFill = function(x, y, w, h, color) {
		color = (color === undefined) ? '#fff' : color;
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	};

	/**
	 * Renders an arc.
	 *
	 * @param {number} x - Arc x position.
	 * @param {number} y - Arc y position.
	 * @param {number} rad - Arc radius.
	 * @param {number} start - Arc start angle.
	 * @param {number} end - Arc end angle.
	 * @param {string} [color="#fff"] - Arc color.
	 * @param {number} [width=1] - Arc line width.
	 */
	this.arc = function(x, y, rad, start, end, color, width) {
		color = (color === undefined) ? '#fff' : color;
		width = (width === undefined) ? 1 : width;
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.arc(x, y, rad, start, end);
		ctx.stroke();
	};

	/**
	 * Renders a circle.
	 *
	 * @param {number} x - Circle x position.
	 * @param {number} y - Circle y position.
	 * @param {number} rad - Circle radius.
	 * @param {string} [color="#fff"] - Circle line color.
	 * @param {number} [width=1] - Circle line width.
	 */
	this.circle = function(x, y, rad, color, width) {
		color = (color === undefined) ? '#fff' : color;
		width = (width === undefined) ? 1 : width;
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.arc(x, y, rad, 0, Math.PI * 2);
		ctx.stroke();
	};

	/**
	 * Renders a filled circle.
	 *
	 * @param {number} x - Circle x position.
	 * @param {number} y - Circle y position.
	 * @param {number} rad - Circle radius.
	 * @param {string} [color="#fff"] - Circle fill color.
	 */
	this.circleFill = function(x, y, rad, color) {
		color = (color === undefined) ? '#fff' : color;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, rad, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	};

	/**
	 * Renders a polygon.
	 *
	 * @param {array} points - A list of polygon points. Each point is an array of length two,
	 *   containing the coordinates.
	 * @param {string} color - Polygon color.
	 */
	this.polygon = function(points, color) {
		color = (color === undefined) ? '#fff' : color;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		var n_points = points.length;
		for (var i = 1; i < n_points; i++) {
			var p = points[i];
			ctx.lineTo(p[0], p[1]);
		}
		ctx.closePath();
		ctx.fill();
	};

	/**
	 * Renders graphics.
	 *
	 * @param {object} gfx - Source graphics.
	 * @param {number} x - Graphics x position.
	 * @param {number} y - Graphics y position.
	 * @param {number} [w] - Graphics width.
	 * @param {number} [h] - Graphics height.
	 */
	this.graphics = function(gfx, x, y, w, h) {
		if (w === undefined || h === undefined) {
			ctx.drawImage(gfx, x, y);
		}
		else {
			ctx.drawImage(gfx, x, y, w, h);
		}
	};
	
	/**
	 * Renders a tile from a tileset.
	 *
	 * @param {object} gfx - Source graphics.
	 * @param {number} x - Tile x position.
	 * @param {number} y - Tile y position.
	 * @param {number} w - Tile width.
	 * @param {number} h - Tile height.
	 * @param {number} sx - Source x position.
	 * @param {number} sy - Source y position.
	 */	
	this.tile = function(gfx, x, y, w, h, sx, sy) {
		ctx.drawImage(gfx, sx, sy, w, h, x, y, w, h);
	};

	/**
	 * Renders a stretched tile from a tileset.
	 *
	 * @param {object} gfx - Source graphics.
	 * @param {number} x - Tile x position.
	 * @param {number} y - Tile y position.
	 * @param {number} sw - Source width.
	 * @param {number} sh - Source height.
	 * @param {number} sx - Source x position.
	 * @param {number} sy - Source y position.
	 * @param {number} w - Tile width.
	 * @param {number} h - Tile height.
	 */
	this.stretchTile = function(gfx, x, y, sw, sh, sx, sy, w, h) {
		ctx.drawImage(gfx, sx, sy, sw, sh, x, y, w, h);
	};

	/**
	 * Renders text. Note that this method is slow when executed repeatedly.
	 * Pre-render texts onto surfaces whenever possible.
	 *
	 * @param {string} text - Text to display.
	 * @param {number} x - Text x position.
	 * @param {number} y - Text y position.
	 * @param {string} [color=#000] - Color code.
	 * @param {string} [alignment=left] - Text alignment: left, center or right.
	 * @param {string} [font=11px sans-serif] - Font to use.
	 */
	this.text = function(text, x, y, color, alignment, font) {
		color = (color === undefined) ? '#000' : color;
		alignment = (alignment === undefined) ? 'left' : alignment;
		font = (font === undefined) ? '11px sans-serif' : font;
		ctx.textBaseline = 'top';
		ctx.fillStyle = color;
		ctx.textAlign = alignment;
		ctx.font = font;
		ctx.fillText(text, x, y);
	};

	/**
	 * Renders ASCII text with custom bitmap font.
	 *
	 * @param {ghost.Font} font - Bitmap font.
	 * @param {string} text - Text to display.
	 * @param {number} x - Text x position.
	 * @param {number} y - Text y position.
	 * @param {number} [color=0] - Color index.
	 * @param {number} [align=0] - Align left: 0, right: 1, or center: 2.
	 */
	this.bmptext = function(font, text, x, y, color, align) {
		if (color === undefined)
			color = 0;
		var len = text.length;
		var fw = font.width;
		var fh = font.height;
		var fgfx = font.gfx;
		var ry = font.tilesH * color;
		var acc = 0;
		var varw = font.varwidth;
		var offset = 0;
		var textw;
		var i, ci;
		if (align > 0) {
			if (varw) {
				for (i = 0; i < len; i++) {
					ci = text.charCodeAt(i) - 32;
					acc += font.widths[ci] + font.spacing;
				}
				textw = acc;
				acc = 0;
			}
			else {
				textw = len * fw;
			}
			offset = (align == 1) ? Math.floor(textw / 2) : textw;
		}
		for (i = 0; i < len; i++) {
			ci = text.charCodeAt(i) - 32;
			var px;
			if (varw) {
				px = x + acc;
				acc += font.widths[ci] + font.spacing;
			}
			else {
				px = x + i * (fw + font.spacing);
			}
			if (ci === 0)
				continue;
			var cx = fw * (ci % font.tilesPerRow);
			var cy = fh * Math.floor(ci / font.tilesPerRow) + ry;
			ctx.drawImage(fgfx, cx, cy, fw, fh, px - offset, y, fw, fh);
		}
	};
};

////////////////////////////////////////////////////////////////////////////////////
//
//  Font class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a Font object.
 * 
 * @class ghost.Font
 * @classdesc Provides a bitmap font construct. This is a faster alternative to native
 *   canvas text rendering routines. It is more consistent since letters and spacings
 *   will always be rendered pixel perfect in all browsers, but it is also more
 *   limiting since it is confined to a relatively small set of characters. The range of
 *   characters is limited to ASCII 32-126.
 * 
 * @param {object} options - Font options.
 * @param {object} options.graphics - Font graphics.
 * @param {array} options.size - Font size given by [width, height]
 * @param {number} [options.spacing=2] - Letter spacing in pixels.
 * @param {bool} [options.varwidth=false] - Specifies whether the font uses variable
 *   width characters.
 * @param {object|array} [options.widths] - Map or list of character widths.
 */
ghost.Font = function(options) {
	this.gfx = options.graphics;
	this.width = options.size[0];
	this.height = options.size[1];
	this.spacing = (options.spacing === undefined) ? 2 : options.spacing;
	this.tilesPerRow = Math.floor(this.gfx.width / this.width);
	this.tilesH = Math.ceil(95 / this.tilesPerRow) * this.height;
	this.varwidth = (options.varwidth === true);
	if (this.varwidth) {
		if (options.widths instanceof Array) {
			// use the widths list as is
			this.widths = options.width;
		}
		else {
			// convert widths map to an array
			this.widths = [];
			for (var c = 32; c <= 126; c++) {
				var key = String.fromCharCode(c);
				var w = options.widths[key];
				this.widths.push((w) ? w : this.width);
			}
		}
	}
};

////////////////////////////////////////////////////////////////////////////////////
//
//  Surface class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a Surface object.
 *
 * @class ghost.Surface
 * @classdesc An interface for drawing graphics. Can be used either to wrap an
 *     existing canvas element or create a virtual canvas element.
 *
 * @param {object} options - Surface options.
 * @param {string} [options.fromCanvas] - HTML id of canvas element to create Surface on.
 * @param {number} [options.width=100] - Width of new virtual Surface.
 * @param {number} [options.height=100] - Height of new virtual Surface.
 *
 * @example
 * // Create a new Surface on canvas with ID "myCanvas"
 * // width and height are inferred from the element
 * new ghost.Surface({ fromCanvas: 'myCanvas' });
 *
 * @example
 * // Create a new virtual Surface with size 200x100
 * new ghost.Surface({ width: 200, height: 100 });
 */
ghost.Surface = function(options) {
	options = options || {};

	var canvas, ctx;
	var fill;

	if (options.fromCanvas) {
		// wrap around existing canvas element
		canvas = options.fromCanvas;
		this.width = canvas.width;
		this.height = canvas.height;
	}
	else {
		// create a new canvas instance
		var w = (options.width === undefined) ? 100 : options.width;
		var h = (options.height === undefined) ? 100 : options.height;
		canvas = document.createElement('canvas');
		this.width = canvas.width = w;
		this.height = canvas.hight = h;
	}
	ctx = canvas.getContext('2d');

	var original_width = this.width;
	var original_height = this.height;

	/**
	 * An instance of Render.
	 *
	 * @name ghost.Surface#render
	 * @type {ghost.Render}
	 */
	this.render = new ghost.Render(ctx);
	
	// clear methods
	this.cm_clear = function() {
		ctx.clearRect(0, 0, this.width, this.height);
	};

	this.cm_fill = function() {
		ctx.fillStyle = fill;
		ctx.fillRect(0, 0, this.width, this.height);
	};

	/**
	 * Clears the surface of anything that is drawn on it.
	 * @name clear
	 * @function
	 * @memberof ghost.Surface
	 * @instance
	 */
	this.clear = G_NULL;

	/**
	 * Sets Default clear method. When clear() is called, it will clear all
	 * pixel data from the surface.
	 */
	this.setDefaultClearMethod = function() {
		this.clear = this.cm_clear;
	};

	/**
	 * Sets Fill clear method. When clear() is called, it will fill the surface
	 * with the given color.
	 *
	 * @param {string} fill_color - Color to use for clearing.
	 */
	this.setFillClearMethod = function(fill_color) {
		fill = (fill_color === undefined) ? '#000' : fill_color;
		this.clear = this.cm_fill;
	};

	/**
	 * Retreives the canvas object.
	 *
	 * @return {object} Canvas object
	 */
	this.getCanvas = function() {
		return canvas;
	};

	/**
	 * Resets the size of Surface back to original.
	 *
	 */
	this.resetSize = function() {
		this.resize(original_width, original_height);
	};

	/**
	 * Resizes the Surface.
	 *
	 * @param {number} width - New width.
	 * @param {number} height - New height.
	 */
	this.resize = function(width, height) {
		this.width = canvas.width = width;
		this.height = canvas.height = height;
	};

	// set default clearing
	this.setDefaultClearMethod();
};


////////////////////////////////////////////////////////////////////////////////////
//
//  State class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a State object.
 *
 * @class ghost.State
 * @classdesc Implements a game state. Every game state comes with a reference to
 *   the global Surface object which is used for drawing.
 *
 * @param {object} options - Functions to override.
 * @param {function} [options.init] - Triggers once on state initialization.
 * @param {function} [options.in] - Triggers on state enter.
 * @param {function} [options.out] - Triggers on state exit.
 * @param {function} [options.draw] - Triggers on state paint events.
 * @param {function} [options.update] - Triggers on state update events.
 */
ghost.State = function(options) {
	options = options || {};
	this._initialized = false;
	this._initState = function(surface) {
		if (!this._initialized) {
			this._initialized = true;
			this.surface = surface;
			this.paint = surface.render;
		}
	};
	/**
	 * Global surface.
	 *
	 * @name ghost.State#surface
	 * @type {ghost.Surface}
	 */
	this.surface = G_NULL;
	/**
	 * Shorthand for state.surface.render.
	 *
	 * @name ghost.State#paint
	 * @type {ghost.Render}
	 */
	this.paint = G_NULL;
	// user functions
	this.init   = options.init   || G_EMPTYF;
	this.in     = options.in     || G_EMPTYF;
	this.out    = options.out    || G_EMPTYF;
	this.update = options.update || G_EMPTYF;
	this.draw   = options.draw   || G_EMPTYF;
};


////////////////////////////////////////////////////////////////////////////////////
//
//  Game class
//
////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a Game object.
 *
 * @class ghost.Game
 * @classdesc Initializes and runs the game.
 *
 * @param {object} options - Game options.
 * @param {string} options.canvasId - HTML ID of canvas element to create Game on.
 * @param {string} [options.background] - Fill color (if ommitted clear is used instead).
 * @param {boolean} [options.simpleLoop=false] - When set to true, a simple main loop
 *   will be used. This is an alternative version of the core game loop that only does
 *   drawing, and leaves updates to the programmer. Use this if your game does not require
 *   timed events and relies on user events.
 * @param {number} [options.fps=60] - Game FPS (void when simpleLoop=true).
 * @param {number} [options.framerate=60] - Game frame rate (void when simpleLoop=true).
 * @param {array} [options.gameStates] - List of states to be initialized upon game run.
 *   If states are left uninitialized, they will initialize once as they activate for the
 *   first time. You can safely omit this argument if your states can load independently.
 *   Use initStates() to initialize states manually.
 */
ghost.Game = function(options) {
	var self = this;

	var state = G_NULL;
	var surface = G_NULL;

	// references to canvas and canvas parent elements
	var canvas;
	var canvasOwner;

	// main loop
	var fps = 60, framerate = 60;
	var last = 0, delta = 0, acc = 0;
	var timestep;

	function mainLoop(time) {
		requestAnimationFrame(mainLoop);
		delta = time - last;
		last = time;
		acc += delta;
		while (acc >= timestep) {
			state.update(timestep * framerate / 1000);
			acc -= timestep;
		}
		surface.clear();
		state.draw();
	}

	function simpleMainLoop() {
		requestAnimationFrame(simpleMainLoop);
		surface.clear();
		state.draw();
	}

	//
	// view handling
	//
	var view_mode = G_VIEW_DEFAULT;
	var view_updatehandler = G_NULL;
	var view_debounce_timeout = G_NULL;
	var view_debounce_delay = 20;
	var viewHandlers = {
		init: {},
		update: {}
	};

	// default view handler
	viewHandlers.init[G_VIEW_DEFAULT] = function() {
		surface.resetSize();
		canvas.style.width = surface.width + 'px';
		canvas.style.height = surface.height + 'px';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.right = '0';
		canvas.style.bottom = '0';
		canvas.style.margin = 'auto';
	};
	viewHandlers.update[G_VIEW_DEFAULT] = G_NULL;

	// scale-preserveratio handlers
	viewHandlers.init[G_VIEW_SCALE_PRESERVERATIO] = function() {
		surface.resetSize();
		viewHandlers.update[G_VIEW_SCALE_PRESERVERATIO]();
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.right = '0';
		canvas.style.bottom = '0';
		canvas.style.margin = 'auto';
	};
	viewHandlers.update[G_VIEW_SCALE_PRESERVERATIO] = function() {
		var cw = surface.width;
		var ch = surface.height;
		var dw = canvasOwner.offsetWidth;
		var dh = canvasOwner.offsetHeight;
		var ratio = cw / ch;
		var width = dh * ratio;
		var height;
		if (width > dw) {
			ratio = ch / cw;
			width = dw;
			height = dw * ratio;
		}
		else {
			height = dh;
		}
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
	};
	
	// scale-full handlers
	viewHandlers.init[G_VIEW_SCALE_FULL] = function() {
		surface.resetSize();
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.top = '0';
		canvas.style.left = '0';
	};
	viewHandlers.update[G_VIEW_SCALE_FULL] = G_NULL;
	
	// expand handlers
	viewHandlers.init[G_VIEW_EXPAND] = function() {
		viewHandlers.update[G_VIEW_EXPAND]();
		canvas.style.top = '0';
		canvas.style.left = '0';
	};
	viewHandlers.update[G_VIEW_EXPAND] = function() {
		surface.resize(canvasOwner.offsetWidth, canvasOwner.offsetHeight);
	};

	function pollViewUpdate() {
		clearTimeout(view_debounce_timeout);
		view_debounce_timeout = setTimeout(view_updatehandler, view_debounce_delay);
	}
	
	/**
	 * Changes active game state.
	 *
	 * @param {ghost.State} next - State to switch to.
	 */
	this.setState = function(next) {
		if (state) {
			state.out();
		}
		state = next;
		if (!state._initialized) {
			state._initState(surface);
			state.init();
		}
		state.in();
	};

	/**
	 * Retreives active game state.
	 *
	 * @returns {ghost.State}
	 */
	this.getState = function() {
		return state;
	};

	/**
	 * Retreives the main game surface.
	 * 
	 * @returns {ghost.Surface}
	 */
	this.getSurface = function() {
		return surface;
	};

	/**
	 * Initializes game states. Skips already initialized states.
	 *
	 * @param {array} states - A list of states ready to be initialized.
	 *
	 */
	this.initStates = function(states) {
		var n_states = states.length;
		for (var i = 0; i < n_states; i++) {
			var game_state = states[i];
			if (!game_state._initialized) {
				game_state._initState(surface);
				game_state.init();	
			}
		}
	};

	/**
	 * Starts the game.
	 */
	this.run = function() {
		// initialize game states on startup if provided
		if (options.gameStates instanceof Array) {
			var n_states = options.gameStates.length;
			for (var i = 0; i < n_states; i++) {
				var game_state = options.gameStates[i];
				game_state._initState(surface);
				game_state.init();	
			}
		}
		// set initial game state
		self.setState(options.state);
		// enter main loop
		if (options.simpleLoop) {
			// enter simple loop with no update function
			requestAnimationFrame(simpleMainLoop);
		}
		else {
			// setup main loop
			fps = options.fps || fps;
			framerate = options.framerate || framerate;
			timestep = 1000 / fps;
			// enter regular loop with the update function
			requestAnimationFrame(mainLoop);
		}
	};

	/**
	 * Sets the view mode.
	 *
	 * @param {string|number} mode - Set the view mode to one of the following:
	 *   'default', 'scale_preserveratio', 'scale_full', or 'expand'.
	 */
	this.setViewMode = function(mode) {
		// remove the update handler and the resize event
		if (view_updatehandler) {
			view_updatehandler = G_NULL;
			//window.onresize = G_NULL;
			window.removeEventListener('resize', pollViewUpdate);
		}
		// setup view mode
		if (typeof mode === 'string') {
			switch (mode.trim().toLowerCase()) {
				case 'scale-preserveratio':
				case 'scale_preserveratio':
					view_mode = G_VIEW_SCALE_PRESERVERATIO;
					break;
				case 'scale-full':
				case 'scale_full':
					view_mode = G_VIEW_SCALE_FULL;
					break;
				case 'expand':
					view_mode = G_VIEW_EXPAND;
					break;
				default:
					view_mode = G_VIEW_DEFAULT;
					break;
			}
		}
		else {
			view_mode = mode;
		}
		// reset view
		canvas.removeAttribute('style');
		canvas.style.position = 'absolute';
		/*
		view_w = canvasOwner.offsetWidth;
		view_h = canvasOwner.offsetHeight;
		*/
		// set the update handler
		view_updatehandler = viewHandlers.update[view_mode];
		// initialize view
		viewHandlers.init[view_mode]();
		// attach resize listener only if the update handler is defined
		if (view_updatehandler) {
			//window.onresize = pollViewUpdate;
			window.addEventListener('resize', pollViewUpdate);
		}
	};

	/**
	 * Retreives the view mode.
	 *
	 * @returns {number}
	 */
	this.getViewMode = function() {
		return view_mode;
	};

	/**
	 * Force a view update.
	 */
	this.updateView = function() {
		if (view_updatehandler)
			view_updatehandler();
	};

	// retreive the canvas element
	canvas = document.getElementById(options.canvasId);
	canvasOwner = canvas.parentElement;

	// create the surface object
	surface = new ghost.Surface({ fromCanvas: canvas });
	if (options.background) {
		surface.setFillClearMethod(options.background);
	}
};
