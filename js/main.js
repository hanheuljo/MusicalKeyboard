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

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var boxC = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(worldWidth / 2, worldHeight - 20, worldWidth - 250, 60, { isStatic: true });

var notes = [];

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

function createNote(x, y, key) {
	return Matter.Body.create({
		position: {
			x: x,
			y: y
		},
		mass: 0.0017,
		friction: 0,
		restitution: 1
	});
}

function addNote(e) {
	var note = createNote(worldWidth / 2, worldHeight - 300, e);
	note.angle = Math.random() * 0.5 - 0.25;
	note.force.y -= 0.00015;

	displayNote(note);
}

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