## Table of Content

- [Installation](#installation)
- [Features](#features)
- [Acknowledgements](#acknowledgements)



## Installation

### Requirements

- [Forge](https://files.minecraftforge.net/net/minecraftforge/forge/index_1.8.9.html) 
- [ChatTriggers](https://www.chattriggers.com/)

### Actual Installation

1. Download the latest zip-file release from [Release Page](https://github.com/tunatuna1733/TakeshiAddons/releases).
2. Extract the downloaded zip file. You will find the `TakeshiAddons`\* folder inside `TakeshiAddons` folder.
3. Launch minecraft and run `/ct files` command.
4. Copy the folder I said in step 2 (which is marked with \*) and paste it into `modules` folder.
5. Run `/ct load` command.



## Features

- Features with **(HUD) ** is a hud feature. You can customize the location and size of the huds by clicking `HUD -> Edit HUD Location` and drag / scroll.

### Commands

- `/takeshi`: Open settings gui.
- `/takeshi resetloc`: Reset the location of huds in case you lost any of them.
- `/scc`: Print the current scoreboard content to your chat so that you can copy them.
- `/cpp` or `/copypurse`: Copy your current purse to your clipboard.
  - It searches for the scoreboard line which includes `Purse:` or `Piggy:` and copy them.
- `/fst` or `/fishingtimer`: Open fishing timer window which shows your current rod status like `1.5` or `!!!`.
  - This feature is useful if you have multiple monitors and watching youtube or twitch while fishing and you don't want to watch main monitor.
  - You can customize the color and transparency in the settings `Others -> Fishing Timer Background Color`.
- `/ri <name>` or `/rememberinventory <name>`: Save your current inventory content.
  - Once you saved at least one inventory, you will see the checkboxes and buttons while you are in inventory gui.
  - Check the box and it will show the missing items.
- `/addhud` and `/removehud`: Adds or removes tablist hud.
  - This feature allows you to add tablist contents as a hud.
  - Run `/addhud` and select tablist title you want to add.
  - You can turn on the background rectangle thing in the settings `Others -> Tablist HUD Background`.

### Bestiary

- This feature draws box around the mobs you desired.
  - Once you turn on `Bestiary -> Draw mob box`, you will see the `Select mobs` option. Click it and you can choose mobs you want to draw box.
  - You can see the mob box through walls if you turn on the `Mob ESP` settings, but it is considered as a "QoL Feature" so use at your own risk.

### Crimson Isle

#### Ashfang Helper

- Draws boxes around the summons with respective colors and at the location of Ashfang itself even if it is not rendered.
- Also draws beacon beams at the blackholes.

#### Sea Creature Related

- Sea Creature Detector: Detects sea creatures loaded. Actually use at your own risk.
- Jawbus Waypoint: Detect jawbus and draws beacon beam. Use At Your Own Risk.
- Sea Creature Counter (HUD): Shows the number of detected sea creatures.

### Dungeon

- Chest Glitch Coords Checker (HUD): Checks if your current coords are correct to glitch through floor with chest.
- Chest Profit (HUD): Shows estimated profit of the reward chest. You can set prices by your own. (Credit: [laatan](https://sky.shiiyu.moe/stats/laatan/Coconut))
- Ice Spray Notice: Notifies you with sound and title if you hit ice spray to the dragons.
- M7 Terminal waypoints: Draws beacon beams to the terminals based on your class. You can customize color and class.
- Relic waypoint: Draws a beacon beam at the location of the relic and the pedestal based on your class.

### Garden

- Composter Timer (HUD): Shows the remaining time of the composter.
  - You need to enable the composter tablist widget and to see the composter upgrade gui at once.
- Pest Area (HUD): Shows spawned pests as a hud and you can click it to tp to the plot with pests while opening chat.
  - You will see the chunk border like things while holding vacuums.
  - This feature detects pest spawn chat messages so it sometimes doesn't work correctly if you play as a co-op.
- Pest Box: Detects pests and draws boxes around them. You can also enable "see through walls" thing but it's UAYOR.
- Pest Map: Draws garden plot map with pest count and tp function while you are in inventory.
- Pest Title: Draws title when the farming fortune is reduced by pests. Useful for semi-afk farming.
- Spray Title: Draws title when the spray is expired. 
- Spray Timer (HUD): Self-explanatory.

### HUD

- Flare Timer (HUD): Shows active flare.
- Armor HUD (HUD): Shows your current armor.
  - This feature scans your armor every 0.5s to prevent lag so it will take very short time to refresh when you change armor.
- Equipment HUD (HUD): Shows your current equipment.
  - This feature scans your equipment when you open the `/eq` gui so if you are in laggy situation, it sometimes fails to update equipment.
- Reforge HUD (HUD): Shows your currently selected accessory power.
  - Currently this feature fails to refresh selected power when you add power using power stones.
- Inventory HUD (HUD): Shows your current inventory. You can customize the background color and transparency.
- Kick Timer (HUD): Shows time since you kicked out of skyblock.
  - You may be able to reconnect to skyblock after 60s.
- Kuudra Armor HUD (HUD): Shows current stack and timer until losing stack of crimson/terror armor stack.
  - You need to disable sba's feature `Show Crimson Armor Stacks` for this feature to work.
- Last Breath HUD (HUD): Shows how many times you hit last breath. This feature is WIP and maybe inaccurate.
- Lifeline HUD (HUD): Shows whether the lifeline is active or not with your current health.
- Ragnarock Axe Cooldown (HUD): Self-explanatory.
- Reaper Armor Cooldown (HUD): Self-explanatory.
- Soulflow HUD: Actually not needed cuz it can be seen through tablist now.

### Kuudra

- Dropship Timer (HUD): Shows time until dropship explosion and warns you with title.
  - This feature counts the number of seconds instead of detecting the dropship entity, so this feature will work even if you are stunning kuudra or you are too far away from the dropship.
- Energized Chunk Warning: Warns you with sound and title if chunks are near you in p4.
- Kuudra Profit Display: Shows estimated profit of the reward chest. It considers attributes.
- Rend Arrows Count: Idk if it works correctly.

### Mining

- Highlight Powder Chest: Draws boxes around the chest in crystal hollows.

### Others

- Debug Mode: Shows some kind of debug things.
- Feeder Timer (HUD): Shows the cooldown of Caducous Feeder. WIP



## Acknowledgements

- Huge thanks to testers:
  - [laatan](https://sky.shiiyu.moe/stats/laatan/Coconut)
  - [Az_001](https://sky.shiiyu.moe/stats/Az_001/Coconut)
  - [YOASOBI](https://sky.shiiyu.moe/stats/YOASOBI/Coconut)
  - [LoveForYou](https://sky.shiiyu.moe/stats/LoveForYou/Coconut)
  - [Songiam](https://sky.shiiyu.moe/stats/Songiam/Lemon)
  - [WhiteMayFly](https://sky.shiiyu.moe/stats/WhiteMayfly/Pomegranate)
- A lot of module creators and incredible people in [ChatTriggers Discord](https://discord.com/invite/ChatTriggers).