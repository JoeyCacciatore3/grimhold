# Grimhold — Development Roadmap

## Master Timeline
**Target:** 7 phases, each independently playable and testable
**Philosophy:** Build, test, polish each layer before moving to the next

---

## Phase 1: Foundation (Days 1-2)
**Goal:** Core engine running, grid visible, input working

### Task List
- [ ] **Engine Setup**
  - [ ] Create `index.html` with canvas and script imports
  - [ ] Build `css/style.css` — fullscreen canvas, basic UI layout
  - [ ] Implement `js/utils/constants.js` — tile size, colors, config
  - [ ] Implement `js/utils/math.js` — distance, clamp, lerp helpers
  - [ ] Implement `js/utils/events.js` — simple event emitter

- [ ] **Grid System**
  - [ ] Create `js/engine/Grid.js` — 40×30 tile grid, coord conversion
  - [ ] Create `js/engine/Renderer.js` — canvas2D setup, grid drawing
  - [ ] Create `js/engine/Input.js` — mouse/keyboard events, grid snapping
  - [ ] Create `js/engine/Game.js` — main loop, basic state machine

- [ ] **Visual Test**
  - [ ] Draw 40×30 grid with coordinates visible
  - [ ] Mouse hover shows tile coordinates
  - [ ] WASD camera panning works
  - [ ] Create `tests/test_grid.html` for verification

**Definition of Done:** Grid renders, camera pans, mouse shows tile coords, test passes

---

## Phase 2: Map & Terrain (Days 3-4)
**Goal:** Terrain system working, pathfinding operational

### Task List
- [ ] **Terrain System**
  - [ ] Create `js/game/Map.js` — terrain loading and rendering
  - [ ] Define terrain types in `js/data/maps/tutorial.json`
  - [ ] Create basic tileset in `assets/tiles/` (grass, water, stone, forest)
  - [ ] Load and render tutorial map

- [ ] **Pathfinding**
  - [ ] Implement `js/engine/Pathfinder.js` — A* algorithm
  - [ ] Mark impassable tiles (water, mountains)
  - [ ] Create `tests/test_pathfinding.html` — visual A* demo
  - [ ] Pathfinding working from map edges to center

- [ ] **Asset Loading**
  - [ ] Create `js/engine/AssetLoader.js` — image preloader
  - [ ] Load all tile sprites before game starts
  - [ ] Error handling for missing assets

**Definition of Done:** Tutorial map renders with terrain, A* finds paths, test passes

---

## Phase 3: Building System (Days 5-7)
**Goal:** Place buildings, basic resource system

### Task List
- [ ] **Building Core**
  - [ ] Create `js/game/Building.js` — placement, HP, destruction
  - [ ] Define buildings in `js/data/buildings.json` (house, wall, tower)
  - [ ] Create building sprites in `assets/buildings/`
  - [ ] Buildings block pathfinding when placed

- [ ] **Resource System**
  - [ ] Create `js/game/Resources.js` — gold, wood, stone, food, iron
  - [ ] Buildings have build costs
  - [ ] Resource production at dawn
  - [ ] Buildings have upkeep costs

- [ ] **UI Foundation**
  - [ ] Create `js/ui/HUD.js` — resource display bar
  - [ ] Create `js/ui/BuildMenu.js` — building selection panel
  - [ ] Create `js/ui/Tooltip.js` — hover info for buildings
  - [ ] Click to select building type, click grid to place

**Definition of Done:** Can place buildings, costs resources, updates pathfinding, UI works

---

## Phase 4: Combat Foundation (Days 8-10)
**Goal:** Enemies spawn and move, towers shoot

### Task List
- [ ] **Enemy System**
  - [ ] Create `js/game/Enemy.js` — movement, HP, pathfinding
  - [ ] Define enemies in `js/data/enemies.json` (goblin, orc, troll)
  - [ ] Create enemy sprites in `assets/enemies/`
  - [ ] Enemies follow paths to town center

- [ ] **Combat System**
  - [ ] Create `js/game/Tower.js` — targeting, range, damage
  - [ ] Create `js/game/Projectile.js` — bullet travel and impact
  - [ ] Towers auto-target nearest enemy in range
  - [ ] Enemies take damage and die

- [ ] **Basic Waves**
  - [ ] Create `js/game/Wave.js` — spawn timing and composition
  - [ ] Define waves in `js/data/waves.json` (night 1-3)
  - [ ] Enemies spawn from map edges
  - [ ] Create `tests/test_combat.html` — tower vs enemy demo

**Definition of Done:** Towers shoot enemies, enemies die, waves spawn, test passes

---

## Phase 5: Day/Night Cycle (Days 11-13)
**Goal:** Full game loop operational

### Task List
- [ ] **Cycle Manager**
  - [ ] Create `js/game/DayNight.js` — phase transitions, timers
  - [ ] Dawn: resource collection, building phase
  - [ ] Dusk: lock building, reveal spawns
  - [ ] Night: wave spawning, combat active

- [ ] **Game Flow**
  - [ ] Building only allowed during day
  - [ ] Resources collected at dawn from surviving buildings
  - [ ] Destroyed buildings leave rubble, no production
  - [ ] Create `js/ui/WavePreview.js` — upcoming wave display

- [ ] **Victory/Defeat**
  - [ ] Game over if town center destroyed
  - [ ] Victory after surviving all waves
  - [ ] Create `js/ui/GameOver.js` — stats and restart

**Definition of Done:** Full day/night works, buildings destroyed reduce income, win/loss works

---

## Phase 6: Hero System (Days 14-16)
**Goal:** Player-controlled hero with RPG progression

### Task List
- [ ] **Hero Entity**
  - [ ] Create `js/game/Hero.js` — movement, combat, stats
  - [ ] Click-to-move hero during night phase
  - [ ] Hero attacks enemies in melee range
  - [ ] Hero has HP, can die and respawn

- [ ] **Progression**
  - [ ] XP from killing enemies
  - [ ] Level up grants perk points
  - [ ] Create `js/data/perks.json` — damage, health, special abilities
  - [ ] Create `js/ui/PerkSelect.js` — modal perk selection

- [ ] **Hero Integration**
  - [ ] Hero spawns at town center
  - [ ] Hero can block enemy paths (tactical positioning)
  - [ ] Hero death penalty (lose resources or delay respawn)

**Definition of Done:** Hero moves, fights, levels up, perks work, affects combat

---

## Phase 7: Polish & Balance (Days 17-20)
**Goal:** Production-ready game experience

### Task List
- [ ] **Asset Polish**
  - [ ] Generate all 55 assets via AI Studio
  - [ ] Consistent 32×32 pixel art style
  - [ ] Visual effects for projectiles and impacts
  - [ ] Death animations and building destruction

- [ ] **Game Balance**
  - [ ] Tune all values in JSON files
  - [ ] Create `docs/BALANCE.md` — spreadsheet of all numbers
  - [ ] Progression curve from night 1-20
  - [ ] Test full playthrough multiple times

- [ ] **Additional Maps**
  - [ ] Create `js/data/maps/valley.json` — chokepoint map
  - [ ] Create `js/data/maps/plains.json` — open field map
  - [ ] Map selection screen

- [ ] **Final Features**
  - [ ] Create `js/ui/Minimap.js` — tactical overview
  - [ ] Sound hooks (no audio files, just event structure)
  - [ ] Save/load game state to localStorage
  - [ ] High score tracking

**Definition of Done:** Complete playable game, all assets, balanced, multiple maps

---

## Development Rules

### Testing Protocol
- Each phase has a dedicated test page
- Manual test checklist in `tests/checklist.md`
- No phase advancement until current phase passes all tests

### Code Standards
- Vanilla JS, no frameworks
- ES6+ features encouraged (classes, arrow functions, modules)
- JSDoc comments for all public methods
- Constants in `constants.js`, no magic numbers
- Clean separation: data in JSON, logic in JS, styles in CSS

### Asset Pipeline
- AI Studio for all sprite generation
- 32×32 pixel art style, 8-bit color palette
- PNG format, transparent backgrounds
- Consistent lighting and perspective

### Version Control
- Commit at end of each task
- Tag each phase completion
- Keep working game on main branch