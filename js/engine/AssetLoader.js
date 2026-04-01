// Grimhold - Asset Loading System
import { gameEvents } from '../utils/events.js';

/**
 * Asset loader for images, sounds, and data files
 * Preloads all assets with progress tracking and error handling
 */
export class AssetLoader {
    constructor() {
        this.images = new Map();
        this.data = new Map();
        this.sounds = new Map();
        
        this.loadedCount = 0;
        this.totalCount = 0;
        this.isLoading = false;
        this.loadingPromise = null;
        
        // Asset manifest - defines what to load
        this.manifest = this.createAssetManifest();
    }

    /**
     * Create asset manifest - list of all assets to load
     * @returns {Object} Asset manifest object
     */
    createAssetManifest() {
        return {
            images: {
                // Terrain tiles (32x32)
                'tile_grass': 'assets/tiles/grass.png',
                'tile_water': 'assets/tiles/water.png', 
                'tile_stone': 'assets/tiles/stone.png',
                'tile_dirt': 'assets/tiles/dirt.png',
                'tile_forest': 'assets/tiles/forest.png',
                'tile_mountain': 'assets/tiles/mountain.png',
                
                // Buildings (32x32)
                'building_house': 'assets/buildings/house.png',
                'building_wall': 'assets/buildings/wall.png',
                'building_tower': 'assets/buildings/tower.png',
                'building_farm': 'assets/buildings/farm.png',
                'building_blacksmith': 'assets/buildings/blacksmith.png',
                'building_market': 'assets/buildings/market.png',
                
                // Enemies (32x32)
                'enemy_goblin': 'assets/enemies/goblin.png',
                'enemy_orc': 'assets/enemies/orc.png',
                'enemy_troll': 'assets/enemies/troll.png',
                'enemy_dragon': 'assets/enemies/dragon.png',
                
                // Hero (32x32)
                'hero_knight': 'assets/hero/knight.png',
                
                // Effects (various sizes)
                'fx_arrow': 'assets/fx/arrow.png',
                'fx_fireball': 'assets/fx/fireball.png',
                'fx_explosion': 'assets/fx/explosion.png',
                'fx_heal': 'assets/fx/heal.png',
                
                // UI elements
                'ui_button': 'assets/ui/button.png',
                'ui_panel': 'assets/ui/panel.png',
                'ui_icon_gold': 'assets/ui/icon_gold.png',
                'ui_icon_wood': 'assets/ui/icon_wood.png',
                'ui_icon_stone': 'assets/ui/icon_stone.png',
                'ui_icon_food': 'assets/ui/icon_food.png',
                'ui_icon_iron': 'assets/ui/icon_iron.png'
            },
            
            data: {
                'map_tutorial': 'js/data/maps/tutorial.json',
                'map_valley': 'js/data/maps/valley.json',
                'map_plains': 'js/data/maps/plains.json',
                'buildings_data': 'js/data/buildings.json',
                'enemies_data': 'js/data/enemies.json',
                'waves_data': 'js/data/waves.json',
                'perks_data': 'js/data/perks.json'
            }
            
            // Note: sounds will be added in later phases
        };
    }

    /**
     * Load all assets defined in manifest
     * @returns {Promise} Promise that resolves when all assets are loaded
     */
    async loadAll() {
        if (this.isLoading) {
            return this.loadingPromise;
        }

        this.isLoading = true;
        this.loadedCount = 0;

        // Count total assets
        this.totalCount = Object.keys(this.manifest.images).length +
                         Object.keys(this.manifest.data).length +
                         Object.keys(this.manifest.sounds || {}).length;

        console.log(`📦 Loading ${this.totalCount} assets...`);
        gameEvents.emit('assets:loadStart', { total: this.totalCount });

        try {
            // Load all asset types in parallel
            this.loadingPromise = Promise.all([
                this.loadImages(),
                this.loadData(),
                this.loadSounds()
            ]);

            await this.loadingPromise;

            console.log('✅ All assets loaded successfully');
            gameEvents.emit('assets:loadComplete');
            
        } catch (error) {
            console.error('❌ Asset loading failed:', error);
            gameEvents.emit('assets:loadError', error);
            throw error;
            
        } finally {
            this.isLoading = false;
        }

        return this.loadingPromise;
    }

    /**
     * Load all image assets
     * @returns {Promise} Promise that resolves when all images are loaded
     */
    async loadImages() {
        const imagePromises = [];

        for (const [name, path] of Object.entries(this.manifest.images)) {
            const promise = this.loadImage(name, path);
            imagePromises.push(promise);
        }

        return Promise.all(imagePromises);
    }

    /**
     * Load a single image
     * @param {string} name - Asset name
     * @param {string} path - Image file path
     * @returns {Promise} Promise that resolves with loaded image
     */
    loadImage(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.images.set(name, img);
                this.onAssetLoaded(name, 'image');
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`⚠️ Failed to load image: ${path}`);
                // Create placeholder image instead of failing
                const placeholder = this.createPlaceholderImage(name);
                this.images.set(name, placeholder);
                this.onAssetLoaded(name, 'image');
                resolve(placeholder);
            };
            
            img.src = path;
        });
    }

    /**
     * Load all data files (JSON)
     * @returns {Promise} Promise that resolves when all data is loaded
     */
    async loadData() {
        const dataPromises = [];

        for (const [name, path] of Object.entries(this.manifest.data)) {
            const promise = this.loadDataFile(name, path);
            dataPromises.push(promise);
        }

        return Promise.all(dataPromises);
    }

    /**
     * Load a single data file
     * @param {string} name - Asset name
     * @param {string} path - File path
     * @returns {Promise} Promise that resolves with parsed data
     */
    async loadDataFile(name, path) {
        try {
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.data.set(name, data);
            this.onAssetLoaded(name, 'data');
            return data;
            
        } catch (error) {
            console.warn(`⚠️ Failed to load data file: ${path}`, error);
            // Provide empty data instead of failing
            this.data.set(name, {});
            this.onAssetLoaded(name, 'data');
            return {};
        }
    }

    /**
     * Load sound assets (placeholder for future implementation)
     * @returns {Promise} Promise that resolves immediately
     */
    async loadSounds() {
        // Sounds will be implemented in later phases
        return Promise.resolve();
    }

    /**
     * Called when an individual asset finishes loading
     * @param {string} name - Asset name
     * @param {string} type - Asset type
     */
    onAssetLoaded(name, type) {
        this.loadedCount++;
        
        const progress = this.loadedCount / this.totalCount;
        
        gameEvents.emit('assets:progress', {
            loaded: this.loadedCount,
            total: this.totalCount,
            progress: progress,
            asset: name,
            type: type
        });
    }

    /**
     * Create placeholder image for missing assets
     * @param {string} name - Asset name for debug info
     * @returns {HTMLCanvasElement} Canvas with placeholder pattern
     */
    createPlaceholderImage(name) {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Draw placeholder pattern
        ctx.fillStyle = '#ff00ff'; // Magenta = missing asset
        ctx.fillRect(0, 0, 32, 32);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillRect(16, 16, 16, 16);
        
        // Add text if canvas is large enough
        if (name.length <= 8) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(name, 16, 20);
        }
        
        return canvas;
    }

    /**
     * Get loaded image by name
     * @param {string} name - Image asset name
     * @returns {HTMLImageElement|HTMLCanvasElement} Image or placeholder
     */
    getImage(name) {
        if (this.images.has(name)) {
            return this.images.get(name);
        }
        
        console.warn(`Image not found: ${name}`);
        return this.createPlaceholderImage(name);
    }

    /**
     * Get loaded data by name
     * @param {string} name - Data asset name
     * @returns {Object} Parsed JSON data or empty object
     */
    getData(name) {
        if (this.data.has(name)) {
            return this.data.get(name);
        }
        
        console.warn(`Data not found: ${name}`);
        return {};
    }

    /**
     * Check if a specific asset is loaded
     * @param {string} name - Asset name
     * @param {string} type - Asset type ('image', 'data', 'sound')
     * @returns {boolean} True if asset is loaded
     */
    isLoaded(name, type = 'image') {
        switch (type) {
            case 'image':
                return this.images.has(name);
            case 'data':
                return this.data.has(name);
            case 'sound':
                return this.sounds.has(name);
            default:
                return false;
        }
    }

    /**
     * Get loading progress information
     * @returns {Object} Progress information
     */
    getProgress() {
        return {
            loaded: this.loadedCount,
            total: this.totalCount,
            progress: this.totalCount > 0 ? this.loadedCount / this.totalCount : 0,
            isLoading: this.isLoading,
            isComplete: this.loadedCount >= this.totalCount && !this.isLoading
        };
    }

    /**
     * Preload specific assets (useful for dynamic loading)
     * @param {Array} assetList - List of asset names to load
     * @returns {Promise} Promise that resolves when assets are loaded
     */
    async preloadAssets(assetList) {
        const promises = [];
        
        for (const assetName of assetList) {
            if (!this.isLoaded(assetName)) {
                // Find asset in manifest
                for (const [type, assets] of Object.entries(this.manifest)) {
                    if (assets[assetName]) {
                        if (type === 'images') {
                            promises.push(this.loadImage(assetName, assets[assetName]));
                        } else if (type === 'data') {
                            promises.push(this.loadDataFile(assetName, assets[assetName]));
                        }
                        break;
                    }
                }
            }
        }
        
        return Promise.all(promises);
    }

    /**
     * Clear all loaded assets (for memory management)
     */
    clear() {
        this.images.clear();
        this.data.clear();
        this.sounds.clear();
        this.loadedCount = 0;
        console.log('🗑️ Asset cache cleared');
    }
}