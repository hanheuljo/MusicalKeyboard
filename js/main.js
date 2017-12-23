var worldWidth = document.documentElement.clientWidth
var worldHeight = document.documentElement.clientHeight

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

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var boxC = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(worldWidth / 2, worldHeight - 20, worldWidth - 250, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

function addNote() {
	World.add(engine.world, [boxC]);
}
