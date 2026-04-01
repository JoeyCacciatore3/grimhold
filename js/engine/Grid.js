// Grimhold - Grid System
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, TERRAIN } from '../utils/constants.js';

/**
 * Grid system for tile-based game world
 * Handles coordinate conversion, tile data, and spatial queries
 */
export class Grid {
    constructor(width = MAP_WIDTH, height = MAP_HEIGHT) {
        this.width = width;
        this.height = height;
        this.tileSize = TILE_SIZE;
        
        // 2D array to store tile data
        // Each tile has: { terrain: TERRAIN.type, building: BUILDINGS.type }
        this.tiles = this.createEmptyGrid();
        
        // Camera offset for rendering
        this.cameraX = 0;
        this.cameraY = 0;
    }

    /**
     * Create empty grid filled with grass
     * @returns {Array} 2D array of tile objects
     */
    createEmptyGrid() {
        const grid = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push({
                    terrain: TERRAIN.GRASS,
                    building: null,
                    x: x,
                    y: y
                });
            }
            grid.push(row);
        }
        return grid;
    }

    /**
     * Convert world pixel coordinates to grid coordinates
     * @param {number} worldX - World X coordinate in pixels
     * @param {number} worldY - World Y coordinate in pixels
     * @returns {Object} Grid coordinates {x, y} or null if outside grid
     */
    worldToGrid(worldX, worldY) {
        const gridX = Math.floor((worldX + this.cameraX) / this.tileSize);
        const gridY = Math.floor((worldY + this.cameraY) / this.tileSize);
        
        if (this.isValidTile(gridX, gridY)) {
            return { x: gridX, y: gridY };
        }
        return null;
    }

    /**
     * Convert grid coordinates to world pixel coordinates
     * @param {number} gridX - Grid X coordinate
     * @param {number} gridY - Grid Y coordinate
     * @returns {Object} World coordinates {x, y}
     */
    gridToWorld(gridX, gridY) {
        return {
            x: gridX * this.tileSize - this.cameraX,
            y: gridY * this.tileSize - this.cameraY
        };
    }

    /**
     * Check if grid coordinates are within valid bounds
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {boolean} True if coordinates are valid
     */
    isValidTile(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /**
     * Get tile data at grid coordinates
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {Object|null} Tile object or null if invalid coordinates
     */
    getTile(x, y) {
        if (this.isValidTile(x, y)) {
            return this.tiles[y][x];
        }
        return null;
    }

    /**
     * Set tile terrain type
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @param {number} terrainType - TERRAIN constant
     */
    setTerrain(x, y, terrainType) {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.terrain = terrainType;
        }
    }

    /**
     * Set building on tile
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @param {Object} building - Building object or null to remove
     */
    setBuilding(x, y, building) {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.building = building;
        }
    }

    /**
     * Check if a tile can have buildings placed on it
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {boolean} True if tile is buildable
     */
    isBuildable(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return false;
        
        // Water and mountains are not buildable
        if (tile.terrain === TERRAIN.WATER || tile.terrain === TERRAIN.MOUNTAIN) {
            return false;
        }
        
        // Tile must not already have a building
        return tile.building === null;
    }

    /**
     * Check if a tile blocks movement (for pathfinding)
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {boolean} True if tile blocks movement
     */
    isBlocked(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return true; // Out of bounds is blocked
        
        // Water and mountains block movement
        if (tile.terrain === TERRAIN.WATER || tile.terrain === TERRAIN.MOUNTAIN) {
            return true;
        }
        
        // Buildings block movement (except special cases later)
        return tile.building !== null;
    }

    /**
     * Get all neighboring tiles (4-directional)
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {Array} Array of neighbor tile objects with coordinates
     */
    getNeighbors(x, y) {
        const neighbors = [];
        const directions = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];
        
        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            const tile = this.getTile(nx, ny);
            if (tile) {
                neighbors.push({ tile, x: nx, y: ny });
            }
        }
        
        return neighbors;
    }

    /**
     * Get all neighboring tiles (8-directional, including diagonals)
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {Array} Array of neighbor tile objects with coordinates
     */
    getNeighbors8(x, y) {
        const neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Skip center tile
                
                const nx = x + dx;
                const ny = y + dy;
                const tile = this.getTile(nx, ny);
                if (tile) {
                    neighbors.push({ tile, x: nx, y: ny });
                }
            }
        }
        return neighbors;
    }

    /**
     * Move camera by offset
     * @param {number} deltaX - X offset in pixels
     * @param {number} deltaY - Y offset in pixels
     */
    moveCamera(deltaX, deltaY) {
        this.cameraX += deltaX;
        this.cameraY += deltaY;
        
        // Clamp camera to valid bounds
        const maxX = (this.width * this.tileSize) - window.innerWidth;
        const maxY = (this.height * this.tileSize) - window.innerHeight;
        
        this.cameraX = Math.max(0, Math.min(this.cameraX, maxX));
        this.cameraY = Math.max(0, Math.min(this.cameraY, maxY));
    }

    /**
     * Set camera position directly
     * @param {number} x - Camera X position in pixels
     * @param {number} y - Camera Y position in pixels
     */
    setCameraPosition(x, y) {
        this.cameraX = x;
        this.cameraY = y;
    }

    /**
     * Get current camera position
     * @returns {Object} Camera position {x, y}
     */
    getCameraPosition() {
        return { x: this.cameraX, y: this.cameraY };
    }
}