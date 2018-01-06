var worldWidth = window.innerWidth;
var worldHeight = window.innerHeight;
var objLimit = 50;

// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: worldWidth,
		height: worldHeight,
	}
});

engine.world.bounds.max.x = worldWidth;
engine.world.bounds.max.y = worldHeight;

var ground = Bodies.rectangle(worldWidth / 2, worldHeight - 20, worldWidth - 250, 60, { isStatic: true });

var notes = [];

// add all of the bodies to the world
World.add(engine.world, [ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

// create matter-js element
// TODO: construct from SVG
function createNote(x, y, key) {
	var angle = Math.random() * 0.5 - 0.25;
	var vel_y = 0.00015;
	return Matter.Body.create({
		position: {
			x: x,
			y: y
		},
		mass: 0.0017,
		friction: 0,
		restitution: 1,
		angle: angle,
		force: {
			y: vel_y
		}
	});
}

// called in keydown handler
function addNote(e) {
	var str = "qwertyuiop";
	var key = e.originalEvent.key;
	var pos = str.indexOf(key);

	if (pos == -1) {
		return;
	}

	var x_pos = 200 + pos * (worldWidth - 400) / 9;
	var y_pos = worldHeight - 50;

	var note = createNote(x_pos, y_pos, key);
	displayNote(note);
}

function removeNote(e) {
	console.log(e.originalEvent.key);
}

// pushes note into display queue
function displayNote(note) {
	notes.push(note);
	World.add(engine.world, notes[notes.length - 1]);

	if (notes.length > objLimit) {
		World.remove(engine.world, notes[0]);
		notes = notes.slice(1);
	}
}

// keydown handler
$(document).keydown(function(e) {
	if (!(e.handled)) {
		addNote(e);
		e.handled = true;
	}
});

// keyup handler
$(document).keyup(function(e) {
	if (!(e.handled)) {
		removeNote(e);
		e.handled = true;
	}
});