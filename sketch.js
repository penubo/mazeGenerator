

var boardWidth = 400;
var boardHeight = 400;
var cols, rows;
var cellSize = 40;
var margin;
var padding;

var grid = [];
var stack = [];
var current;

var running;
var isComplete;

var r, g, b;
var offset = 0;
var frequency = 0.3;

var solver;

function setup() {
	createCanvas(600, 600);
	frameRate(10);

	initBoard();
	buttonInit();
}

function draw() {
	background(0);
	for(let cell of grid) {
		cell.display();
	}
	if(stack.length > 0 && running) {

		// Choose randomly one of the unvisited neighbours
		let neighbourIndex = current.getNeighbourIndex();

		// if neighbour exist
		if(neighbourIndex) {
			// remove walls between two cells
			let neighbour = grid[index(neighbourIndex[0], neighbourIndex[1])];
			removeWallBetweenCells(current, neighbour);
			// Push the neighbour to the stack
			neighbour.isVisited = true;
			stack.push(neighbour); // stack
		// if there is no neighbour which means stock
		} else if (neighbourIndex === undefined){
			// Pop a cell from the stack && Make it the current cell
			stack.pop();
		}
		current = stack[stack.length-1];
		if(current) {
			// drawing tarcker and visited cells
			changeRGBValue();
			current.color = color(r, g, b, 100);
			current.highlight();
		}
	} else if (stack.length === 0) {
		isComplete = true;
	}
	if(solver) {
		solver.display();
	}
}

function changeRGBValue() {
	r = Math.sin(frequency*offset + 0) * 127 + 128;
	g = Math.sin(frequency*offset + 2) * 127 + 128;
	b = Math.sin(frequency*offset + 4) * 127 + 128;
	offset++;
}

function index(x, y) {
	if(x < 0 || x >= cols || y < 0 || y >= rows) {
		return undefined;
	}
	return x + y * cols;
}

function initBoard() {
	isComplete = false;
	running = false;
	grid.length = 0;
	stack.length = 0;
	r = Math.sin(frequency*offset + 0) * 127 + 128;
	g = Math.sin(frequency*offset + 2) * 127 + 128;
	b = Math.sin(frequency*offset + 4) * 127 + 128;

	margin = (width - boardWidth) / 2
	padding = (boardWidth % cellSize) / 2


	cols = floor(boardWidth / cellSize);
	rows = floor(boardHeight / cellSize);

	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			grid.push(new Cell(i, j, cellSize));
		}
	}
	grid[0].removeWall('top');
	grid[grid.length-1].removeWall('bottom');
	current = grid[0];
	current.isVisited = true;
	current.color = color(r, g, b, 100);
	stack.push(current);
	
	solver = new Solver();
}

function buttonInit() {
	let activeButton = createButton('start');
	let resetButton = createButton('reset');
	let solutionButton = createButton('solution');

	let sliderP = createP('cellSize');
	let slider = createSlider(20, 50, cellSize, 2);

	let infoP = createP('number of cells : ' + rows*cols);


	buttons = selectAll('button');
	for(let button of buttons) {
		button.style('font-size', 'large');
		button.style('width', '100px');
	}
	activeButton.position(650, 100);
	resetButton.position(650, 150);
	solutionButton.position(650, 350);

	sliderP.style('font-size', 'large');
	sliderP.style('width', '150px');
	sliderP.style('background', 'pink');
	sliderP.style('text-align', 'center');

	sliderP.position(650, 190);
	slider.style('width', '150px');
	slider.position(650, 250);

	infoP.position(650, 300);

	activeButton.mousePressed(function() {
		running = running ? false : true;
		let label = running ? 'stop' : 'start';
		this.html(label);
	});

	resetButton.mousePressed(function() {
		initBoard();
		activeButton.html('start');
	});

	solutionButton.mousePressed(function() {
		if(isComplete) {
			solver.solve();
		} else {
			// createP('please make maze first');
		}
	});

	slider.changed(function() {
		cellSize = slider.value();
		initBoard();
		activeButton.html('start');
		infoP.html('number of cells : ' + rows*cols);
	});

}

function getPostionFromIndex(xIndex, yIndex) {
	let x = xIndex * cellSize + margin + padding;
	let y = yIndex * cellSize + margin + padding;
	return [x, y]
}

removeWallBetweenCells = function(cellA, cellB) {
	let indexOffset = cellA.index - cellB.index;
	if(indexOffset === -1) {
		cellA.removeWall('right');
		cellB.removeWall('left');
	}
	else if(indexOffset === 1) {
		cellA.removeWall('left');
		cellB.removeWall('right');
	}
	else if(indexOffset === -rows) {
		cellA.removeWall('bottom');
		cellB.removeWall('top');
	}
	else if(indexOffset === rows) {
		cellA.removeWall('top');
		cellB.removeWall('bottom');
	}
}
