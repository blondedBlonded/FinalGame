/**
 * Pathfinding System using A* algorithm
 */

class Pathfinder {
    constructor(grid) {
        this.grid = grid;
    }

    // Find path using A* algorithm
    findPath(startX, startY, endX, endY) {
        // Check if start or end is not walkable
        if (!this.grid.isTileWalkable(startX, startY) || !this.grid.isTileWalkable(endX, endY)) {
            return [];
        }

        // If start and end are the same, return empty path
        if (startX === endX && startY === endY) {
            return [];
        }

        const startTile = this.grid.grid[startY][startX];
        const endTile = this.grid.grid[endY][endX];

        // Lists for open and closed nodes
        const openList = [];
        const closedList = [];

        // Add start node to open list
        openList.push({
            tile: startTile,
            parent: null,
            g: 0, // Cost from start to current node
            h: this.heuristic(startTile, endTile), // Estimated cost from current to end
            f: this.heuristic(startTile, endTile) // Total cost (g + h)
        });

        // Main loop
        while (openList.length > 0) {
            // Sort open list by f value (lowest first)
            openList.sort((a, b) => a.f - b.f);

            // Get current node (lowest f value)
            const current = openList.shift();

            // Add current to closed list
            closedList.push(current);

            // If we reached the end, reconstruct and return the path
            if (current.tile.x === endTile.x && current.tile.y === endTile.y) {
                return this.reconstructPath(current);
            }

            // Get neighbors
            const neighbors = this.grid.getNeighbors(current.tile);

            for (const neighbor of neighbors) {
                // Skip if neighbor is in closed list
                if (closedList.some(node => node.tile.x === neighbor.x && node.tile.y === neighbor.y)) {
                    continue;
                }

                // Calculate g score for this neighbor
                // Use diagonal distance for more accurate movement cost
                const isDiagonal = current.tile.x !== neighbor.x && current.tile.y !== neighbor.y;
                const movementCost = isDiagonal ? 1.4 : 1; // √2 ≈ 1.4 for diagonal movement
                const gScore = current.g + movementCost;

                // Check if neighbor is in open list
                const openNode = openList.find(node => node.tile.x === neighbor.x && node.tile.y === neighbor.y);

                if (!openNode) {
                    // Not in open list, add it
                    openList.push({
                        tile: neighbor,
                        parent: current,
                        g: gScore,
                        h: this.heuristic(neighbor, endTile),
                        f: gScore + this.heuristic(neighbor, endTile)
                    });
                } else if (gScore < openNode.g) {
                    // Already in open list but this path is better
                    openNode.g = gScore;
                    openNode.f = gScore + openNode.h;
                    openNode.parent = current;
                }
            }
        }

        // No path found
        return [];
    }

    // Heuristic function (Manhattan distance)
    heuristic(tileA, tileB) {
        // Using Manhattan distance for grid movement
        return Math.abs(tileA.x - tileB.x) + Math.abs(tileA.y - tileB.y);
    }

    // Reconstruct path from end to start
    reconstructPath(endNode) {
        const path = [];
        let current = endNode;

        // Traverse from end to start following parent pointers
        while (current.parent) {
            path.unshift(current.tile); // Add to front of array
            current = current.parent;
        }

        return path;
    }
}