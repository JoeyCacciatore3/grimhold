# Grimhold — Game Design Document

## 1. Overview

**Title:** Grimhold
**Genre:** RPG Town Builder / Tower Defense Hybrid
**Platform:** Web (HTML5 Canvas)
**Perspective:** Top-down, 2D pixel art
**Tech:** Vanilla JavaScript + Canvas API, no framework
**Target:** Browser-playable, single player

### Elevator Pitch
Build your town by day. Defend it by night. Every building you place produces resources AND shapes your defense. Lose buildings to enemy waves and your economy crumbles. Snowball up or spiral down — the town IS the defense.

### Inspirations
- **Thronefall** — minimalist build-by-day/defend-by-night loop
- **They Are Billions** — survival colony defense against massive hordes
- **Kingdom Rush** — polished tower defense with hero RPG elements
- **Mindustry** — resource chains feeding into defense systems
- **Diplomacy is Not an Option** — city builder meets wave survival

### What Makes Grimhold Different
The town and the defense are the same thing. There's no "build phase" and "defense phase" with separate systems. Your blacksmith produces swords AND acts as a chokepoint. Your walls are buildings that block pathing. Every placement is both an economic and tactical decision.

---

## 2. Core Game Loop

```
DAWN (Planning Phase)
  → Survey resources
  → Place/upgrade buildings on grid
  → Position hero unit
  → Review wave preview (what's coming tonight)

DUSK (Transition)
  → Building phase locks
  → Enemy spawn points revealed
  → Towers activate

NIGHT (Defense Phase)
  → Enemies spawn in waves from map edges
  → Towers auto-attack within range
  → Hero unit is player-controlled (click to move/attack)
  → Destroyed buildings are lost (rubble remains)

DAWN (Recovery)
  → Collect resources from surviving buildings
  → Repair or replace destroyed buildings
  → Advance to next day
```

### Session Length
- One full day/night cycle: ~3-5 minutes
- Full game (survive 20 nights): ~60-90 minutes
- Endless mode: play until you fall

---

## 3. Grid & Map System

### Grid
- **Tile size:** 32×32 pixels
- **Map size:** 40×30 tiles (1280×960 logical pixels)
- **Tile types:**
  - Grass (buildable)
  - Dirt path (enemy pathing preference, buildable)
  - Water (impassable, not buildable)
  - Stone (not buildable, can be mined for resources)
  - Forest (not buildable, can be chopped for wood)
  - Mountain (impassable, natural chokepoint)

### Camera
- Viewport shows portion of map
- WASD or edge-scroll to pan
- Mouse wheel to zoom (2 levels: normal, zoomed out)
- Minimap in corner showing full map with fog of war

### Pathing
- Enemies use A* pathfinding from spawn points to town center
- Buildings block paths — strategic wall placement can create mazes
- If all paths are blocked, enemies attack nearest building
- Flying enemies ignore pathing (late game only)

---

## 4. Resource System

| Resource | Source | Used For |
|----------|--------|----------|
| **Gold** | Market, taxes from houses | Hiring, upgrades, hero gear |
| **Wood** | Lumber mill (near forest tiles) | Basic buildings, repairs |
| **Stone** | Quarry (near stone tiles) | Walls, advanced buildings |
| **Food** | Farm (on grass tiles) | Population cap (more houses) |
| **Iron** | Blacksmith (requires stone input) | Towers, weapons, armor |

### Resource Flow
- Resources generate at dawn based on surviving buildings
- Each building has an upkeep cost (food/gold)
- Destroyed buildings produce nothing — death spiral if too many lost
- Resources carry over between days (no cap)

---

## 5. Buildings

### Tier 1 — Basic (Available Day 1)

| Building | Cost | Produces | Defense Role | HP |
|----------|------|----------|--------------|-----|
| **Town Center** | Free (starting) | — | Must survive (game over if destroyed) | 500 |
| **House** | 20 Wood | +2 Gold/day, +2 Pop | None (must protect) | 100 |
| **Farm** | 15 Wood | +3 Food/day | None | 80 |
| **Lumber Mill** | 25 Wood | +4 Wood/day (near forest) | None | 120 |
| **Wall** | 10 Stone | — | Blocks pathing, high HP | 300 |
| **Watchtower** | 30 Wood, 10 Stone | — | Archer tower, 4 tile range | 150 |

### Tier 2 — Advanced (Unlocked Day 5)

| Building | Cost | Produces | Defense Role | HP |
|----------|------|----------|--------------|-----|
| **Quarry** | 30 Wood | +3 Stone/day (near stone) | None | 120 |
| **Blacksmith** | 40 Wood, 20 Stone | +2 Iron/day | Upgrades tower damage | 150 |
| **Market** | 50 Wood, 30 Gold | +8 Gold/day | None | 100 |
| **Barracks** | 40 Wood, 20 Stone | Spawns militia during night | 2 militia auto-defend | 200 |
| **Gate** | 15 Stone, 5 Iron | — | Opens for hero, blocks enemies | 250 |

### Tier 3 — Elite (Unlocked Day 10)

| Building | Cost | Produces | Defense Role | HP |
|----------|------|----------|--------------|-----|
| **Mage Tower** | 50 Stone, 30 Iron | — | AoE magic attack, 3 tile range | 200 |
| **Ballista** | 40 Stone, 20 Iron | — | High damage single target, 6 tile range | 150 |
| **Reinforced Wall** | 30 Stone, 10 Iron | — | Double HP wall | 600 |
| **Temple** | 80 Gold, 40 Stone | Heals nearby buildings | Slow regen in 3 tile radius | 250 |
| **Tavern** | 60 Gold, 30 Wood | +Hero XP bonus | Attracts mercenaries (random units) | 120 |

### Building Rules
- Buildings snap to grid (1×1 tile each)
- Cannot overlap
- Must be placed on valid terrain
- Some buildings require adjacency (lumber mill near forest, quarry near stone)
- Buildings can be demolished during day phase (50% resource refund)
- Destroyed buildings leave rubble (must clear before rebuilding, costs 5 gold)

---

## 6. Tower & Defense Mechanics

### Tower Behavior
- Towers auto-target nearest enemy in range
- Attack speed and damage defined per tower type
- Towers can be upgraded (3 levels each) at the blacksmith

| Tower | Range | Damage | Attack Speed | Special |
|-------|-------|--------|-------------|---------|
| Watchtower | 4 tiles | 10 | 1.0/sec | — |
| Mage Tower | 3 tiles | 8 | 0.7/sec | AoE splash (1 tile radius) |
| Ballista | 6 tiles | 30 | 0.3/sec | Piercing (hits 3 enemies in line) |

### Upgrade Costs (per level)
- Level 2: +50% stats, costs 10 Iron + 20 Gold
- Level 3: +100% stats, costs 25 Iron + 50 Gold

### Militia (from Barracks)
- Auto-spawns 2 militia at night
- Militia patrol around barracks (2 tile radius)
- 30 HP, 5 damage, 1.0 attack speed
- Die at dawn if surviving (they're conscripts, not permanent)

---

## 7. Enemy System

### Wave Structure
- **Night 1-3:** Tutorial waves (goblins only, single spawn point)
- **Night 4-7:** Two spawn points, introduce skeletons
- **Night 8-12:** Three spawn points, introduce orcs, larger waves
- **Night 13-16:** Four spawn points, introduce shamans (healers)
- **Night 17-19:** Mixed waves, siege enemies (damage buildings)
- **Night 20:** Boss wave (final stand)
- **Endless mode:** Scales infinitely with random composition

### Enemy Types

| Enemy | HP | Damage | Speed | Special |
|-------|-----|--------|-------|---------|
| **Goblin** | 20 | 5 | Fast (1.5) | — |
| **Skeleton** | 40 | 8 | Normal (1.0) | — |
| **Orc** | 80 | 15 | Slow (0.6) | High building damage |
| **Shaman** | 30 | 3 | Normal (1.0) | Heals nearby enemies |
| **Bat** | 15 | 4 | Fast (2.0) | Flying (ignores walls) |
| **Troll** | 200 | 25 | Very slow (0.3) | Siege: 3× damage to buildings |
| **Dark Knight** | 150 | 20 | Normal (1.0) | Armor: 50% damage reduction |
| **Boss: Warlord** | 1000 | 40 | Slow (0.5) | Spawns goblins, AoE stomp |

### Wave Preview
- At dawn, UI shows icons of what's coming tonight
- Shows spawn direction(s)
- Player can plan placement accordingly

---

## 8. Hero System

### Hero Unit
- Player-controlled unit on the field
- Click to move (pathfinds around buildings)
- Auto-attacks nearest enemy when in range (1 tile melee)
- Cannot die permanently — knocked out for rest of night if HP reaches 0

### Hero Stats
| Stat | Base | Per Level |
|------|------|-----------|
| HP | 100 | +15 |
| Damage | 12 | +3 |
| Attack Speed | 1.2/sec | — |
| Move Speed | 1.5 | — |
| Range | 1 tile (melee) | — |

### Leveling
- Gains XP from enemy kills
- XP required doubles each level
- Max level: 15
- Each level: choose 1 of 2 random perks

### Perk Examples
- **Cleave:** Attacks hit all adjacent enemies
- **Fortify:** Nearby buildings take 25% less damage
- **Haste:** +30% move speed
- **Lifesteal:** Heal 20% of damage dealt
- **War Cry:** Militia deal +50% damage
- **Mend:** Repair 5 HP to nearest building per kill
- **Iron Skin:** +30% HP
- **Gold Rush:** Enemies drop 2× gold

---

## 9. Economy Balance Targets

### Early Game (Day 1-4)
- Start with: Town Center, 50 Wood, 20 Stone, 30 Gold, 10 Food
- Can afford ~3-4 buildings per day
- Waves are survivable with 1-2 watchtowers

### Mid Game (Day 5-12)
- Resource generation should support 2-3 buildings OR upgrades per day
- Must choose between economy buildings and defense
- First real "do I expand or fortify?" decisions

### Late Game (Day 13-20)
- Economy should be strong enough for 1 elite building per day
- Waves are large enough to threaten even well-defended towns
- Hero perks become the difference-maker

### Death Spiral Prevention
- If player loses >50% of buildings, next wave is slightly reduced (mercy mechanic)
- Rubble clearing is cheap (5 gold) to allow rebuilding
- Hero always revives — you're never fully helpless

---

## 10. UI/HUD Design

### Day Phase HUD
```
┌─────────────────────────────────────────────┐
│  🪵 120  🪨 45  🪙 230  🍖 18  ⚔️ 12      │  ← Resource bar (top)
│                                             │
│                                             │
│                    MAP                      │
│                                             │
│                                             │
│  [Build Menu]  [Upgrade]  [Demolish]        │  ← Action bar (bottom)
│  Day 7 ☀️           [End Day →]              │
└─────────────────────────────────────────────┘
```

### Night Phase HUD
```
┌─────────────────────────────────────────────┐
│  Wave 7/20  🧟 42 remaining   Hero HP ████░ │  ← Wave info (top)
│                                             │
│                    MAP                      │
│             (enemies moving)                │
│             (towers firing)                 │
│             (hero fighting)                 │
│                                             │
│  Hero LVL 5  XP ██████░░  Perks: ⚔️🛡️      │  ← Hero bar (bottom)
└─────────────────────────────────────────────┘
```

### Build Menu
- Grid of building icons with tooltips
- Greyed out if insufficient resources
- Tier-locked buildings show lock icon until unlocked
- Hover shows placement preview on map (green = valid, red = invalid)

### Minimap
- Bottom-right corner, 150×112px
- Shows buildings (blue), enemies (red), hero (yellow)
- Click to pan camera

---

## 11. Visual Style Guide

### Art Direction
- **Style:** Pixel art, 32×32 tiles, limited palette
- **Palette:** Earthy tones (grass, dirt, stone) with vibrant accents for buildings and enemies
- **Inspiration:** Thronefall's simplicity meets Kingdom Rush's polish
- **Readability priority:** Every element identifiable at a glance

### Color Language
| Element | Color |
|---------|-------|
| Grass | #4a7c3f |
| Dirt/Path | #a0784a |
| Water | #3d6fb4 |
| Stone | #8a8a8a |
| Player buildings | Warm browns/oranges |
| Walls | Grey stone |
| Towers | Blue/purple accent |
| Enemies | Red/dark green |
| Hero | Gold/white |
| UI | Dark panel (#1a1a2e) with gold text (#f0d060) |

### Pixel Art Constraints
- All sprites: 32×32 or 64×64 for bosses
- Max 16 colors per sprite
- No anti-aliasing — clean pixel edges
- Consistent light source: top-left
- All assets are static for v1 (no animation)

---

## 12. Audio Design (v2+)

*Audio is deferred to v2. Game will be silent in v1.*

### Planned
- Ambient day music (calm, building)
- Ambient night music (tense, percussion)
- Tower attack sounds (arrow, magic, ballista)
- Enemy death sounds
- Building placement sound
- Wave horn sound (transition to night)
- UI click sounds

---

## 13. Technical Architecture

### Engine Architecture
- **No framework** — vanilla JS + Canvas2D
- **Game loop:** requestAnimationFrame, fixed timestep (60 FPS target)
- **State machine:** MENU → PLAYING_DAY → TRANSITION → PLAYING_NIGHT → DAWN → PLAYING_DAY...
- **Entity system:** Simple component-based (not full ECS — overkill for this scope)

### Module Structure
```
js/
  engine/
    Game.js          — Main game loop, state machine
    Renderer.js      — Canvas rendering, camera, viewport
    Input.js         — Mouse/keyboard handling
    Grid.js          — Tile grid, coordinates, adjacency
    Pathfinder.js    — A* pathfinding on grid
    Audio.js         — Sound manager (v2)

  game/
    Map.js           — Map generation, terrain
    Building.js      — Building definitions, placement logic
    Tower.js         — Tower targeting, projectiles
    Enemy.js         — Enemy types, movement, AI
    Wave.js          — Wave composition, spawning
    Hero.js          — Hero movement, combat, leveling
    Resources.js     — Resource tracking, production
    Economy.js       — Cost validation, transactions

  ui/
    HUD.js           — Resource bar, day counter, wave info
    BuildMenu.js     — Building selection panel
    Tooltip.js       — Hover info for buildings/enemies
    Minimap.js       — Minimap renderer
    GameOver.js      — End screen with stats
    PerkSelect.js    — Hero level-up perk choice

  data/
    buildings.json   — All building definitions
    enemies.json     — All enemy definitions
    waves.json       — Wave composition per night
    perks.json       — Hero perk definitions
    maps.json        — Map layouts (terrain data)
```

### Rendering Layers (back to front)
1. Terrain tiles
2. Building shadows
3. Buildings
4. Ground enemies
5. Projectiles
6. Flying enemies
7. Hero
8. Damage numbers / effects
9. UI overlay

### Save System (v2)
- localStorage for current run state
- Save at dawn (between days)
- Auto-save only — no manual save slots for v1

---

## 14. Development Phases

### Phase 1: Foundation (Section 1)
- [ ] Project scaffolding, HTML/CSS/JS structure
- [ ] Canvas setup, game loop (requestAnimationFrame)
- [ ] Tile grid rendering (32×32, colored rectangles)
- [ ] Camera pan (WASD) and viewport
- [ ] Mouse-to-grid coordinate mapping
- [ ] Grid click detection

**Testable output:** Colored grid you can scroll around, clicking tiles highlights them.

### Phase 2: Town Building (Section 2)
- [ ] Resource system (track wood, stone, gold, food, iron)
- [ ] Building definitions (data-driven from JSON)
- [ ] Build menu UI (select building, see cost)
- [ ] Placement validation (terrain, overlap, adjacency)
- [ ] Place buildings on grid
- [ ] Demolish buildings (refund)
- [ ] Resource production at dawn
- [ ] Day counter, "End Day" button

**Testable output:** Place buildings, see resources change, advance days.

### Phase 3: Tower Defense Core (Section 3)
- [ ] A* pathfinding on grid
- [ ] Enemy spawning from map edges
- [ ] Enemy movement along path
- [ ] Tower targeting (nearest in range)
- [ ] Projectile system (travel from tower to enemy)
- [ ] Enemy HP / death
- [ ] Building damage when enemies reach them
- [ ] Wave system (start night, enemies spawn, night ends when all dead)
- [ ] Day/night state machine

**Testable output:** Full day/night loop. Build towers, enemies attack, towers defend.

### Phase 4: Hero & RPG (Section 4)
- [ ] Hero entity on map
- [ ] Click-to-move with pathfinding
- [ ] Hero auto-attack in range
- [ ] Hero HP, knockout, revive at dawn
- [ ] XP system, level up
- [ ] Perk selection UI (choose 1 of 2)
- [ ] Perk effects applied to hero/buildings

**Testable output:** Control hero during night, gain levels, choose perks.

### Phase 5: Content & Balance (Section 5)
- [ ] All 15 building types implemented
- [ ] All 8 enemy types implemented
- [ ] 20 night wave compositions
- [ ] Tier unlock system (buildings unlock at day thresholds)
- [ ] Balance pass: resource costs, enemy HP, tower damage
- [ ] Wave preview UI
- [ ] Minimap
- [ ] Game over screen with stats

**Testable output:** Full 20-night game playable start to finish.

### Phase 6: Art Pass (Section 6)
- [ ] Generate all terrain tiles (AI Studio)
- [ ] Generate all building sprites
- [ ] Generate all enemy sprites
- [ ] Generate UI elements
- [ ] Generate hero sprite
- [ ] Replace colored rectangles with pixel art
- [ ] Particle effects (tower shots, explosions, gold pickup)

**Testable output:** Visually polished game.

### Phase 7: Polish (Section 7)
- [ ] Audio (v2)
- [ ] Screen shake on big hits
- [ ] Floating damage numbers
- [ ] Building construction animation (instant but with dust poof)
- [ ] Tutorial overlay for first 3 nights
- [ ] Endless mode
- [ ] Save/load (localStorage)
- [ ] Performance optimization

---

## 15. Testing Strategy

### Per-Phase Testing
Each phase has specific test criteria before moving to next.

### Unit Tests (manual verification checklist)
- Grid coordinates map correctly to screen pixels
- Buildings cannot be placed on invalid terrain
- Resource costs are deducted correctly
- Pathfinding finds valid path around buildings
- Towers only target enemies in range
- Enemy damage is applied to buildings correctly
- Hero XP calculation is correct
- Wave composition matches data file
- All perks apply their effects

### Integration Tests
- Full day/night cycle runs without errors
- Building destruction properly removes resource production
- Pathfinding recalculates when buildings placed/destroyed
- Hero perks affect gameplay as described
- Game over triggers when Town Center is destroyed
- 20-night game completable with good strategy

### Performance Targets
- 60 FPS with 100 enemies on screen
- 60 FPS with 50 buildings placed
- No memory leaks across 20+ day/night cycles
- Map rendering < 2ms per frame

### Balance Testing
- Night 1-3 survivable with minimal strategy
- Night 10 requires deliberate planning
- Night 20 requires optimized play
- No single dominant strategy (tower spam, wall maze, etc.)
- Hero should contribute ~20-30% of total damage
