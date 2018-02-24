var worldWidth = window.innerWidth;
var worldHeight = window.innerHeight;
var objLimit = 5000;
var bps = 30;
var beatsCounted = 0;

var notes = [];

// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Svg = Matter.Svg;

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

var bodies = [];

var vertexSets = [];

var note;

$.get('./svg/eighth_note.svg').done(function(data) {
	var vertexSets = [];

	$(data).find('path').each(function(i, path) {
		vertexSets.push(Svg.pathToVertices(path, 30));
	});

	note = Bodies.fromVertices(400, 350, vertexSets, {
		render: {
			fillStyle: '#2e2b44',
			strokeStyle: '#2e2b44',
			lineWidth: 1,
			mass: 0.002
		}
	}, true);

	World.add(engine.world, note);
});

path = document.getElementById('eighth');
console.log(path);

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

	notes.push(key);

/**
	var x_pos = 200 + pos * (worldWidth - 400) / 9;
	var y_pos = worldHeight - 50;

	var note = createNote(x_pos, y_pos, key);
	displayNote(note);
**/
}

function removeNote(e) {
	var str = "qwertyuiop";
	var key = e.originalEvent.key;
	var pos = str.indexOf(key);

	if (pos == -1) {
		return;
	}

	var index = notes.indexOf(key);
	if (index > - 1) {
		notes.splice(index, 1);
	}
}

// pushes note into display queue
function displayNote(note) {
	bodies.push(note);
	World.add(engine.world, bodies[bodies.length - 1]);

	if (bodies.length > objLimit) {
		World.remove(engine.world, bodies[0]);
		bodies = bodies.slice(1);
	}
}

// function triggered each beat count, called by countBeat
// draws objects
function drawNote(note) {
	var str = "qwertyuiop";
	var key = note;
	var pos = str.indexOf(key);

	var x_pos = 200 + pos * (worldWidth - 400) / 9;
	var y_pos = worldHeight - 50;

	var note = createNote(x_pos, y_pos, key);

	bodies.push(note);
	World.add(engine.world, bodies[bodies.length - 1]);

	if (bodies.length > objLimit) {
		World.remove(engine.world, bodies[0]);
		bodies = bodies.slice(1);
	}
}

// function triggered each beat count
function countBeat(notes) {
	var length = notes.length;

	for (i = 0; i < length; i++) {
		var note = notes[i];

		// draws each note
		drawNote(note);
		// plays each note

	}
}

// keydown handler
$(document).keydown(function(e) {
	if (!(e.handled)) {
		isRepeat = e.originalEvent.repeat;
		if (!isRepeat) {
			addNote(e);
			e.handled = true;
		}
	}
});

// keyup handler
$(document).keyup(function(e) {
	if (!(e.handled)) {
		removeNote(e);
		e.handled = true;
	}
});

// calls countBeat repeatedly
(function renderNotes(){
	beatsCounted++;
	countBeat(notes);

	setTimeout(arguments.callee, 1000 / bps);
})();