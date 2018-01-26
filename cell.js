class Cell {
	constructor(x, y, cellSize_) {
		this.x = x;
		this.y = y;
		this.index = index(x, y);
		this.cellSize = cellSize_;
		this.isVisited = false;
		this.walls = { 'top'    : true,
					   'right'  : true,
					   'bottom' : true,
					   'left'   : true };
        this.color = color(0, 100);
		this.isHighlighting = false;
		this.radius = 0;
		this.radiusOffset = 0;
	}



}

Cell.prototype.display = function() {
	stroke(255);
	let x = this.x * this.cellSize + margin + padding;
	let y = this.y * this.cellSize + margin + padding;

	for(key in this.walls) {
		if(this.walls[key] === true) {
			this.drawLine(key);
		}
	}
	if(this.isVisited === true) {
	    noStroke();
	    fill(this.color, 100);
	    rect(x, y, this.cellSize, this.cellSize);
    }
	if(this.isHighlighting) {
		this.highlighting();
	}
}

Cell.prototype.drawLine = function(position) {
	let x = this.x * this.cellSize + margin + padding;
	let y = this.y * this.cellSize + margin + padding;

	strokeWeight(4);
	switch(position) {
		case 'top' :
			line(x, y, x+this.cellSize, y);
			break;
		case 'right' :
			line(x+this.cellSize, y, x+this.cellSize, y+this.cellSize);
			break;
		case 'bottom' :
			line(x+this.cellSize, y+this.cellSize, x, y+this.cellSize);
			break;
		case 'left' :
			line(x, y+this.cellSize, x, y);
			break;
		default :
			break;
	}
}

Cell.prototype.getNeighbourIndex = function() {
	let neighbours = [];
	let topNeighbour = grid[index(this.x, this.y-1)];
	let rightNeighbour = grid[index(this.x+1, this.y)];
	let bottomNeighbour = grid[index(this.x, this.y+1)];
	let leftNeighbour = grid[index(this.x-1, this.y)];

	if(topNeighbour && !topNeighbour.isVisited) {
		neighbours.push([topNeighbour.x, topNeighbour.y])
	}
	if(rightNeighbour && !rightNeighbour.isVisited) {
		neighbours.push([rightNeighbour.x, rightNeighbour.y])
	}
	if(bottomNeighbour && !bottomNeighbour.isVisited) {
		neighbours.push([bottomNeighbour.x, bottomNeighbour.y])
	}
	if(leftNeighbour && !leftNeighbour.isVisited) {
		neighbours.push([leftNeighbour.x, leftNeighbour.y])
	}

	if(neighbours.length > 0) {
		let neighbour = random(neighbours);
		return neighbour
	} else {
		return undefined;
	}
}

Cell.prototype.removeWall = function(target){
	for(key in this.walls) {
		if(key === target) {
			this.walls[key] = false;
		}
	}
}

Cell.prototype.highlight = function() {
	this.isHighlighting = true;
	this.radius = cellSize * 1.7;
	this.radiusOffset = this.radius / 5;
}

Cell.prototype.highlighting = function() {
	let x, y;
	[x, y] = getPostionFromIndex(this.x, this.y);
	if(this.radius > 0) {
		noStroke();
		fill(r, g, b, 100);
	    ellipseMode(CENTER);
		ellipse(x + (cellSize/2), y + (cellSize/2), this.radius);
		this.radius -= this.radiusOffset;
	} else {
		isHighlighting = false;
	}
}
