// Grimhold - Rendering Engine
import { TILE_SIZE, COLORS, DEBUG } from '../utils/constants.js';

/**
 * Canvas2D renderer for the game
 * Handles all drawing operations with camera support
 */
export class Renderer {
    constructor(canvas, grid) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = grid;
        
        // Set canvas size to full window
        this.resizeCanvas();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Rendering state
        this.frameCount = 0;
        this.lastFpsTime = 0;
        this.currentFps = 0;
    }

    /**
     * Resize canvas to match window size
     */
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        // Scale context to handle high DPI displays
        this.ctx.scale(dpr, dpr);
        
        // Set default styles
        this.ctx.imageSmoothingEnabled = false; // Crisp pixel art
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.font = '12px monospace';
    }

    /**
     * Clear the entire canvas
     */
    clear() {
        this.ctx.fillStyle = COLORS.CANVAS_BG;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    /**
     * Draw the tile grid
     */
    drawGrid() {
        if (!DEBUG.SHOW_GRID) return;
        
        const camera = this.grid.getCameraPosition();
        const startX = Math.floor(camera.x / TILE_SIZE);
        const startY = Math.floor(camera.y / TILE_SIZE);
        const endX = Math.min(startX + Math.ceil(window.innerWidth / TILE_SIZE) + 1, this.grid.width);
        const endY = Math.min(startY + Math.ceil(window.innerHeight / TILE_SIZE) + 1, this.grid.height);
        
        this.ctx.strokeStyle = COLORS.GRID_LINE;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        // Draw vertical lines
        for (let x = startX; x <= endX; x++) {
            const screenX = x * TILE_SIZE - camera.x;
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, window.innerHeight);
        }
        
        // Draw horizontal lines
        for (let y = startY; y <= endY; y++) {
            const screenY = y * TILE_SIZE - camera.y;
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(window.innerWidth, screenY);
        }
        
        this.ctx.stroke();
    }

    /**
     * Draw terrain tiles
     */
    drawTerrain() {
        const camera = this.grid.getCameraPosition();
        const startX = Math.floor(camera.x / TILE_SIZE);
        const startY = Math.floor(camera.y / TILE_SIZE);
        const endX = Math.min(startX + Math.ceil(window.innerWidth / TILE_SIZE) + 1, this.grid.width);
        const endY = Math.min(startY + Math.ceil(window.innerHeight / TILE_SIZE) + 1, this.grid.height);
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.grid.getTile(x, y);
                if (!tile) continue;
                
                const screenX = x * TILE_SIZE - camera.x;
                const screenY = y * TILE_SIZE - camera.y;
                
                // Draw terrain background
                this.ctx.fillStyle = this.getTerrainColor(tile.terrain);
                this.ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                
                // Draw terrain texture/pattern
                this.drawTerrainPattern(tile.terrain, screenX, screenY);
            }
        }
    }

    /**
     * Get color for terrain type
     * @param {number} terrainType - TERRAIN constant
     * @returns {string} Hex color string
     */
    getTerrainColor(terrainType) {
        switch (terrainType) {
            case 0: return COLORS.GRASS;    // TERRAIN.GRASS
            case 1: return COLORS.WATER;    // TERRAIN.WATER
            case 2: return COLORS.STONE;    // TERRAIN.STONE
            case 3: return COLORS.DIRT;     // TERRAIN.DIRT
            case 4: return COLORS.FOREST;   // TERRAIN.FOREST
            case 5: return COLORS.STONE;    // TERRAIN.MOUNTAIN
            default: return COLORS.GRASS;
        }
    }

    /**
     * Draw terrain patterns/textures
     * @param {number} terrainType - TERRAIN constant
     * @param {number} x - Screen X coordinate
     * @param {number} y - Screen Y coordinate
     */
    drawTerrainPattern(terrainType, x, y) {
        this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        this.ctx.lineWidth = 1;
        
        switch (terrainType) {
            case 1: // TERRAIN.WATER - wavy lines
                this.ctx.beginPath();
                this.ctx.moveTo(x + 4, y + 10);
                this.ctx.quadraticCurveTo(x + 16, y + 6, x + 28, y + 10);
                this.ctx.moveTo(x + 4, y + 20);
                this.ctx.quadraticCurveTo(x + 16, y + 16, x + 28, y + 20);
                this.ctx.stroke();
                break;
                
            case 4: // TERRAIN.FOREST - simple tree shapes
                this.ctx.fillStyle = 'rgba(0,100,0,0.3)';
                this.ctx.fillRect(x + 8, y + 8, 4, 8);
                this.ctx.fillRect(x + 20, y + 12, 4, 8);
                this.ctx.beginPath();
                this.ctx.arc(x + 10, y + 8, 6, 0, Math.PI * 2);
                this.ctx.arc(x + 22, y + 12, 4, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 5: // TERRAIN.MOUNTAIN - jagged peaks
                this.ctx.beginPath();
                this.ctx.moveTo(x, y + 32);
                this.ctx.lineTo(x + 8, y + 16);
                this.ctx.lineTo(x + 16, y + 20);
                this.ctx.lineTo(x + 24, y + 8);
                this.ctx.lineTo(x + 32, y + 32);
                this.ctx.stroke();
                break;
        }
    }

    /**
     * Draw highlight on a specific tile
     * @param {number} gridX - Grid X coordinate
     * @param {number} gridY - Grid Y coordinate
     * @param {string} color - Highlight color
     */
    drawTileHighlight(gridX, gridY, color = COLORS.GRID_HOVER) {
        const worldPos = this.grid.gridToWorld(gridX, gridY);
        
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillRect(worldPos.x, worldPos.y, TILE_SIZE, TILE_SIZE);
        this.ctx.globalAlpha = 1.0;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(worldPos.x, worldPos.y, TILE_SIZE, TILE_SIZE);
    }

    /**
     * Draw coordinate text on a tile
     * @param {number} gridX - Grid X coordinate
     * @param {number} gridY - Grid Y coordinate
     */
    drawTileCoords(gridX, gridY) {
        if (!DEBUG.SHOW_COORDS) return;
        
        const worldPos = this.grid.gridToWorld(gridX, gridY);
        
        this.ctx.fillStyle = COLORS.TEXT_DEBUG;
        this.ctx.font = '10px monospace';
        this.ctx.fillText(`${gridX},${gridY}`, worldPos.x + 2, worldPos.y + 2);
    }

    /**
     * Draw debug information overlay
     * @param {Object} debugInfo - Debug data to display
     */
    drawDebugInfo(debugInfo = {}) {
        if (!DEBUG.SHOW_FPS && !DEBUG.SHOW_COORDS) return;
        
        const info = [];
        
        if (DEBUG.SHOW_FPS) {
            info.push(`FPS: ${this.currentFps}`);
        }
        
        if (debugInfo.mouseGridPos) {
            info.push(`Mouse: ${debugInfo.mouseGridPos.x}, ${debugInfo.mouseGridPos.y}`);
        }
        
        if (debugInfo.camera) {
            info.push(`Camera: ${Math.round(debugInfo.camera.x)}, ${Math.round(debugInfo.camera.y)}`);
        }
        
        if (info.length > 0) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(10, 10, 200, info.length * 16 + 10);
            
            this.ctx.fillStyle = COLORS.TEXT_DEBUG;
            this.ctx.font = '12px monospace';
            info.forEach((text, index) => {
                this.ctx.fillText(text, 15, 20 + index * 16);
            });
        }
    }

    /**
     * Update FPS counter
     * @param {number} timestamp - Current timestamp
     */
    updateFPS(timestamp) {
        this.frameCount++;
        
        if (timestamp - this.lastFpsTime >= 1000) {
            this.currentFps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = timestamp;
        }
    }

    /**
     * Draw a simple rectangle (for testing)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {string} color - Fill color
     */
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    /**
     * Draw text at specified position
     * @param {string} text - Text to draw
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Text color
     * @param {string} font - Font specification
     */
    drawText(text, x, y, color = COLORS.TEXT_PRIMARY, font = '12px monospace') {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }
}