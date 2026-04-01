# Grimhold — Style Bible

## Identity

**Name:** Grimhold
**Tagline:** *Hold your grim little town against the dark.*
**Tone:** Dark fantasy survival. Not grimdark edgelord — more like a campfire in hostile woods. There's warmth here, but it's surrounded by cold.

## Color Palette

### Primary Palette (8 colors)

| Name | Hex | Use |
|------|-----|-----|
| **Hearthfire** | `#d4874a` | Warm buildings, torchlight, UI accents |
| **Iron** | `#6b6b7a` | Stone, walls, weapons, secondary UI |
| **Verdant** | `#3e6b3a` | Grass, forests, life |
| **Loam** | `#7a5c3a` | Dirt, paths, wood |
| **Shadow** | `#1a1a2e` | Night sky, UI panels, deep shadows |
| **Bone** | `#d4c9a8` | Text, highlights, enemy skeletons |
| **Blood** | `#8a2b2b` | Enemy accents, damage, danger |
| **Moonlight** | `#8a9bb5` | Water, cold areas, night atmosphere |

### Extended Palette (situational)

| Name | Hex | Use |
|------|-----|-----|
| **Forge** | `#c45a2a` | Fire, explosions, blacksmith |
| **Arcane** | `#6a4c93` | Mage tower, magic projectiles |
| **Gold** | `#e8c84a` | Currency, XP, hero, rewards |
| **Sickgreen** | `#5a7a3a` | Enemy shamans, poison, corruption |
| **Deep Night** | `#0e0e1a` | Darkest shadow, void |
| **Ash** | `#4a4a52` | Rubble, destroyed buildings |

### Day/Night Shift
- **Day:** Full palette. Verdant grass, warm buildings, blue sky tint
- **Dusk transition:** Desaturate 20%, shift toward orange/amber
- **Night:** Overlay entire scene with `rgba(10, 10, 30, 0.35)`. Buildings with torches emit warm `#d4874a` glow radius (2 tile circle). Everything beyond glow is muted.

## Typography

### In-Game Text
- **Font:** Pixel font — use a bitmap font rendered on canvas (no web fonts)
- **Sizes:** 
  - HUD numbers: 8px
  - Building names: 6px  
  - Damage numbers: 10px (bold, float upward)
  - Day/Wave announcements: 16px (centered, fade in/out)
- **Colors:**
  - Default text: `#d4c9a8` (Bone)
  - Resource numbers: `#e8c84a` (Gold)
  - Damage dealt: `#d4874a` (Hearthfire)
  - Damage taken: `#8a2b2b` (Blood)
  - Healing: `#3e6b3a` (Verdant)

### UI Text Style
- ALL CAPS for headers and announcements
- Mixed case for descriptions and tooltips
- No serif fonts. Clean, readable pixel type.

## Pixel Art Rules

### Grid
- **Tile size:** 32×32 pixels
- **Max colors per sprite:** 12 (from the palette above)
- **Outline:** 1px dark outline on all sprites (`#1a1a2e` or darkened version of base color)
- **No anti-aliasing.** Clean pixel edges only.
- **Light source:** Top-left, consistent across ALL sprites
- **Shadow:** Bottom-right of every sprite, 1-2px, using darkened base

### Terrain Style
- Grass: Textured with 2-3 shades of Verdant. Subtle variation, no repeating pattern obvious at tile boundaries.
- Dirt: Warm Loam with darker cracks/texture. Should read as "well-traveled."
- Water: 2 shades of Moonlight with subtle highlight spots. Still water, no animation v1.
- Stone deposits: Iron grey with lighter quartz-like flecks.
- Forest: Dense canopy, dark Verdant base with lighter leaf tops. Should feel thick and old.
- Mountain: Layered dark grey/Iron with snow-white peaks. Clearly impassable.

### Building Style
- **Silhouette first.** Every building must be identifiable by shape alone at 32×32.
- **Material language:**
  - Wood buildings (Tier 1): Warm brown (Loam) with visible plank lines
  - Stone buildings (Tier 2): Iron grey with mortar lines
  - Elite buildings (Tier 3): Stone + metal accents (Iron + Hearthfire trim)
- **Roofs:** Angled, darker than walls. Slight color variation per building for identity.
- **Details:** 
  - Houses: chimney with smoke pixel
  - Farms: small crop rows visible
  - Towers: elevated platform with visible weapon
  - Walls: battlements (crenellations) on top edge
- **Torches/Windows:** Small Hearthfire pixels on night-active buildings. This is how players read "alive" vs "destroyed."

### Enemy Style
- **Color language:** All enemies use Blood + Sickgreen + Shadow palette. NEVER Hearthfire (that's the player's color).
- **Shape language:**
  - Goblins: small, hunched, pointy
  - Skeletons: angular, gaps in body
  - Orcs: wide, blocky, heavy
  - Shamans: floaty, staff with glow
  - Bats: diamond wing shape
  - Trolls: massive, fills most of the 32×32
  - Dark Knights: armored, human-shaped but wrong proportions
  - Boss: 64×64, imposing, darker than everything else
- **Eyes:** Every enemy has visible glowing eyes (2 pixels, Bone or Sickgreen). This is the visual hook — you see the eyes first.

### Hero Style
- **Stands out from everything.** Gold (`#e8c84a`) accent on armor/weapon.
- **Warm palette** — Hearthfire + Gold + Bone. The hero IS the hearth's champion.
- **Readable facing direction** even at 32×32 (asymmetric weapon hand).

### Projectile Style
- **Arrow:** 2-3px diagonal line, Loam colored
- **Magic bolt:** Small orb, Arcane purple with 1px glow
- **Ballista bolt:** 4px horizontal line, Iron colored with Hearthfire tip

### UI Style
- **Panels:** Dark (`#1a1a2e`) with 1px border (`#6b6b7a`). Slight inner gradient (lighter at top).
- **Buttons:** Iron background, Bone text. Hover: Hearthfire border glow.
- **Icons:** 16×16, same pixel rules as game sprites
- **Resource bar:** Horizontal strip at top, semi-transparent panel
- **Build menu:** Vertical panel on right side, grid of building icons
- **Health bars:** 
  - Player/buildings: Verdant green fill
  - Enemies: Blood red fill
  - Frame: 1px Iron border
- **Selected building highlight:** Pulsing 1px Hearthfire border around tile

## Atmosphere & Mood

### Day Phase
- Calm. Constructive. Strategic.
- Full color, warm lighting
- UI emphasis on building options and resources
- Feels like: morning in a frontier town

### Dusk Transition
- Brief (2-3 seconds). Sky shifts from light to orange to deep blue.
- "NIGHT 7" text fades in, center screen, large font
- Tension builds. Enemy spawn direction indicators appear.

### Night Phase
- Dark overlay on map. Vision limited to torch radius around buildings.
- UI shifts to combat info (wave counter, enemy count, hero HP)
- Enemy eyes visible in the dark before they reach the light
- Tower projectiles create brief light flashes
- Feels like: defending a campfire from the woods

### Dawn
- Slow brightening. Night overlay fades.
- Resource collection happens (gold coins float to HUD)
- Destroyed buildings smolder briefly
- "DAWN — DAY 8" text
- Feels like: relief, assessment, planning

## Sound Direction (v2, for reference)

- **Day:** Ambient birds, distant hammer, gentle wind
- **Dusk:** Drums begin, low horn
- **Night:** Percussion-driven, tense strings, enemy growls
- **Dawn:** Horn call, birds return, calm
- **Attacks:** Thud (melee), whoosh (arrow), shimmer (magic), crunch (ballista)
- **Building placed:** Wooden thunk + brief construction rattle

## Logo

- **Font style:** Heavy, angular, stone-carved feel
- **G and H** slightly larger than other letters
- **Color:** Bone text with Hearthfire inner glow, Shadow drop shadow
- **Subtitle:** "Hold your grim little town against the dark." in smaller Bone text below

## Reference Games (Visual)

- **Thronefall** — Minimalist but readable. Strong silhouettes.
- **Kingdom Rush** — Rich detail in small sprites. Every tower distinct.
- **Dungeon Keeper pixel art** — Dark palette, warm light sources in dark environments
- **Into the Breach** — Grid clarity. You always know what's happening.
