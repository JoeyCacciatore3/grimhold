// Grimhold - Pathfinding System
import { distance, manhattanDistance } from '../utils/math.js';

/**
 * A* pathfinding algorithm for tile-based grid navigation
 * Finds optimal paths while avoiding obstacles and terrain
 */
export class Pathfinder {
    constructor(grid) {
        this.grid = grid;
    }

    /**
     * Find path from start to goal using A* algorithm
     * @param {number} startX - Start tile X coordinate
     * @param {number} startY - Start tile Y coordinate
     * @param {number} goalX - Goal tile X coordinate
     * @param {number} goalY - Goal tile Y coordinate
     * @param {Object} options - Pathfinding options
     * @returns {Array|null} Array of {x, y} coordinates or null if no path
     */
    findPath(startX, startY, goalX, goalY, options = {}) {
        // Validate coordinates
        if (!this.grid.isValidTile(startX, startY) || 
            !this.grid.isValidTile(goalX, goalY)) {
            return null;
        }

        // If start equals goal, return single point
        if (startX === goalX && startY === goalY) {
            return [{ x: startX, y: startY }];
        }

        // A* algorithm implementation
        const openSet = new Map();
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        const startKey = this.coordsToKey(startX, startY);
        const goalKey = this.coordsToKey(goalX, goalY);

        // Initialize start node
        openSet.set(startKey, { x: startX, y: startY });
        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(startX, startY, goalX, goalY));

        while (openSet.size > 0) {
            // Find node in openSet with lowest fScore
            let current = null;
            let currentKey = null;
            let lowestF = Infinity;

            for (const [key, node] of openSet) {
                const f = fScore.get(key) || Infinity;
                if (f < lowestF) {
                    lowestF = f;
                    current = node;
                    currentKey = key;
                }
            }

            // Move current from open to closed
            openSet.delete(currentKey);
            closedSet.add(currentKey);

            // Check if we reached the goal
            if (currentKey === goalKey) {
                return this.reconstructPath(cameFrom, currentKey);
            }

            // Check all neighbors
            const neighbors = this.getValidNeighbors(current.x, current.y, options);
            
            for (const neighbor of neighbors) {
                const neighborKey = this.coordsToKey(neighbor.x, neighbor.y);

                // Skip if already evaluated
                if (closedSet.has(neighborKey)) {
                    continue;
                }

                // Calculate tentative gScore
                const tentativeG = (gScore.get(currentKey) || Infinity) + 
                                 this.getMovementCost(current.x, current.y, neighbor.x, neighbor.y, options);

                // Add to openSet if not already there
                if (!openSet.has(neighborKey)) {
                    openSet.set(neighborKey, neighbor);
                }

                // Skip if this path is not better
                if (tentativeG >= (gScore.get(neighborKey) || Infinity)) {
                    continue;
                }

                // This path is the best so far
                cameFrom.set(neighborKey, currentKey);
                gScore.set(neighborKey, tentativeG);
                fScore.set(neighborKey, tentativeG + this.heuristic(neighbor.x, neighbor.y, goalX, goalY));
            }
        }

        // No path found
        return null;
    }

    /**
     * Get valid neighboring tiles for pathfinding
     * @param {number} x - Current X coordinate
     * @param {number} y - Current Y coordinate
     * @param {Object} options - Pathfinding options
     * @returns {Array} Array of valid neighbor coordinates
     */
    getValidNeighbors(x, y, options = {}) {
        const neighbors = [];
        const allowDiagonal = options.allowDiagonal !== false; // Default true
        const canFly = options.canFly === true; // Default false

        // 4-directional movement
        const directions = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];

        // Add diagonal directions if allowed
        if (allowDiagonal) {
            directions.push(
                { dx: -1, dy: -1 }, // Northwest
                { dx: 1, dy: -1 },  // Northeast
                { dx: -1, dy: 1 },  // Southwest
                { dx: 1, dy: 1 }    // Southeast
            );
        }

        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;

            if (this.isPassable(nx, ny, canFly)) {
                // For diagonal movement, check corner cutting
                if (allowDiagonal && dir.dx !== 0 && dir.dy !== 0) {
                    // Prevent cutting corners through walls
                    const horizontal = this.isPassable(x + dir.dx, y, canFly);
                    const vertical = this.isPassable(x, y + dir.dy, canFly);
                    
                    if (horizontal && vertical) {
                        neighbors.push({ x: nx, y: ny });
                    }
                } else {
                    neighbors.push({ x: nx, y: ny });
                }
            }
        }

        return neighbors;
    }

    /**
     * Check if a tile is passable for movement
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     * @param {boolean} canFly - Whether unit can fly over obstacles
     * @returns {boolean} True if tile is passable
     */
    isPassable(x, y, canFly = false) {
        if (!this.grid.isValidTile(x, y)) {
            return false;
        }

        if (canFly) {
            // Flying units can pass over most terrain except mountains
            const tile = this.grid.getTile(x, y);
            return tile && tile.terrain !== 5; // TERRAIN.MOUNTAIN
        } else {
            // Ground units use normal blocking rules
            return !this.grid.isBlocked(x, y);
        }
    }

    /**
     * Calculate movement cost between adjacent tiles
     * @param {number} fromX - Source X coordinate
     * @param {number} fromY - Source Y coordinate  
     * @param {number} toX - Destination X coordinate
     * @param {number} toY - Destination Y coordinate
     * @param {Object} options - Movement options
     * @returns {number} Movement cost (higher = harder to traverse)
     */
    getMovementCost(fromX, fromY, toX, toY, options = {}) {
        const tile = this.grid.getTile(toX, toY);
        if (!tile) return Infinity;

        let cost = 1.0;

        // Diagonal movement costs more
        if (Math.abs(toX - fromX) + Math.abs(toY - fromY) > 1) {
            cost *= 1.414; // √2
        }

        // Terrain-based costs
        switch (tile.terrain) {
            case 0: // TERRAIN.GRASS
                cost *= 1.0;
                break;
            case 1: // TERRAIN.WATER
                cost *= 3.0; // Slow to wade through
                break;
            case 2: // TERRAIN.STONE  
                cost *= 1.2; // Slightly harder
                break;
            case 3: // TERRAIN.DIRT
                cost *= 0.8; // Preferred path
                break;
            case 4: // TERRAIN.FOREST
                cost *= 2.0; // Dense vegetation
                break;
            case 5: // TERRAIN.MOUNTAIN
                return Infinity; // Impassable
        }

        // Apply unit type modifiers
        if (options.unitType) {
            switch (options.unitType) {
                case 'fast':
                    cost *= 0.8; // Fast units prefer any terrain
                    break;
                case 'heavy':
                    if (tile.terrain === 1) cost *= 2.0; // Heavy units hate water even more
                    break;
                case 'scout':
                    if (tile.terrain === 4) cost *= 0.5; // Scouts move well in forest
                    break;
            }
        }

        return cost;
    }

    /**
     * Heuristic function for A* (estimated distance to goal)
     * @param {number} x - Current X coordinate
     * @param {number} y - Current Y coordinate
     * @param {number} goalX - Goal X coordinate
     * @param {number} goalY - Goal Y coordinate
     * @returns {number} Estimated cost to reach goal
     */
    heuristic(x, y, goalX, goalY) {
        // Manhattan distance with diagonal shortcuts
        const dx = Math.abs(goalX - x);
        const dy = Math.abs(goalY - y);
        
        // Use Octile distance (allows diagonal movement)
        return Math.max(dx, dy) + (Math.sqrt(2) - 1) * Math.min(dx, dy);
    }

    /**
     * Reconstruct path from A* search result
     * @param {Map} cameFrom - Map of parent nodes
     * @param {string} currentKey - Goal node key
     * @returns {Array} Array of {x, y} coordinates
     */
    reconstructPath(cameFrom, currentKey) {
        const path = [];
        let current = currentKey;

        while (current) {
            const coords = this.keyToCoords(current);
            path.unshift(coords); // Add to beginning
            current = cameFrom.get(current);
        }

        return path;
    }

    /**
     * Convert coordinates to map key
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {string} Map key
     */
    coordsToKey(x, y) {
        return `${x},${y}`;
    }

    /**
     * Convert map key back to coordinates
     * @param {string} key - Map key
     * @returns {Object} Coordinates {x, y}
     */
    keyToCoords(key) {
        const [x, y] = key.split(',').map(Number);
        return { x, y };
    }

    /**
     * Find all tiles within range of a position
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} range - Range in tiles
     * @param {Object} options - Search options
     * @returns {Array} Array of {x, y, distance} objects
     */
    getReachableTiles(centerX, centerY, range, options = {}) {
        const reachable = [];
        const visited = new Set();
        const queue = [{ x: centerX, y: centerY, dist: 0 }];

        while (queue.length > 0) {
            const current = queue.shift();
            const key = this.coordsToKey(current.x, current.y);

            if (visited.has(key) || current.dist > range) {
                continue;
            }

            visited.add(key);
            reachable.push({
                x: current.x,
                y: current.y,
                distance: current.dist
            });

            // Add neighbors
            const neighbors = this.getValidNeighbors(current.x, current.y, options);
            for (const neighbor of neighbors) {
                const neighborKey = this.coordsToKey(neighbor.x, neighbor.y);
                if (!visited.has(neighborKey)) {
                    const moveCost = this.getMovementCost(current.x, current.y, neighbor.x, neighbor.y, options);
                    queue.push({
                        x: neighbor.x,
                        y: neighbor.y,
                        dist: current.dist + moveCost
                    });
                }
            }

            // Sort queue by distance (simple breadth-first)
            queue.sort((a, b) => a.dist - b.dist);
        }

        return reachable;
    }

    /**
     * Check if there's a clear line of sight between two points
     * @param {number} x1 - Start X coordinate
     * @param {number} y1 - Start Y coordinate
     * @param {number} x2 - End X coordinate
     * @param {number} y2 - End Y coordinate
     * @param {Object} options - Line of sight options
     * @returns {boolean} True if line of sight is clear
     */
    hasLineOfSight(x1, y1, x2, y2, options = {}) {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        
        let x = x1;
        let y = y1;

        while (true) {
            // Check current tile
            if (!this.isPassable(x, y, options.canFly)) {
                // Exception: starting and ending tiles are always valid
                if (!((x === x1 && y === y1) || (x === x2 && y === y2))) {
                    return false;
                }
            }

            // Reached destination
            if (x === x2 && y === y2) {
                break;
            }

            // Bresenham line algorithm
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }

        return true;
    }
}