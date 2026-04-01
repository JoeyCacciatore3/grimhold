// Grimhold - Map System
import { TERRAIN, MAP_WIDTH, MAP_HEIGHT } from '../utils/constants.js';
import { randomInt } from '../utils/math.js';

/**
 * Map system for terrain generation and loading
 * Handles terrain placement, map data, and procedural generation
 */
export class Map {
    constructor(grid) {
        this.grid = grid;
        this.name = '';
        this.description = '';
        this.spawnPoints = [];
        this.townCenter = { x: 20, y: 15 }; // Default center position
    }

    /**
     * Load map from JSON data
     * @param {Object} mapData - Map configuration object
     */
    loadFromData(mapData) {
        this.name = mapData.name || 'Untitled Map';
        this.description = mapData.description || '';
        this.townCenter = mapData.townCenter || { x: 20, y: 15 };
        this.spawnPoints = mapData.spawnPoints || this.generateDefaultSpawnPoints();

        // Load terrain layout
        if (mapData.terrain) {
            this.loadTerrainFromArray(mapData.terrain);
        } else if (mapData.generate) {
            this.generateTerrain(mapData.generate);
        } else {
            this.generateDefaultTerrain();
        }

        console.log(`🗺️ Loaded map: ${this.name}`);
    }

    /**
     * Load terrain from 2D array
     * @param {Array} terrainArray - 2D array of terrain type numbers
     */
    loadTerrainFromArray(terrainArray) {
        for (let y = 0; y < Math.min(terrainArray.length, MAP_HEIGHT); y++) {
            const row = terrainArray[y];
            for (let x = 0; x < Math.min(row.length, MAP_WIDTH); x++) {
                this.grid.setTerrain(x, y, row[x]);
            }
        }
    }

    /**
     * Generate terrain procedurally
     * @param {Object} genParams - Generation parameters
     */
    generateTerrain(genParams) {
        const type = genParams.type || 'valley';
        
        switch (type) {
            case 'valley':
                this.generateValleyMap(genParams);
                break;
            case 'plains':
                this.generatePlainsMap(genParams);
                break;
            case 'island':
                this.generateIslandMap(genParams);
                break;
            default:
                this.generateDefaultTerrain();
        }
    }

    /**
     * Generate default tutorial terrain
     */
    generateDefaultTerrain() {
        // Fill with grass
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                this.grid.setTerrain(x, y, TERRAIN.GRASS);
            }
        }

        // Add some water features
        this.addRiver(5, 10, 35, 12);
        this.addLake(30, 20, 6, 4);

        // Add stone deposits
        this.addStoneDeposits(8);

        // Add forest patches
        this.addForestPatch(2, 2, 6, 4);
        this.addForestPatch(35, 5, 4, 8);
        this.addForestPatch(10, 25, 8, 3);

        // Add mountains for natural barriers
        this.addMountainRange(0, 0, 40, 2); // North wall
        this.addMountainRange(0, 28, 40, 2); // South wall
        this.addMountainRange(0, 0, 2, 30); // West wall
        this.addMountainRange(38, 0, 2, 30); // East wall

        // Add some dirt paths
        this.addPath(this.townCenter.x, this.townCenter.y, 5, this.townCenter.y, TERRAIN.DIRT);
        this.addPath(this.townCenter.x, this.townCenter.y, this.townCenter.x, 25, TERRAIN.DIRT);

        console.log('🌱 Generated default tutorial terrain');
    }

    /**
     * Generate valley map (good for beginners)
     * @param {Object} params - Generation parameters
     */
    generateValleyMap(params) {
        // Start with grass
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                this.grid.setTerrain(x, y, TERRAIN.GRASS);
            }
        }

        // Create valley walls (mountains)
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const wallHeight = Math.floor(8 + Math.sin(y * 0.3) * 4);
            // Left wall
            for (let x = 0; x < wallHeight; x++) {
                this.grid.setTerrain(x, y, TERRAIN.MOUNTAIN);
            }
            // Right wall
            for (let x = MAP_WIDTH - wallHeight; x < MAP_WIDTH; x++) {
                this.grid.setTerrain(x, y, TERRAIN.MOUNTAIN);
            }
        }

        // Add river through the valley
        const riverY = Math.floor(MAP_HEIGHT * 0.6);
        this.addRiver(8, riverY, 32, riverY + 1);

        // Add resources
        this.addStoneDeposits(5);
        this.addForestPatch(12, 5, 6, 4);
        this.addForestPatch(25, 20, 5, 6);
    }

    /**
     * Generate plains map (open, harder to defend)
     * @param {Object} params - Generation parameters
     */
    generatePlainsMap(params) {
        // Mostly grass with scattered features
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                this.grid.setTerrain(x, y, TERRAIN.GRASS);
            }
        }

        // Scattered stone deposits
        this.addStoneDeposits(12);

        // Small forest clusters
        for (let i = 0; i < 6; i++) {
            const x = randomInt(5, MAP_WIDTH - 8);
            const y = randomInt(5, MAP_HEIGHT - 6);
            this.addForestPatch(x, y, randomInt(3, 6), randomInt(2, 4));
        }

        // Small lakes
        this.addLake(10, 8, 4, 3);
        this.addLake(28, 22, 5, 3);

        // Minimal mountain barriers (just corners)
        this.addMountainRange(0, 0, 5, 5);
        this.addMountainRange(35, 0, 5, 5);
        this.addMountainRange(0, 25, 5, 5);
        this.addMountainRange(35, 25, 5, 5);
    }

    /**
     * Add a river between two points
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     */
    addRiver(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(distance);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = Math.round(x1 + dx * t);
            const y = Math.round(y1 + dy * t);
            
            // Make river 2-3 tiles wide
            for (let ox = -1; ox <= 1; ox++) {
                for (let oy = -1; oy <= 1; oy++) {
                    if (Math.abs(ox) + Math.abs(oy) <= 1) { // Cross shape
                        this.grid.setTerrain(x + ox, y + oy, TERRAIN.WATER);
                    }
                }
            }
        }
    }

    /**
     * Add a rectangular lake
     * @param {number} x - Top-left X
     * @param {number} y - Top-left Y
     * @param {number} width - Lake width
     * @param {number} height - Lake height
     */
    addLake(x, y, width, height) {
        for (let ly = y; ly < y + height; ly++) {
            for (let lx = x; lx < x + width; lx++) {
                this.grid.setTerrain(lx, ly, TERRAIN.WATER);
            }
        }
    }

    /**
     * Add random stone deposits across the map
     * @param {number} count - Number of deposits to add
     */
    addStoneDeposits(count) {
        for (let i = 0; i < count; i++) {
            const x = randomInt(3, MAP_WIDTH - 5);
            const y = randomInt(3, MAP_HEIGHT - 5);
            const size = randomInt(1, 3);

            for (let sy = y; sy < y + size; sy++) {
                for (let sx = x; sx < x + size; sx++) {
                    this.grid.setTerrain(sx, sy, TERRAIN.STONE);
                }
            }
        }
    }

    /**
     * Add a forest patch
     * @param {number} x - Top-left X
     * @param {number} y - Top-left Y
     * @param {number} width - Patch width
     * @param {number} height - Patch height
     */
    addForestPatch(x, y, width, height) {
        for (let fy = y; fy < y + height; fy++) {
            for (let fx = x; fx < x + width; fx++) {
                if (this.grid.isValidTile(fx, fy)) {
                    this.grid.setTerrain(fx, fy, TERRAIN.FOREST);
                }
            }
        }
    }

    /**
     * Add a mountain range
     * @param {number} x - Top-left X
     * @param {number} y - Top-left Y
     * @param {number} width - Range width
     * @param {number} height - Range height
     */
    addMountainRange(x, y, width, height) {
        for (let my = y; my < y + height; my++) {
            for (let mx = x; mx < x + width; mx++) {
                if (this.grid.isValidTile(mx, my)) {
                    this.grid.setTerrain(mx, my, TERRAIN.MOUNTAIN);
                }
            }
        }
    }

    /**
     * Add a simple path between two points
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {number} terrainType - Terrain type for path
     */
    addPath(x1, y1, x2, y2, terrainType = TERRAIN.DIRT) {
        // Simple L-shaped path (horizontal first, then vertical)
        // Horizontal segment
        const startX = Math.min(x1, x2);
        const endX = Math.max(x1, x2);
        for (let x = startX; x <= endX; x++) {
            this.grid.setTerrain(x, y1, terrainType);
        }

        // Vertical segment
        const startY = Math.min(y1, y2);
        const endY = Math.max(y1, y2);
        for (let y = startY; y <= endY; y++) {
            this.grid.setTerrain(x2, y, terrainType);
        }
    }

    /**
     * Generate default spawn points around map edges
     * @returns {Array} Array of spawn point objects
     */
    generateDefaultSpawnPoints() {
        return [
            { x: 2, y: 15, name: 'West Gate' },      // Left side
            { x: 37, y: 15, name: 'East Gate' },     // Right side
            { x: 20, y: 2, name: 'North Gate' },     // Top
            { x: 20, y: 27, name: 'South Gate' }     // Bottom
        ];
    }

    /**
     * Get all spawn points
     * @returns {Array} Array of spawn point objects
     */
    getSpawnPoints() {
        return this.spawnPoints;
    }

    /**
     * Get town center position
     * @returns {Object} Town center coordinates {x, y}
     */
    getTownCenter() {
        return this.townCenter;
    }

    /**
     * Set town center position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    setTownCenter(x, y) {
        this.townCenter = { x, y };
    }

    /**
     * Check if a position is suitable for building placement
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if position is good for buildings
     */
    isGoodBuildingSpot(x, y) {
        const tile = this.grid.getTile(x, y);
        if (!tile) return false;

        // Good terrain types for building
        return tile.terrain === TERRAIN.GRASS || 
               tile.terrain === TERRAIN.DIRT;
    }

    /**
     * Get map information for UI display
     * @returns {Object} Map information
     */
    getMapInfo() {
        return {
            name: this.name,
            description: this.description,
            size: `${MAP_WIDTH}×${MAP_HEIGHT}`,
            townCenter: this.townCenter,
            spawnPoints: this.spawnPoints.length
        };
    }

    /**
     * Export current terrain to saveable format
     * @returns {Object} Exportable map data
     */
    exportMapData() {
        const terrain = [];
        
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                const tile = this.grid.getTile(x, y);
                row.push(tile ? tile.terrain : TERRAIN.GRASS);
            }
            terrain.push(row);
        }

        return {
            name: this.name,
            description: this.description,
            townCenter: this.townCenter,
            spawnPoints: this.spawnPoints,
            terrain: terrain
        };
    }
}