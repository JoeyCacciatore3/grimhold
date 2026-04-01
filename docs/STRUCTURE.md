# Grimhold — File Structure

```
grimhold/
├── index.html                    ← Entry point, loads all JS
├── css/
│   └── style.css                 ← Full-screen canvas, UI overlay styles
│
├── js/
│   ├── engine/
│   │   ├── Game.js               ← Main loop, state machine, init
│   │   ├── Renderer.js           ← Canvas2D rendering, camera, viewport
│   │   ├── Input.js              ← Mouse/keyboard events, grid coords
│   │   ├── Grid.js               ← Tile grid data, queries, adjacency
│   │   ├── Pathfinder.js         ← A* pathfinding on tile grid
│   │   └── AssetLoader.js        ← Image preloader, sprite cache
│   │
│   ├── game/
│   │   ├── Map.js                ← Map terrain generation/loading
│   │   ├── Building.js           ← Building placement, HP, production
│   │   ├── Tower.js              ← Tower targeting, shooting, upgrades
│   │   ├── Enemy.js              ← Enemy entity, movement, HP, damage
│   │   ├── Wave.js               ← Wave spawner, composition, timing
│   │   ├── Hero.js               ← Hero movement, combat, XP, perks
│   │   ├── Resources.js          ← Resource bank, production, costs
│   │   ├── Projectile.js         ← Projectile entity, travel, impact
│   │   └── DayNight.js           ← Day/night cycle manager, transitions
│   │
│   ├── ui/
│   │   ├── HUD.js                ← Resource bar, day/wave info
│   │   ├── BuildMenu.js          ← Building selection panel
│   │   ├── Tooltip.js            ← Hover tooltips for entities
│   │   ├── Minimap.js            ← Minimap renderer
│   │   ├── PerkSelect.js         ← Hero perk choice modal
│   │   ├── WavePreview.js        ← Upcoming wave display
│   │   └── GameOver.js           ← End screen, stats summary
│   │
│   ├── data/
│   │   ├── buildings.json        ← Building definitions (cost, HP, production)
│   │   ├── enemies.json          ← Enemy definitions (HP, damage, speed)
│   │   ├── waves.json            ← Wave compositions per night
│   │   ├── perks.json            ← Hero perk definitions
│   │   └── maps/
│   │       ├── tutorial.json     ← Beginner map layout
│   │       ├── valley.json       ← Chokepoint-heavy map
│   │       └── plains.json       ← Open map, harder defense
│   │
│   └── utils/
│       ├── constants.js          ← Tile size, colors, game config
│       ├── math.js               ← Distance, lerp, clamp helpers
│       └── events.js             ← Simple event emitter
│
├── assets/
│   ├── tiles/                    ← Terrain sprites (32×32)
│   ├── buildings/                ← Building sprites (32×32)
│   ├── enemies/                  ← Enemy sprites (32×32, boss 64×64)
│   ├── hero/                     ← Hero sprites (32×32)
│   ├── fx/                       ← Projectiles, effects
│   └── ui/                       ← Icons, buttons, panels
│
├── tests/
│   ├── test_grid.html            ← Visual grid test page
│   ├── test_pathfinding.html     ← A* visualization test
│   ├── test_combat.html          ← Tower vs enemy test scene
│   ├── test_economy.html         ← Resource flow test
│   └── checklist.md              ← Manual test checklist per phase
│
├── docs/
│   ├── GDD.md                    ← Game Design Document (this project)
│   ├── ASSETS.md                 ← Complete asset list
│   ├── STRUCTURE.md              ← This file
│   └── BALANCE.md                ← Balance spreadsheet / tuning notes
│
└── README.md                     ← Project overview, how to run
```

## Module Dependency Graph

```
Game.js ─────────────────────────────┐
  ├── Renderer.js                    │
  ├── Input.js                       │
  ├── Grid.js ◄─── Map.js           │
  ├── Pathfinder.js ◄─── Grid.js    │
  ├── AssetLoader.js                 │
  │                                  │
  ├── DayNight.js ◄──┐              │
  │   ├── Resources.js│              │
  │   ├── Wave.js ────┘              │
  │   │   └── Enemy.js               │
  │   │       └── Pathfinder.js      │
  │   ├── Building.js                │
  │   │   └── Tower.js               │
  │   │       └── Projectile.js      │
  │   └── Hero.js                    │
  │                                  │
  └── UI Layer                       │
      ├── HUD.js ◄── Resources.js   │
      ├── BuildMenu.js ◄── Building │
      ├── Minimap.js ◄── Grid.js    │
      ├── WavePreview.js ◄── Wave   │
      ├── PerkSelect.js ◄── Hero    │
      └── GameOver.js                │
```

## Script Loading Order (index.html)

```html
<!-- Utils (no dependencies) -->
<script src="js/utils/constants.js"></script>
<script src="js/utils/math.js"></script>
<script src="js/utils/events.js"></script>

<!-- Engine (depends on utils) -->
<script src="js/engine/AssetLoader.js"></script>
<script src="js/engine/Grid.js"></script>
<script src="js/engine/Pathfinder.js"></script>
<script src="js/engine/Input.js"></script>
<script src="js/engine/Renderer.js"></script>

<!-- Game (depends on engine) -->
<script src="js/game/Resources.js"></script>
<script src="js/game/Map.js"></script>
<script src="js/game/Building.js"></script>
<script src="js/game/Projectile.js"></script>
<script src="js/game/Tower.js"></script>
<script src="js/game/Enemy.js"></script>
<script src="js/game/Wave.js"></script>
<script src="js/game/Hero.js"></script>
<script src="js/game/DayNight.js"></script>

<!-- UI (depends on game) -->
<script src="js/ui/HUD.js"></script>
<script src="js/ui/BuildMenu.js"></script>
<script src="js/ui/Tooltip.js"></script>
<script src="js/ui/Minimap.js"></script>
<script src="js/ui/WavePreview.js"></script>
<script src="js/ui/PerkSelect.js"></script>
<script src="js/ui/GameOver.js"></script>

<!-- Main (depends on everything) -->
<script src="js/engine/Game.js"></script>
```

## How to Run

```bash
cd ~/Desktop/grimhold
python3 -m http.server 8080
# Open http://localhost:8080
```

No build step. No npm. No bundler. Just serve and play.
