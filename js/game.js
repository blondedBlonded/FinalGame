/**
 * Main Game Logic
 */

class Game {
    constructor() {
        // Initialize canvas
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        
        // Create isometric grid
        this.grid = new IsometricGrid(this.canvas);
        
        // Create character (start at position 5,5)
        this.character = new Character(this.grid, 5, 5);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // Set up event listeners for user interaction
    setupEventListeners() {
        // Mouse move for tile highlighting
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Update highlighted tile
            this.grid.handleMouseMove(mouseX, mouseY);
        });
        
        // Mouse click for character movement
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Handle character movement
            this.character.handleClick(mouseX, mouseY);
        });
    }
    
    // Main game loop
    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Update game state
        this.update(deltaTime);
        
        // Render game
        this.render();
        
        // Request next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // Update game state
    update(deltaTime) {
        // Update character movement
        this.character.move();
    }
    
    // Render game
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.grid.draw();
        
        // Draw character
        this.character.draw(this.ctx);
    }
}

// Initialize game when page loads
window.onload = () => {
    const game = new Game();
};