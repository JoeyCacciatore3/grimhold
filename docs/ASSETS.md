# Grimhold — Complete Asset List

All assets are 32×32 pixel art unless noted. Static sprites for v1 (no animation).

## Terrain Tiles (10 assets)

| # | Asset | File | Description |
|---|-------|------|-------------|
| 1 | Grass | `tiles/grass.png` | Default buildable tile, green |
| 2 | Grass variant | `tiles/grass_v2.png` | Slightly different grass for variety |
| 3 | Dirt path | `tiles/dirt.png` | Brown path, enemy pathing preference |
| 4 | Dirt path corner | `tiles/dirt_corner.png` | Path corner piece |
| 5 | Water | `tiles/water.png` | Blue, impassable |
| 6 | Stone deposit | `tiles/stone.png` | Grey rock, minable resource |
| 7 | Forest | `tiles/forest.png` | Trees, choppable resource |
| 8 | Mountain | `tiles/mountain.png` | Impassable terrain |
| 9 | Rubble | `tiles/rubble.png` | Destroyed building remains |
| 10 | Town center ground | `tiles/town_center_ground.png` | Special tile under TC |

## Building Sprites (15 assets)

| # | Asset | File | Size | Tier |
|---|-------|------|------|------|
| 1 | Town Center | `buildings/town_center.png` | 32×32 | — |
| 2 | House | `buildings/house.png` | 32×32 | T1 |
| 3 | Farm | `buildings/farm.png` | 32×32 | T1 |
| 4 | Lumber Mill | `buildings/lumber_mill.png` | 32×32 | T1 |
| 5 | Wall | `buildings/wall.png` | 32×32 | T1 |
| 6 | Watchtower | `buildings/watchtower.png` | 32×32 | T1 |
| 7 | Quarry | `buildings/quarry.png` | 32×32 | T2 |
| 8 | Blacksmith | `buildings/blacksmith.png` | 32×32 | T2 |
| 9 | Market | `buildings/market.png` | 32×32 | T2 |
| 10 | Barracks | `buildings/barracks.png` | 32×32 | T2 |
| 11 | Gate | `buildings/gate.png` | 32×32 | T2 |
| 12 | Mage Tower | `buildings/mage_tower.png` | 32×32 | T3 |
| 13 | Ballista | `buildings/ballista.png` | 32×32 | T3 |
| 14 | Reinforced Wall | `buildings/reinforced_wall.png` | 32×32 | T3 |
| 15 | Temple | `buildings/temple.png` | 32×32 | T3 |
| 16 | Tavern | `buildings/tavern.png` | 32×32 | T3 |

## Enemy Sprites (9 assets)

| # | Asset | File | Size |
|---|-------|------|------|
| 1 | Goblin | `enemies/goblin.png` | 32×32 |
| 2 | Skeleton | `enemies/skeleton.png` | 32×32 |
| 3 | Orc | `enemies/orc.png` | 32×32 |
| 4 | Shaman | `enemies/shaman.png` | 32×32 |
| 5 | Bat | `enemies/bat.png` | 32×32 |
| 6 | Troll | `enemies/troll.png` | 32×32 |
| 7 | Dark Knight | `enemies/dark_knight.png` | 32×32 |
| 8 | Boss: Warlord | `enemies/warlord.png` | 64×64 |
| 9 | Militia | `enemies/militia.png` | 32×32 |

## Hero Sprites (1 asset for v1)

| # | Asset | File | Size |
|---|-------|------|------|
| 1 | Hero (standing) | `hero/hero.png` | 32×32 |

## Projectile Sprites (3 assets)

| # | Asset | File | Size |
|---|-------|------|------|
| 1 | Arrow | `fx/arrow.png` | 8×8 |
| 2 | Magic bolt | `fx/magic_bolt.png` | 8×8 |
| 3 | Ballista bolt | `fx/ballista_bolt.png` | 16×4 |

## Effect Sprites (4 assets)

| # | Asset | File | Size |
|---|-------|------|------|
| 1 | Explosion (magic) | `fx/explosion_magic.png` | 32×32 |
| 2 | Dust poof (build) | `fx/dust_poof.png` | 32×32 |
| 3 | Hit spark | `fx/hit_spark.png` | 16×16 |
| 4 | Heal glow | `fx/heal_glow.png` | 32×32 |

## UI Assets (12 assets)

| # | Asset | File | Description |
|---|-------|------|-------------|
| 1 | Resource: Wood | `ui/icon_wood.png` | 16×16 icon |
| 2 | Resource: Stone | `ui/icon_stone.png` | 16×16 icon |
| 3 | Resource: Gold | `ui/icon_gold.png` | 16×16 icon |
| 4 | Resource: Food | `ui/icon_food.png` | 16×16 icon |
| 5 | Resource: Iron | `ui/icon_iron.png` | 16×16 icon |
| 6 | Button: End Day | `ui/btn_end_day.png` | 120×32 |
| 7 | Button: Build | `ui/btn_build.png` | 80×32 |
| 8 | Button: Demolish | `ui/btn_demolish.png` | 80×32 |
| 9 | Panel: Build menu BG | `ui/panel_build.png` | 9-slice panel |
| 10 | Panel: HUD BG | `ui/panel_hud.png` | 9-slice panel |
| 11 | HP bar frame | `ui/hp_bar_frame.png` | 32×6 |
| 12 | XP bar frame | `ui/xp_bar_frame.png` | 100×8 |

## Total Asset Count

| Category | Count |
|----------|-------|
| Terrain | 10 |
| Buildings | 16 |
| Enemies | 9 |
| Hero | 1 |
| Projectiles | 3 |
| Effects | 4 |
| UI | 12 |
| **Total** | **55** |

## Generation Notes

- All game sprites generated via AI Studio (ComfyUI + ZImage)
- UI elements can be hand-coded or generated
- Terrain tiles should be seamlessly tileable
- Buildings should read clearly at 32×32 — strong silhouettes
- Enemies need distinct silhouettes to identify type at a glance
- Consistent top-left lighting across all sprites
- Limited palette: max 16 colors per sprite
- Transparency: all sprites on transparent background (RGBA)
