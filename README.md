Abyss.js is a HTML5 game development toolkit intended primarily for basic 2D game development.

![Mascot](mascot.png)

Version 0.5.0 - use at your own peril.

## Core Concepts

This library provides a collection of classes and functions which simplify some of the heavy-lifting involved in developing simple 2D games from scratch using HTML5.

The following are the core abstractions upon which a game is built on:
- render - provides a number of drawing methods
- surface - wraps a canvas element and provides a renderer
- state - handles game logic and provides a reference to the global surface
- game - handles game states

Multiple states may be created and activated as needed. The active game state is the one that is currently being updated and drawn and only one state can be active at any given time. States maintain a reference to the global surface object, which wraps the native canvas element and is initialzed on game startup. A surface includes a renderer which is used for drawing graphics.

Most features in this engine are class based and provide an easy to use API which is covered in the documentation. Browse through examples' code to see the API in action.

## License

Copyright (c) 2017 Danijel Durakovic

MIT License
