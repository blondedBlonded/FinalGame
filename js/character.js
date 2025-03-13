/**
 * Character System for Isometric Game
 */

class Character {
    constructor(grid, x, y) {
        this.grid = grid;
        this.x = x; // Grid position X
        this.y = y; // Grid position Y
        this.screenX = 0; // Screen position X
        this.screenY = 0; // Screen position Y
        this.targetX = x; // Target grid position X
        this.targetY = y; // Target grid position Y
        this.moving = false;
        this.direction = 'S'; // Default direction
        this.speed = 2; // Movement speed
        this.path = []; // Path to follow
        this.currentTile = 0; // Current tile in path
        
        // Animation properties
        this.animations = {
            idle: null,
            walk: null
        };
        this.currentFrame = 0;
        this.frameCount = {
            idle: 12,
            walk: 8
        };
        this.lastFrameUpdate = 0;
        this.frameDuration = 100; // milliseconds per frame
        
        // Load all animations
        this.loadAnimations();
        
        // Update screen position
        this.updateScreenPosition();
    }
    
    // Load all character animations
    loadAnimations() {
        // Load sprite sheets
        this.animations.idle = new Image();
        this.animations.idle.src = 'idle full sprite sheet.png';
        
        this.animations.walk = new Image();
        this.animations.walk.src = 'walk complete sprite sheet.png';
    }
    
    // Update character's screen position based on grid position
    updateScreenPosition() {
        const screenPos = Utils.isoToScreen(this.x, this.y);
        
        // Center in the canvas
        const centerX = this.grid.canvas.width / 2;
        const centerY = this.grid.canvas.height / 2;
        
        this.screenX = centerX + screenPos.x;
        this.screenY = centerY + screenPos.y - TILE_HEIGHT / 2; // Add vertical offset to align with tile
    }
    
    // Set a new path for the character to follow
    setPath(path) {
        if (path.length === 0) return;
        
        this.path = path;
        this.currentTile = 0;
        this.moving = true;
        
        // Set initial target to first tile in path
        this.targetX = this.path[0].x;
        this.targetY = this.path[0].y;
        
        // Update direction based on movement
        this.updateDirection();
    }
    
    // Update character direction based on movement
    updateDirection() {
        if (this.moving && this.path.length > 0) {
            // Get the difference between current and target positions
            const dx = Math.round(this.targetX - this.x);
            const dy = Math.round(this.targetY - this.y);
            
            // Determine direction based on the specific movement pattern
            // Using the logic provided: starting from position (4,6)
            if (dx === -1 && dy === -1) this.direction = 'N';      // Moving to (3,5)
            else if (dx === 1 && dy === 1) this.direction = 'S';   // Moving to (5,7)
            else if (dx === 1 && dy === -1) this.direction = 'E';  // Moving to (5,5)
            else if (dx === -1 && dy === 1) this.direction = 'W';  // Moving to (3,7)
            else if (dx === 0 && dy === -1) this.direction = 'NE'; // Moving to (4,5)
            else if (dx === -1 && dy === 0) this.direction = 'NW'; // Moving to (3,6)
            else if (dx === 1 && dy === 0) this.direction = 'SE';  // Moving to (5,6)
            else if (dx === 0 && dy === 1) this.direction = 'SW';  // Moving to (4,7)
            else {
                // Fallback to the original direction calculation for other cases
                this.direction = Utils.getDirection(
                    this.x, this.y, 
                    this.targetX, this.targetY
                );
            }
            
            // Update current animation based on state and direction
            this.currentAnimation = this.moving ? 
                this.animations.walk[this.direction] : 
                this.animations.idle[this.direction];
        }
    }
    
    // Move character towards target position
    move() {
        if (!this.moving) return;
        
        // Calculate distance to target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Utils.distance(this.x, this.y, this.targetX, this.targetY);
        
        // If we're close enough to the target, snap to it and get next target
        if (distance < 0.1) {
            this.x = this.targetX;
            this.y = this.targetY;
            
            // Move to next tile in path
            this.currentTile++;
            
            // If we've reached the end of the path, stop moving
            if (this.currentTile >= this.path.length) {
                this.moving = false;
                // Switch to idle animation
                this.currentAnimation = this.animations.idle[this.direction];
                return;
            }
            
            // Set new target
            this.targetX = this.path[this.currentTile].x;
            this.targetY = this.path[this.currentTile].y;
            
            // Update direction for new target
            this.updateDirection();
        } else {
            // Move towards target
            const moveSpeed = this.speed * (1/60); // Adjust for frame rate
            const moveRatio = moveSpeed / distance;
            
            // Ensure we don't overshoot
            const moveX = dx * Math.min(moveRatio, 1);
            const moveY = dy * Math.min(moveRatio, 1);
            
            this.x += moveX;
            this.y += moveY;
        }
        
        // Update screen position
        this.updateScreenPosition();
    }
    
    // Draw character on canvas
    draw(ctx) {
        const charWidth = 128;
        const charHeight = 128;
        
        // Update animation frame
        const now = Date.now();
        if (now - this.lastFrameUpdate > this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % (this.moving ? this.frameCount.walk : this.frameCount.idle);
            this.lastFrameUpdate = now;
        }
        
        // Get current animation state and sprite sheet
        const state = this.moving ? 'walk' : 'idle';
        const spriteSheet = this.animations[state];
        
        if (spriteSheet && spriteSheet.complete) {
            // Update directions array to match sprite sheet row order
            const directions = ['NW', 'W', 'SW', 'S', 'SE', 'E', 'NE', 'N'];
            const directionIndex = directions.indexOf(this.direction);
            
            const frameWidth = spriteSheet.width / (state === 'idle' ? 12 : 8);
            const frameHeight = spriteSheet.height / 8;
            
            const sourceX = this.currentFrame * frameWidth;
            const sourceY = directionIndex * frameHeight;
            
            // Draw the current frame
            ctx.drawImage(
                spriteSheet,
                sourceX,
                sourceY,
                frameWidth,
                frameHeight,
                this.screenX - charWidth / 2,
                this.screenY - charHeight / 2,
                charWidth,
                charHeight
            );
        }
    }
    
    // Handle click to move character
    handleClick(x, y) {
        // Convert screen coordinates to isometric coordinates
        const isoPos = Utils.screenToIso(x, y);
        
        // Check if the clicked position is valid
        if (isoPos.x >= 0 && isoPos.x < GRID_SIZE && 
            isoPos.y >= 0 && isoPos.y < GRID_SIZE && 
            this.grid.isTileWalkable(isoPos.x, isoPos.y)) {
            
            // Create pathfinder
            const pathfinder = new Pathfinder(this.grid);
            
            // Find path to clicked position
            const path = pathfinder.findPath(
                Math.floor(this.x), Math.floor(this.y),
                isoPos.x, isoPos.y
            );
            
            // Set the path for the character to follow
            this.setPath(path);
            
            return true;
        }
        
        return false;
    }
}