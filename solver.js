class Solver {
    constructor() {
        this.current = grid[index(0, 0)];
        this.currectCells = [this.current];
        this.invalidCells = [];
        this.isSolved = false;
        this.count = 50;
    }

    display() {
        beginShape();
        noFill();
        strokeWeight(cellSize*0.7);
        stroke(0);
        for (let cell of this.currectCells) {
            let x, y;
            [x, y] = getPostionFromIndex(cell.x, cell.y);
            vertex(x + (cell.cellSize/2), y + (cell.cellSize/2));
        }
        endShape();
    }

    solve() {
        while(!this.isSolved) {
            // find neighbours
            let neighbours = this.getNeighbours();
            let neighbourToGo = undefined;
            // if neighbour is not in the stack
            for (let neighbour of neighbours) {

                if (!(this.currectCells.includes(neighbour)) &&
                    !this.isBlockedTo(neighbour) &&
                    !this.invalidCells.includes(neighbour)) {
                    // if neighbour is not in stack and
                    // there is no wall toward neighbour and
                    // finally we've never visited neighbour before
                    // we are going to this neighbour
                    neighbourToGo = neighbour;
                }
            }
            if(neighbourToGo) {
                // if neighbour which is about to go exist stack it
                this.currectCells.push(neighbourToGo);
            } else {
                // else pop current cell and mark it invalid
                this.invalidCells.push(this.currectCells.pop());
            }
            // grab current cell upon stack
            this.current = this.currectCells[this.currectCells.length-1];
            // update while condition
            if (this.current === grid[grid.length-1]) {
                // if we arrived at the end of maze game end.
                this.isSolved = true;
            }

        }

    }

    getNeighbours() {
        let top = grid[index(this.current.x, this.current.y-1)];
    	let right = grid[index(this.current.x+1, this.current.y)];
    	let bottom = grid[index(this.current.x, this.current.y+1)];
    	let left = grid[index(this.current.x-1, this.current.y)];
        let neighbours = [top, right, bottom, left];
        neighbours = neighbours.filter(n => n); // get rid of undefined neighbours
        return neighbours
    }

    isBlockedTo(neighbour) {
        let indexOffset = index(this.current.x, this.current.y) - index(neighbour.x, neighbour.y);
        switch(indexOffset) {
            case -1:
                if(this.current.walls.right === true) {
                    return true;
                }
                break;
            case 1:
                if(this.current.walls.left === true) {
                    return true;
                }
                break;
            case -rows:
                if(this.current.walls.bottom === true) {
                    return true;
                }
                break;
            case rows:
                if(this.current.walls.top === true) {
                    return true;
                }
                break;
            default:
                break;
        }
        return false;
    }
}
