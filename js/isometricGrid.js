/**
 * Isometric Grid System
 */

// Constants for grid size
const GRID_SIZE = 10; // 10x10 grid

class IsometricGrid {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = [];
        this.highlightedTile = null;
        
        // Initialize grid with walkable tiles
        this.initializeGrid();
    }

    initializeGrid() {
        // Create a grid of tiles
        for (let y = 0; y < GRID_SIZE; y++) {
            this.grid[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                // By default, all tiles are walkable
                this.grid[y][x] = {
                    x: x,
                    y: y,
                    walkable: true,
                    object: null // No object on this tile by default
                };
            }
        }

        // Add some non-walkable tiles as obstacles (example)
        this.grid[2][3].walkable = false;
        this.grid[3][3].walkable = false;
        this.grid[4][3].walkable = false;
        this.grid[5][6].walkable = false;
        this.grid[6][6].walkable = false;
    }

    // Draw the isometric grid
    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw each tile
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                this.drawTile(x, y);
            }
        }
    }

    // Draw a single tile
    drawTile(x, y) {
        const tile = this.grid[y][x];
        const screenPos = Utils.isoToScreen(x, y);
        
        // Adjust for canvas center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Calculate the four corners of the isometric tile
        const topX = centerX + screenPos.x;
        const topY = centerY + screenPos.y - TILE_HEIGHT / 2;
        const rightX = centerX + screenPos.x + TILE_WIDTH / 2;
        const rightY = centerY + screenPos.y;
        const bottomX = centerX + screenPos.x;
        const bottomY = centerY + screenPos.y + TILE_HEIGHT / 2;
        const leftX = centerX + screenPos.x - TILE_WIDTH / 2;
        const leftY = centerY + screenPos.y;

        // Begin drawing the tile
        this.ctx.beginPath();
        this.ctx.moveTo(topX, topY);
        this.ctx.lineTo(rightX, rightY);
        this.ctx.lineTo(bottomX, bottomY);
        this.ctx.lineTo(leftX, leftY);
        this.ctx.closePath();

        // Fill the tile based on its properties
        if (this.highlightedTile && this.highlightedTile.x === x && this.highlightedTile.y === y) {
            // Highlighted tile
            this.ctx.fillStyle = tile.walkable ? '#5F5F41' : '#5F5F41';
        } else {
            // Normal tile
            this.ctx.fillStyle = tile.walkable ? '#222222' : '#222222';
        }
        
        this.ctx.fill();
        
        // Draw tile border with more visible stroke
        this.ctx.strokeStyle = '#444444';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // Handle mouse movement to highlight tiles
    handleMouseMove(mouseX, mouseY) {
        // Convert screen coordinates to isometric coordinates
        const isoPos = Utils.screenToIso(mouseX, mouseY);
        
        // Check if the coordinates are within the grid bounds
        if (isoPos.x >= 0 && isoPos.x < GRID_SIZE && isoPos.y >= 0 && isoPos.y < GRID_SIZE) {
            this.highlightedTile = { x: isoPos.x, y: isoPos.y };
        } else {
            this.highlightedTile = null;
        }
    }

    // Check if a tile is walkable
    isTileWalkable(x, y) {
        // Check if coordinates are within grid bounds
        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
            return false;
        }
        return this.grid[y][x].walkable;
    }

    // Get neighbors for pathfinding
    getNeighbors(tile) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, // North
            { x: 1, y: -1 }, // Northeast
            { x: 1, y: 0 },  // East
            { x: 1, y: 1 },  // Southeast
            { x: 0, y: 1 },  // South
            { x: -1, y: 1 }, // Southwest
            { x: -1, y: 0 }, // West
            { x: -1, y: -1 } // Northwest
        ];

        for (const dir of directions) {
            const newX = tile.x + dir.x;
            const newY = tile.y + dir.y;
            
            if (this.isTileWalkable(newX, newY)) {
                neighbors.push(this.grid[newY][newX]);
            }
        }

        return neighbors;
    }
}