/**
 * Utility functions for isometric game
 */

// Global constants
const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32; // Half of the width for isometric view

const Utils = {
    // Convert isometric coordinates to screen coordinates
    isoToScreen: function(x, y) {
        return {
            x: (x - y) * (TILE_WIDTH / 2),
            y: (x + y) * (TILE_HEIGHT / 2)
        };
    },

    // Convert screen coordinates to isometric coordinates
    screenToIso: function(x, y) {
        // Adjust for canvas center and grid offset
        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        x = x - centerX;
        y = y - centerY;

        return {
            x: Math.floor((y / (TILE_HEIGHT / 2) + x / (TILE_WIDTH / 2)) / 2),
            y: Math.floor((y / (TILE_HEIGHT / 2) - x / (TILE_WIDTH / 2)) / 2)
        };
    },

    // Get direction based on movement from (x1,y1) to (x2,y2)
    getDirection: function(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Determine the primary direction based on the larger component
        if (Math.abs(dx) > Math.abs(dy)) {
            // East or West
            if (dx > 0) {
                if (dy > 0) return 'SE';
                else if (dy < 0) return 'NE';
                else return 'E';
            } else {
                if (dy > 0) return 'SW';
                else if (dy < 0) return 'NW';
                else return 'W';
            }
        } else {
            // North or South
            if (dy > 0) {
                if (dx > 0) return 'SE';
                else if (dx < 0) return 'SW';
                else return 'S';
            } else {
                if (dx > 0) return 'NE';
                else if (dx < 0) return 'NW';
                else return 'N';
            }
        }
    },

    // Calculate distance between two points
    distance: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    // Linear interpolation
    lerp: function(start, end, t) {
        return start * (1 - t) + end * t;
    }
};