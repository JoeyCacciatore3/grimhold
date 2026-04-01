// Grimhold - Game Constants

// Grid and tile system
export const TILE_SIZE = 32;
export const MAP_WIDTH = 40;
export const MAP_HEIGHT = 30;
export const VIEWPORT_WIDTH = 1280;
export const VIEWPORT_HEIGHT = 960;

// Colors (hex values for canvas)
export const COLORS = {
    // Grid
    GRID_LINE: '#333333',
    GRID_HOVER: '#555555',
    GRID_SELECTED: '#777777',
    
    // UI
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#cccccc',
    TEXT_DEBUG: '#00ff00',
    
    // Terrain
    GRASS: '#2d5016',
    WATER: '#1e3a5f',
    STONE: '#666666',
    DIRT: '#8b4513',
    FOREST: '#0f3a0f',
    
    // Buildings
    HOUSE: '#8b4513',
    WALL: '#666666',
    TOWER: '#444444',
    
    // Combat
    HEALTH_FULL: '#00ff00',
    HEALTH_DAMAGE: '#ff0000',
    PROJECTILE: '#ffff00',
    
    // Background
    CANVAS_BG: '#2a2a2a'
};

// Game timing (milliseconds)
export const TIMING = {
    FRAME_RATE: 60,
    DAY_DURATION: 120000,    // 2 minutes
    NIGHT_DURATION: 180000,  // 3 minutes
    WAVE_SPAWN_INTERVAL: 5000 // 5 seconds between spawns
};

// Camera settings
export const CAMERA = {
    PAN_SPEED: 200,          // pixels per second
    ZOOM_LEVELS: [1.0, 0.5], // normal, zoomed out
    EDGE_SCROLL_MARGIN: 50   // pixels from edge to trigger scroll
};

// Input keys
export const KEYS = {
    PAN_UP: 'KeyW',
    PAN_DOWN: 'KeyS', 
    PAN_LEFT: 'KeyA',
    PAN_RIGHT: 'KeyD',
    ZOOM_IN: 'Equal',
    ZOOM_OUT: 'Minus',
    PAUSE: 'Space',
    DEBUG: 'KeyG'
};

// Terrain types
export const TERRAIN = {
    GRASS: 0,
    WATER: 1,
    STONE: 2,
    DIRT: 3,
    FOREST: 4,
    MOUNTAIN: 5
};

// Building types
export const BUILDINGS = {
    NONE: 0,
    HOUSE: 1,
    WALL: 2,
    TOWER: 3,
    FARM: 4,
    BLACKSMITH: 5,
    MARKET: 6
};

// Game states
export const GAME_STATE = {
    LOADING: 'loading',
    MENU: 'menu',
    PLAYING_DAY: 'playing_day',
    PLAYING_NIGHT: 'playing_night',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

// Debug flags
export const DEBUG = {
    SHOW_GRID: true,
    SHOW_COORDS: true,
    SHOW_FPS: true,
    SHOW_PATHFINDING: false,
    LOG_EVENTS: false
};