// Grimhold - Event System

/**
 * Simple event emitter for game events
 * Allows components to communicate without tight coupling
 */
export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {function} callback - Function to call when event fires
     * @returns {function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        
        this.events.get(event).add(callback);
        
        // Return unsubscribe function
        return () => {
            const eventCallbacks = this.events.get(event);
            if (eventCallbacks) {
                eventCallbacks.delete(callback);
                if (eventCallbacks.size === 0) {
                    this.events.delete(event);
                }
            }
        };
    }

    /**
     * Subscribe to an event, but only fire once
     * @param {string} event - Event name
     * @param {function} callback - Function to call when event fires
     * @returns {function} Unsubscribe function
     */
    once(event, callback) {
        const unsubscribe = this.on(event, (...args) => {
            unsubscribe();
            callback(...args);
        });
        return unsubscribe;
    }

    /**
     * Emit an event to all subscribers
     * @param {string} event - Event name
     * @param {...any} args - Arguments to pass to callbacks
     */
    emit(event, ...args) {
        const eventCallbacks = this.events.get(event);
        if (eventCallbacks) {
            // Create a copy to avoid issues if callbacks modify the set
            const callbacks = Array.from(eventCallbacks);
            for (const callback of callbacks) {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Error in event callback for '${event}':`, error);
                }
            }
        }
    }

    /**
     * Remove all listeners for an event, or all events if no event specified
     * @param {string} [event] - Event name to clear, or undefined to clear all
     */
    off(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    /**
     * Get list of events that have listeners
     * @returns {string[]} Array of event names
     */
    getEvents() {
        return Array.from(this.events.keys());
    }

    /**
     * Get number of listeners for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    listenerCount(event) {
        const eventCallbacks = this.events.get(event);
        return eventCallbacks ? eventCallbacks.size : 0;
    }
}

// Global event emitter instance for game-wide events
export const gameEvents = new EventEmitter();

// Common game event names
export const EVENTS = {
    // Game lifecycle
    GAME_STARTED: 'game:started',
    GAME_PAUSED: 'game:paused',
    GAME_RESUMED: 'game:resumed',
    GAME_OVER: 'game:over',
    
    // Day/night cycle
    DAY_STARTED: 'day:started',
    NIGHT_STARTED: 'night:started',
    WAVE_STARTED: 'wave:started',
    WAVE_COMPLETED: 'wave:completed',
    
    // Building system
    BUILDING_PLACED: 'building:placed',
    BUILDING_DESTROYED: 'building:destroyed',
    BUILDING_SELECTED: 'building:selected',
    
    // Combat
    ENEMY_SPAWNED: 'enemy:spawned',
    ENEMY_KILLED: 'enemy:killed',
    PROJECTILE_FIRED: 'projectile:fired',
    PROJECTILE_HIT: 'projectile:hit',
    
    // Resources
    RESOURCE_GAINED: 'resource:gained',
    RESOURCE_SPENT: 'resource:spent',
    RESOURCE_INSUFFICIENT: 'resource:insufficient',
    
    // UI
    UI_HOVER: 'ui:hover',
    UI_CLICK: 'ui:click',
    TOOLTIP_SHOW: 'tooltip:show',
    TOOLTIP_HIDE: 'tooltip:hide'
};