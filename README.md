# 🏰 Grimhold

**RPG Town Builder + Tower Defense Hybrid**

Build your town by day. Defend it by night. Every building is both economic and tactical.

🎮 **[Play Live Demo](https://joeycacciatore.github.io/grimhold/)**

## ⚡ Features

- **Hybrid Gameplay:** Town building meets tower defense
- **Strategic Depth:** Every placement matters for economy AND defense
- **Day/Night Cycle:** Build during day, survive the night waves
- **Pure Web Technology:** Vanilla JavaScript + HTML5 Canvas
- **Mobile Friendly:** Touch controls and responsive design

## 🎯 Current Status: Phase 2 Complete

✅ **Foundation** - Grid system, camera, input handling  
✅ **Map & Terrain** - Procedural generation, A* pathfinding  
🚧 **Building System** - Next phase in development  
⏳ **Combat** - Tower targeting and enemy AI  
⏳ **Hero System** - Player-controlled units  
⏳ **Polish** - Full art assets and balance

## 🚀 Quick Start

**Play Online:** https://joeycacciatore.github.io/grimhold/

**Local Development:**
```bash
git clone https://github.com/joeycacciatore/grimhold.git
cd grimhold
python3 -m http.server 8080
# Open http://localhost:8080
```

## 🧪 Test Pages

- **Grid Test:** `tests/test_grid.html` - Foundation systems
- **Pathfinding Test:** `tests/test_pathfinding.html` - A* visualization

## 🎨 Game Design

**Core Loop:** Dawn (build) → Dusk (prepare) → Night (defend) → Dawn (repair)

**Key Mechanics:**
- Buildings block enemy pathing (walls create mazes)
- Resource production funds expansion and upgrades
- Destroyed buildings = economic death spiral
- Hero unit provides tactical flexibility

**Maps:**
- **Grimhold Valley** (Tutorial) - Protected canyon, learn basics
- **Thornwall Canyon** (Intermediate) - Chokepoint defense
- **Windswept Plateau** (Expert) - 360° multi-directional assault

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas2D
- **Architecture:** Modular ES6 imports, event-driven systems
- **Assets:** 32×32 pixel art (AI-generated via Stable Diffusion)
- **Deployment:** GitHub Pages (zero build process)
- **Performance:** 60fps on mobile, optimized rendering

## 📱 Mobile Support

- Touch controls for building placement
- Responsive canvas scaling
- Optimized for portrait and landscape
- Gesture-based camera panning

## 🗺️ Roadmap

See `ROADMAP.md` for detailed development phases and `TASKLIST.md` for current sprint.

**Next Major Milestones:**
- Phase 3: Building placement and resource system
- Phase 4: Combat mechanics and enemy AI  
- Phase 5: Full day/night cycle implementation
- Phase 6: Hero progression and RPG elements
- Phase 7: Art polish and game balance

## 🎮 Inspiration

- **Thronefall** - Minimalist build/defend loop
- **They Are Billions** - Colony survival pressure
- **Kingdom Rush** - Polished tower defense
- **Mindustry** - Resource chains feeding defense

## 📄 License

MIT License - Built as an open source game development learning project.