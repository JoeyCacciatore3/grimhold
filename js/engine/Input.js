// Grimhold - Input System
import { KEYS, CAMERA } from '../utils/constants.js';
import { gameEvents, EVENTS } from '../utils/events.js';

/**
 * Input handling system for mouse and keyboard
 * Converts raw input to game actions and grid coordinates
 */
export class Input {
    constructor(canvas, grid) {
        this.canvas = canvas;
        this.grid = grid;
        
        // Input state
        this.keys = new Map();
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseGridPos = null;
        this.mouseDown = false;
        this.mouseButton = -1;
        
        // Input settings
        this.panSpeed = CAMERA.PAN_SPEED;
        
        // Bind event listeners
        this.setupEventListeners();
    }

    /**
     * Setup all input event listeners
     */
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Disable right-click menu
        
        // Prevent default behavior for game keys
        document.addEventListener('keydown', (e) => {
            if (this.isGameKey(e.code)) {
                e.preventDefault();
            }
        });
    }

    /**
     * Check if a key code is used by the game
     * @param {string} code - Key code
     * @returns {boolean} True if key is used by game
     */
    isGameKey(code) {
        return Object.values(KEYS).includes(code);
    }

    /**
     * Handle keydown event
     * @param {KeyboardEvent} event - Keyboard event
     */
    onKeyDown(event) {
        this.keys.set(event.code, true);
        
        // Emit specific key events
        switch (event.code) {
            case KEYS.PAUSE:
                gameEvents.emit(EVENTS.GAME_PAUSED);
                break;
            case KEYS.DEBUG:
                gameEvents.emit('debug:toggle');
                break;
        }
    }

    /**
     * Handle keyup event
     * @param {KeyboardEvent} event - Keyboard event
     */
    onKeyUp(event) {
        this.keys.set(event.code, false);
    }

    /**
     * Handle mouse move event
     * @param {MouseEvent} event - Mouse event
     */
    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = event.clientX - rect.left;
        this.mouseY = event.clientY - rect.top;
        
        // Update grid position
        this.mouseGridPos = this.grid.worldToGrid(this.mouseX, this.mouseY);
        
        // Emit hover events
        gameEvents.emit(EVENTS.UI_HOVER, {
            screenX: this.mouseX,
            screenY: this.mouseY,
            gridPos: this.mouseGridPos
        });
    }

    /**
     * Handle mouse down event
     * @param {MouseEvent} event - Mouse event
     */
    onMouseDown(event) {
        this.mouseDown = true;
        this.mouseButton = event.button;
    }

    /**
     * Handle mouse up event
     * @param {MouseEvent} event - Mouse event
     */
    onMouseUp(event) {
        this.mouseDown = false;
        this.mouseButton = -1;
    }

    /**
     * Handle click event
     * @param {MouseEvent} event - Mouse event
     */
    onClick(event) {
        if (!this.mouseGridPos) return;
        
        const clickData = {
            screenX: this.mouseX,
            screenY: this.mouseY,
            gridX: this.mouseGridPos.x,
            gridY: this.mouseGridPos.y,
            button: event.button,
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey
        };
        
        gameEvents.emit(EVENTS.UI_CLICK, clickData);
    }

    /**
     * Update input system (call every frame)
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        this.handleCameraMovement(deltaTime);
    }

    /**
     * Handle camera movement from keyboard input
     * @param {number} deltaTime - Time since last frame in seconds
     */
    handleCameraMovement(deltaTime) {
        let deltaX = 0;
        let deltaY = 0;
        const panDistance = this.panSpeed * deltaTime;
        
        if (this.isKeyPressed(KEYS.PAN_LEFT)) {
            deltaX -= panDistance;
        }
        if (this.isKeyPressed(KEYS.PAN_RIGHT)) {
            deltaX += panDistance;
        }
        if (this.isKeyPressed(KEYS.PAN_UP)) {
            deltaY -= panDistance;
        }
        if (this.isKeyPressed(KEYS.PAN_DOWN)) {
            deltaY += panDistance;
        }
        
        if (deltaX !== 0 || deltaY !== 0) {
            this.grid.moveCamera(deltaX, deltaY);
            
            // Update mouse grid position after camera move
            this.mouseGridPos = this.grid.worldToGrid(this.mouseX, this.mouseY);
        }
    }

    /**
     * Check if a key is currently pressed
     * @param {string} keyCode - Key code to check
     * @returns {boolean} True if key is pressed
     */
    isKeyPressed(keyCode) {
        return this.keys.get(keyCode) === true;
    }

    /**
     * Get current mouse position in screen coordinates
     * @returns {Object} Mouse position {x, y}
     */
    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }

    /**
     * Get current mouse position in grid coordinates
     * @returns {Object|null} Grid position {x, y} or null if outside grid
     */
    getMouseGridPosition() {
        return this.mouseGridPos;
    }

    /**
     * Check if mouse is currently pressed
     * @param {number} [button] - Mouse button to check (0=left, 1=middle, 2=right)
     * @returns {boolean} True if mouse button is pressed
     */
    isMousePressed(button) {
        if (button !== undefined) {
            return this.mouseDown && this.mouseButton === button;
        }
        return this.mouseDown;
    }

    /**
     * Get debug information about input state
     * @returns {Object} Debug information
     */
    getDebugInfo() {
        const pressedKeys = [];
        for (const [key, pressed] of this.keys) {
            if (pressed) {
                pressedKeys.push(key);
            }
        }
        
        return {
            mousePosition: { x: this.mouseX, y: this.mouseY },
            mouseGridPosition: this.mouseGridPos,
            mousePressed: this.mouseDown,
            mouseButton: this.mouseButton,
            pressedKeys: pressedKeys
        };
    }

    /**
     * Reset input state (useful for game state changes)
     */
    reset() {
        this.keys.clear();
        this.mouseDown = false;
        this.mouseButton = -1;
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('click', this.onClick);
    }
}