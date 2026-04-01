# Grimhold — Detailed Task List

## Current Phase: Phase 1 - Foundation

### TODAY'S SPRINT: Engine Setup + Grid System

---

## 🎯 ACTIVE TASKS

### Task 1.1: Engine Setup
**Time estimate:** 30 minutes

- [ ] **index.html** — Canvas setup with script loading order
  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>Grimhold</title>
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    <canvas id="game-canvas"></canvas>
    <!-- Script loading order from STRUCTURE.md -->
  </body>
  </html>
  ```

- [ ] **css/style.css** — Fullscreen canvas styling
  ```css
  body { margin: 0; overflow: hidden; background: #1a1a1a; }
  #game-canvas { display: block; }
  ```

### Task 1.2: Core Utilities
**Time estimate:** 45 minutes

- [ ] **js/utils/constants.js** — Foundation config
  ```javascript
  // Tile system
  export const TILE_SIZE = 32;
  export const MAP_WIDTH = 40;
  export const MAP_HEIGHT = 30;
  
  // Colors
  export const COLORS = {
    GRID: '#333',
    HOVER: '#555',
    TEXT: '#fff'
  };
  ```

- [ ] **js/utils/math.js** — Essential helpers
  ```javascript
  export function distance(x1, y1, x2, y2) { ... }
  export function clamp(value, min, max) { ... }
  export function lerp(a, b, t) { ... }
  ```

- [ ] **js/utils/events.js** — Simple event system
  ```javascript
  export class EventEmitter {
    constructor() { this.events = {}; }
    on(event, callback) { ... }
    emit(event, data) { ... }
  }
  ```

### Task 1.3: Grid System Implementation
**Time estimate:** 60 minutes

- [ ] **js/engine/Grid.js** — Core grid logic
  ```javascript
  export class Grid {
    constructor(width, height) { ... }
    worldToGrid(x, y) { ... }
    gridToWorld(gridX, gridY) { ... }
    isValidTile(x, y) { ... }
    getTile(x, y) { ... }
    setTile(x, y, type) { ... }
  }
  ```

- [ ] **js/engine/Renderer.js** — Canvas rendering
  ```javascript
  export class Renderer {
    constructor(canvas, grid) { ... }
    clear() { ... }
    drawGrid() { ... }
    drawTileHighlight(x, y, color) { ... }
  }
  ```

- [ ] **js/engine/Input.js** — Mouse and keyboard
  ```javascript
  export class Input {
    constructor(canvas, grid) { ... }
    getMouseGridPosition() { ... }
    isKeyPressed(key) { ... }
    update() { ... } // Call each frame
  }
  ```

### Task 1.4: Game Loop Foundation
**Time estimate:** 45 minutes

- [ ] **js/engine/Game.js** — Main game class
  ```javascript
  export class Game {
    constructor() {
      this.grid = new Grid(MAP_WIDTH, MAP_HEIGHT);
      this.renderer = new Renderer(canvas, this.grid);
      this.input = new Input(canvas, this.grid);
    }
    
    init() { ... }
    update(deltaTime) { ... }
    render() { ... }
    gameLoop(timestamp) { ... } // RAF
  }
  ```

### Task 1.5: Visual Verification
**Time estimate:** 30 minutes

- [ ] **tests/test_grid.html** — Standalone grid test
  - Grid renders correctly (40×30 tiles)
  - Mouse hover shows coordinates
  - WASD panning works
  - No console errors

- [ ] **Manual verification checklist:**
  - [ ] Canvas fills browser window
  - [ ] Grid lines visible and aligned
  - [ ] Mouse coordinates display in real-time
  - [ ] Camera pans smoothly with WASD
  - [ ] No visual artifacts or flickering

---

## ⚡ NEXT SPRINT: Phase 2 Tasks (After Phase 1 Complete)

### Task 2.1: Basic Terrain (30 min)
- [ ] Create `assets/tiles/grass.png` (32×32, temp colored squares)
- [ ] Create `js/game/Map.js` with terrain type enum
- [ ] Load and render basic tutorial map

### Task 2.2: Pathfinding Core (60 min)
- [ ] Implement A* in `js/engine/Pathfinder.js`
- [ ] Create pathfinding test visualization
- [ ] Mark water/mountain tiles as impassable

### Task 2.3: Asset Loader (45 min)
- [ ] Build image preloader with loading screen
- [ ] Error handling for missing sprites
- [ ] Cache management for sprites

---

## 📋 PHASE COMPLETION CRITERIA

### Phase 1: Foundation
- [ ] Grid system renders 40×30 tiles
- [ ] Mouse input converts to grid coordinates
- [ ] WASD camera panning functional
- [ ] Game loop running at stable framerate
- [ ] Test page verifies all functionality
- [ ] Zero console errors or warnings

### Exit Gate Questions:
1. Can you see the grid clearly?
2. Does mouse hover show correct tile coordinates?
3. Does camera panning work smoothly?
4. Is the game loop stable (no lag/stuttering)?

---

## 🛠 DEVELOPMENT WORKFLOW

### File Creation Order (This Session):
1. `index.html` + `css/style.css`
2. `js/utils/constants.js`
3. `js/utils/math.js` 
4. `js/utils/events.js`
5. `js/engine/Grid.js`
6. `js/engine/Renderer.js`
7. `js/engine/Input.js`
8. `js/engine/Game.js`
9. `tests/test_grid.html`

### Testing Strategy:
- Build incrementally — test each component before next
- Use `console.log` liberally during development
- Test in browser after each major addition
- Create simple test cases for each system

### Debug Plan:
- Browser DevTools for runtime errors
- Network tab for asset loading issues
- Canvas drawing problems → check coordinate math
- Input issues → verify event listeners

---

## 🎨 IMMEDIATE NEXT ACTIONS

1. **Create foundation files** (HTML, CSS, constants)
2. **Build grid system** (Grid.js, render logic)
3. **Add input handling** (mouse, keyboard)
4. **Test everything** (verification page)
5. **Commit Phase 1** and move to terrain

**Estimated Phase 1 completion:** 3-4 hours focused work

Ready to start with foundation files?