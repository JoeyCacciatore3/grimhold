# Grimhold — Technical Reference

Research-backed implementation patterns for every major system. Read before writing code.

---

## 1. Game Loop — Fixed Timestep with Interpolation

**Pattern:** Accumulator-based fixed timestep (Glenn Fiedler's "Fix Your Timestep").

**Why:** Variable timestep causes non-deterministic physics, tunneling, and instability. Fixed timestep gives consistent simulation regardless of frame rate.

```javascript
// Core pattern
const TICK_RATE = 60;
const TICK_MS = 1000 / TICK_RATE;
let lastTime = performance.now();
let accumulator = 0;
let paused = false;

function loop(now) {
    if (paused) return;
    
    let frameTime = now - lastTime;
    lastTime = now;
    
    // Clamp to prevent spiral of death (tab switch, lag spike)
    frameTime = Math.min(frameTime, 250);
    
    accumulator += frameTime;
    
    // Fixed timestep updates
    while (accumulator >= TICK_MS) {
        update(TICK_MS / 1000); // Pass dt in seconds
        accumulator -= TICK_MS;
    }
    
    // Interpolation factor for smooth rendering
    const alpha = accumulator / TICK_MS;
    render(alpha);
    
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

**Key rules:**
- `update(dt)` receives FIXED dt (1/60 sec). All game logic here.
- `render(alpha)` receives interpolation factor [0,1). Blend prev/current state for smooth visuals.
- Clamp frameTime to 250ms max — prevents catch-up death spiral after tab switch.
- Use `performance.now()` not `Date.now()` for high-resolution timing.

**Visibility handling:**
```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        paused = true;
    } else {
        paused = false;
        lastTime = performance.now(); // Reset to avoid huge dt
        requestAnimationFrame(loop);
    }
});
```

---

## 2. Canvas Rendering — Layered + Viewport Culling

### Multi-Canvas Layering
Use 3 stacked canvas elements to avoid redrawing static content every frame:

```html
<div id="game-container">
    <canvas id="terrain-layer"></canvas>   <!-- z-index: 1, redraws only on build/destroy -->
    <canvas id="entity-layer"></canvas>    <!-- z-index: 2, redraws every frame (enemies, hero, projectiles) -->
    <canvas id="ui-layer"></canvas>        <!-- z-index: 3, redraws on state change -->
</div>
```

- **Terrain layer:** Redraw only when camera moves or building placed/destroyed. Cache to offscreen canvas.
- **Entity layer:** Full redraw every frame (enemies moving, projectiles flying, hero).
- **UI layer:** Redraw only on resource change, wave change, or user interaction.

### Viewport Culling
Only draw tiles within the camera viewport + 1 tile buffer:

```javascript
function getVisibleTiles(camera, grid) {
    const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE) - 1);
    const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE) - 1);
    const endCol = Math.min(grid.cols - 1, startCol + Math.ceil(camera.viewWidth / TILE_SIZE) + 2);
    const endRow = Math.min(grid.rows - 1, startRow + Math.ceil(camera.viewHeight / TILE_SIZE) + 2);
    return { startCol, startRow, endCol, endRow };
}
```

### Performance Rules
- **Integer coordinates only** — `Math.floor()` all positions before `drawImage`. Sub-pixel rendering forces anti-aliasing calculations.
- **`imageSmoothingEnabled = false`** — mandatory for pixel art. Set on every canvas context.
- **`alpha: false`** on terrain context — `getContext('2d', { alpha: false })`. Saves compositing cost.
- **Batch by sprite atlas** — group drawImage calls by source image to minimize texture switches.
- **Pre-decode images** — use `createImageBitmap()` on load for GPU-friendly sprites.

### HiDPI Support
```javascript
function setupCanvas(canvas, logicalWidth, logicalHeight) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = logicalWidth + 'px';
    canvas.style.height = logicalHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;
    return ctx;
}
```

---

## 3. Grid System

### Data Structure
Flat array for performance, 2D access via index math:

```javascript
class Grid {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.tiles = new Uint8Array(cols * rows); // Terrain type
        this.buildings = new Int16Array(cols * rows); // Building ID or -1
        this.walkable = new Uint8Array(cols * rows); // 1 = walkable, 0 = blocked
    }
    
    index(col, row) { return row * this.cols + col; }
    getTerrain(col, row) { return this.tiles[this.index(col, row)]; }
    getBuilding(col, row) { return this.buildings[this.index(col, row)]; }
    isWalkable(col, row) { return this.walkable[this.index(col, row)] === 1; }
    
    // Screen to grid conversion (accounting for camera)
    screenToGrid(screenX, screenY, camera) {
        const worldX = screenX + camera.x;
        const worldY = screenY + camera.y;
        return {
            col: Math.floor(worldX / TILE_SIZE),
            row: Math.floor(worldY / TILE_SIZE)
        };
    }
}
```

**Why typed arrays:** `Uint8Array` and `Int16Array` are faster than regular arrays for grid data — no boxing, contiguous memory, cache-friendly iteration.

### Neighbor Queries (for pathfinding)
```javascript
// 4-directional neighbors (no diagonals — cleaner for tower defense pathing)
const DIRS = [[0,-1], [1,0], [0,1], [-1,0]];

function getNeighbors(col, row, grid) {
    const neighbors = [];
    for (const [dc, dr] of DIRS) {
        const nc = col + dc;
        const nr = row + dr;
        if (nc >= 0 && nc < grid.cols && nr >= 0 && nr < grid.rows && grid.isWalkable(nc, nr)) {
            neighbors.push({ col: nc, row: nr });
        }
    }
    return neighbors;
}
```

---

## 4. A* Pathfinding

### Binary Heap Priority Queue
A* performance depends entirely on the open set implementation. Array.sort() is O(n log n) per step. Binary heap is O(log n).

```javascript
class MinHeap {
    constructor() { this.data = []; }
    
    get size() { return this.data.length; }
    
    push(node) {
        this.data.push(node);
        this._bubbleUp(this.data.length - 1);
    }
    
    pop() {
        const top = this.data[0];
        const last = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = last;
            this._sinkDown(0);
        }
        return top;
    }
    
    _bubbleUp(i) {
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.data[i].f >= this.data[parent].f) break;
            [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
            i = parent;
        }
    }
    
    _sinkDown(i) {
        const n = this.data.length;
        while (true) {
            let smallest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            if (left < n && this.data[left].f < this.data[smallest].f) smallest = left;
            if (right < n && this.data[right].f < this.data[smallest].f) smallest = right;
            if (smallest === i) break;
            [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
            i = smallest;
        }
    }
}
```

### A* Implementation
```javascript
function findPath(grid, startCol, startRow, endCol, endRow) {
    const open = new MinHeap();
    const closed = new Set();
    const gScore = new Map();
    const cameFrom = new Map();
    
    const startKey = startCol + ',' + startRow;
    const endKey = endCol + ',' + endRow;
    
    gScore.set(startKey, 0);
    open.push({ col: startCol, row: startRow, f: heuristic(startCol, startRow, endCol, endRow) });
    
    while (open.size > 0) {
        const current = open.pop();
        const currentKey = current.col + ',' + current.row;
        
        if (currentKey === endKey) return reconstructPath(cameFrom, currentKey);
        if (closed.has(currentKey)) continue;
        closed.add(currentKey);
        
        for (const neighbor of getNeighbors(current.col, current.row, grid)) {
            const neighborKey = neighbor.col + ',' + neighbor.row;
            if (closed.has(neighborKey)) continue;
            
            const tentativeG = gScore.get(currentKey) + 1; // Uniform cost
            const prevG = gScore.get(neighborKey) ?? Infinity;
            
            if (tentativeG < prevG) {
                gScore.set(neighborKey, tentativeG);
                cameFrom.set(neighborKey, currentKey);
                const f = tentativeG + heuristic(neighbor.col, neighbor.row, endCol, endRow);
                open.push({ col: neighbor.col, row: neighbor.row, f });
            }
        }
    }
    
    return null; // No path found
}

function heuristic(c1, r1, c2, r2) {
    return Math.abs(c1 - c2) + Math.abs(r1 - r2); // Manhattan distance
}

function reconstructPath(cameFrom, endKey) {
    const path = [];
    let current = endKey;
    while (cameFrom.has(current)) {
        const [col, row] = current.split(',').map(Number);
        path.unshift({ col, row });
        current = cameFrom.get(current);
    }
    return path;
}
```

### Dynamic Obstacle Handling
When a building is placed or destroyed:
1. Update `grid.walkable` for that tile
2. **Don't recalculate ALL enemy paths immediately** — expensive
3. Instead: mark affected enemies as "path dirty"
4. Recalculate paths spread across frames (2-3 enemies per frame) to avoid frame spike
5. If an enemy's next waypoint is now blocked, recalculate immediately (only that one)

```javascript
function onBuildingPlaced(col, row) {
    grid.walkable[grid.index(col, row)] = 0;
    
    // Mark enemies whose path crosses this tile
    for (const enemy of enemies) {
        if (enemy.path && enemy.path.some(p => p.col === col && p.row === row)) {
            enemy.pathDirty = true;
        }
    }
}
```

### Performance Target
- 40×30 grid with 50 obstacles: A* should complete in <1ms
- 100 enemies recalculating paths: spread across 50 frames (2/frame) = done in <1 second

---

## 5. Camera & Input

### Camera
```javascript
class Camera {
    constructor(viewWidth, viewHeight, mapWidth, mapHeight) {
        this.x = 0;
        this.y = 0;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.speed = 400; // pixels per second
    }
    
    update(dt, input) {
        if (input.isDown('KeyW') || input.isDown('ArrowUp')) this.y -= this.speed * dt;
        if (input.isDown('KeyS') || input.isDown('ArrowDown')) this.y += this.speed * dt;
        if (input.isDown('KeyA') || input.isDown('ArrowLeft')) this.x -= this.speed * dt;
        if (input.isDown('KeyD') || input.isDown('ArrowRight')) this.x += this.speed * dt;
        
        // Clamp to map bounds
        this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.viewWidth));
        this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.viewHeight));
    }
}
```

### Input Manager
```javascript
class Input {
    constructor(canvas) {
        this.keys = new Set();
        this.mouse = { x: 0, y: 0, down: false, clicked: false };
        
        window.addEventListener('keydown', e => this.keys.add(e.code));
        window.addEventListener('keyup', e => this.keys.delete(e.code));
        
        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mousedown', () => { this.mouse.down = true; });
        canvas.addEventListener('mouseup', () => { 
            this.mouse.down = false; 
            this.mouse.clicked = true; 
        });
    }
    
    isDown(code) { return this.keys.has(code); }
    
    consumeClick() {
        if (this.mouse.clicked) {
            this.mouse.clicked = false;
            return true;
        }
        return false;
    }
    
    // Convert screen mouse position to world grid coordinates
    getGridPos(camera) {
        return {
            col: Math.floor((this.mouse.x + camera.x) / TILE_SIZE),
            row: Math.floor((this.mouse.y + camera.y) / TILE_SIZE)
        };
    }
}
```

---

## 6. Entity Management — Lightweight Components

**Not full ECS** — overkill for this scope. Use simple class hierarchy with shared update/render interface.

### Entity Base
```javascript
class Entity {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.x = col * TILE_SIZE;
        this.y = row * TILE_SIZE;
        this.alive = true;
    }
    
    update(dt) {}
    render(ctx, camera) {}
}
```

### Entity Pool (avoid GC pressure)
For enemies and projectiles — don't create/destroy, recycle:

```javascript
class EntityPool {
    constructor(factory, initialSize = 50) {
        this.pool = [];
        this.active = [];
        this.factory = factory;
        
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(factory());
        }
    }
    
    spawn(initFn) {
        let entity = this.pool.pop();
        if (!entity) entity = this.factory();
        entity.alive = true;
        initFn(entity);
        this.active.push(entity);
        return entity;
    }
    
    update(dt) {
        for (let i = this.active.length - 1; i >= 0; i--) {
            const e = this.active[i];
            e.update(dt);
            if (!e.alive) {
                this.active.splice(i, 1);
                this.pool.push(e);
            }
        }
    }
    
    render(ctx, camera) {
        for (const e of this.active) {
            e.render(ctx, camera);
        }
    }
}
```

**Why object pooling:** With 100+ enemies spawning/dying per wave, GC pauses cause visible frame drops. Recycling avoids allocation entirely.

### Performance Target
- 200 active entities (enemies + projectiles): <2ms update, <3ms render
- Entity pool pre-allocates 100 objects, grows only if needed

---

## 7. State Machine — Game Flow

```javascript
const GameState = {
    MENU: 'menu',
    DAY: 'day',
    DUSK: 'dusk',
    NIGHT: 'night',
    DAWN: 'dawn',
    GAME_OVER: 'gameover',
    PERK_SELECT: 'perk_select'
};

class StateMachine {
    constructor() {
        this.current = GameState.MENU;
        this.transitions = {
            [GameState.MENU]:        { start: GameState.DAY },
            [GameState.DAY]:         { endDay: GameState.DUSK },
            [GameState.DUSK]:        { ready: GameState.NIGHT },
            [GameState.NIGHT]:       { cleared: GameState.DAWN, lost: GameState.GAME_OVER },
            [GameState.DAWN]:        { continue: GameState.DAY, levelUp: GameState.PERK_SELECT },
            [GameState.PERK_SELECT]: { chosen: GameState.DAY },
            [GameState.GAME_OVER]:   { restart: GameState.MENU }
        };
        this.onEnter = {};
        this.onExit = {};
    }
    
    transition(action) {
        const next = this.transitions[this.current]?.[action];
        if (!next) return false;
        
        this.onExit[this.current]?.();
        this.current = next;
        this.onEnter[this.current]?.();
        return true;
    }
    
    is(state) { return this.current === state; }
}
```

### Transition Details
- **MENU → DAY:** Load map, place town center, give starting resources
- **DAY → DUSK:** Lock building. 2-second transition (sky color shift). Show "NIGHT X" text.
- **DUSK → NIGHT:** Activate dark overlay. Start spawning enemies.
- **NIGHT → DAWN:** All enemies dead. Remove overlay. Collect resources. Check hero level up.
- **NIGHT → GAME_OVER:** Town center destroyed.
- **DAWN → DAY:** Normal continuation. Day counter increments.
- **DAWN → PERK_SELECT:** Hero leveled up. Pause until perk chosen, then → DAY.

---

## 8. Asset Loading

### Preloader
Load all images before game starts. Show loading bar.

```javascript
class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = 0;
        this.total = 0;
    }
    
    add(key, src) {
        this.total++;
        const img = new Image();
        img.src = src;
        img.onload = () => {
            this.loaded++;
            // Convert to ImageBitmap for GPU-friendly rendering
            createImageBitmap(img).then(bmp => {
                this.images[key] = bmp;
            });
        };
        img.onerror = () => {
            console.warn(`Failed to load: ${src}`);
            this.loaded++;
        };
    }
    
    get progress() { return this.total === 0 ? 1 : this.loaded / this.total; }
    get ready() { return this.loaded === this.total; }
    get(key) { return this.images[key] || null; }
}
```

### Placeholder Rendering (Phase 1-5)
Before art pass, render colored rectangles with text labels:

```javascript
function drawPlaceholder(ctx, x, y, width, height, color, label) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, width, height);
    if (label) {
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.fillText(label, x + 2, y + 10);
    }
}
```

This lets us build and test all game systems with zero art assets.

---

## 9. Data-Driven Design

All game content in JSON — no hardcoded stats in JS files.

### buildings.json structure
```json
{
    "house": {
        "name": "House",
        "tier": 1,
        "cost": { "wood": 20 },
        "hp": 100,
        "production": { "gold": 2 },
        "upkeep": { "food": 1 },
        "terrain": ["grass"],
        "adjacency": null,
        "defense": null
    }
}
```

### enemies.json structure
```json
{
    "goblin": {
        "name": "Goblin",
        "hp": 20,
        "damage": 5,
        "speed": 1.5,
        "reward": { "gold": 3 },
        "special": null,
        "sprite": "enemies/goblin.png"
    }
}
```

### waves.json structure
```json
{
    "night_1": {
        "spawns": [
            { "enemy": "goblin", "count": 5, "delay": 1.0, "point": "north" }
        ]
    },
    "night_5": {
        "spawns": [
            { "enemy": "goblin", "count": 8, "delay": 0.8, "point": "north" },
            { "enemy": "skeleton", "count": 4, "delay": 1.2, "point": "east" }
        ]
    }
}
```

**Why data-driven:** Balance changes don't touch code. Add new buildings/enemies by adding JSON entries. Modding-friendly if we ever want that.

---

## 10. Known Pitfalls & Solutions

| Pitfall | Solution |
|---------|----------|
| Tab switch causes huge dt spike | Clamp frameTime to 250ms, reset lastTime on visibility change |
| Sub-pixel rendering blurs pixel art | `Math.floor()` all coordinates, `imageSmoothingEnabled = false` |
| A* recalculation lag when building placed | Spread recalculations across frames (2-3 enemies/frame) |
| GC pauses from enemy spawn/death | Object pooling — recycle entities |
| Canvas redraws everything every frame | Multi-layer canvas, only redraw what changed |
| Mouse coordinates wrong after scroll | Always convert screen → world → grid accounting for camera offset |
| Path blocked completely = enemies stuck | Fallback: attack nearest building if no path exists |
| Large waves cause frame drops | Cap visible projectiles, batch enemy rendering, cull offscreen entities |
| State machine spaghetti | Explicit transition table, onEnter/onExit hooks, no implicit state |
| Balance impossible to tweak | All stats in JSON, hot-reload capable during dev |
