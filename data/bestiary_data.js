export const ZombieClass = 'net.minecraft.entity.monster.EntityZombie';
export const SkeletonClass = 'net.minecraft.entity.monster.EntitySkeleton';
export const CreeperClass = 'net.minecraft.entity.monster.EntityCreeper';
export const EndermanClass = 'net.minecraft.entity.monster.EntityEnderman';
export const SlimeClass = 'net.minecraft.entity.monster.EntitySlime';
export const MagmaCubeClass = 'net.minecraft.entity.monster.EntityMagmaCube';
export const SpiderClass = 'net.minecraft.entity.monster.EntitySpider';
export const CaveSpiderClass = 'net.minecraft.entity.monster.EntityCaveSpider';
export const WitchClass = 'net.minecraft.entity.monster.EntityWitch';
export const SilverfishClass = 'net.minecraft.entity.monster.EntitySilverfish';
export const BlazeClass = 'net.minecraft.entity.monster.EntityBlaze';
export const EndermiteClass = 'net.minecraft.entity.monster.EntityEndermite';
export const PigmanClass = 'net.minecraft.entity.monster.EntityPigZombie';
export const IronGolemClass = 'net.minecraft.entity.monster.EntityIronGolem';

export const WolfClass = 'net.minecraft.entity.passive.EntityWolf';
export const ChickenClass = 'net.minecraft.entity.passive.EntityChicken';
export const CowClass = 'net.minecraft.entity.passive.EntityCow';
export const MooshroomClass = 'net.minecraft.entity.passive.EntityMooshroom';
export const PigClass = 'net.minecraft.entity.passive.EntityPig';
export const RabbitClass = 'net.minecraft.entity.passive.EntityRabbit';
export const SheepClass = 'net.minecraft.entity.passive.EntitySheep';

export const PlayerClass = 'net.minecraft.entity.player.EntityPlayer';

export const ArmorStandClass = 'net.minecraft.entity.item.EntityArmorStand';

export const mobs = [
  // Private Island
  {
    name: 'Creeper',
    island: 'private',
    mcclass: CreeperClass,
    armor: false,
    image:
      'https://wiki.hypixel.net/images/f/fb/Minecraft_entities_creeper.png',
  },
  {
    name: 'Enderman',
    island: 'private',
    mcclass: EndermanClass,
    armor: false,
    image:
      'https://wiki.hypixel.net/images/b/b1/Minecraft_entities_enderman.png',
  },
  {
    name: 'Skeleton',
    island: 'private',
    mcclass: SkeletonClass,
    skeletonType: 0,
    armor: false,
    image:
      'https://wiki.hypixel.net/images/f/f4/Minecraft_entities_skeleton.png',
  },
  {
    name: 'Slime',
    island: 'private',
    mcclass: SlimeClass,
    armor: false,
    image: 'https://wiki.hypixel.net/images/2/22/Minecraft_entities_slime.png',
  },
  {
    name: 'Spider',
    island: 'private',
    mcclass: SpiderClass,
    armor: false,
    image: 'https://wiki.hypixel.net/images/a/a1/Minecraft_entities_spider.png',
  },
  {
    name: 'Witch',
    island: 'private',
    mcclass: WitchClass,
    armor: false,
    image: 'https://wiki.hypixel.net/images/e/ea/Minecraft_entities_witch.png',
  },
  {
    name: 'Zombie',
    island: 'private',
    mcclass: ZombieClass,
    armor: false,
    villager: false,
    child: false,
    image: 'https://wiki.hypixel.net/images/2/26/Minecraft_entities_zombie.png',
  },

  // Hub
  {
    name: 'Crypt Ghoul',
    island: 'hub',
    mcclass: ZombieClass,
    armor: true,
    chestplate: 'Chainmail Chestplate',
    leggings: 'Chainmail Leggings',
    boots: 'Chainmail Boots',
    villager: false,
    child: false,
    image:
      'https://wiki.hypixel.net/images/4/45/SkyBlock_entities_crypt_ghoul.png',
  },
  {
    name: 'Golden Ghoul',
    island: 'hub',
    mcclass: ZombieClass,
    armor: true,
    chestplate: 'Golden Chestplate',
    leggings: 'Golden Leggings',
    boots: 'Golden Boots',
    villager: false,
    child: false,
    image:
      'https://wiki.hypixel.net/images/5/5a/SkyBlock_entities_golden_ghoul.png',
  },
  {
    name: 'Graveyard Zombie',
    island: 'hub',
    mcclass: ZombieClass,
    armor: false,
    villager: false,
    child: false,
    image: 'https://wiki.hypixel.net/images/2/26/Minecraft_entities_zombie.png',
  },
  {
    name: 'Old Wolf',
    island: 'hub',
    mcclass: WolfClass,
    health: [15000],
    image: 'https://wiki.hypixel.net/images/6/63/Minecraft_entities_wolf.png',
  },
  {
    name: 'Wolf',
    island: 'hub',
    mcclass: WolfClass,
    health: [250],
    image: 'https://wiki.hypixel.net/images/6/63/Minecraft_entities_wolf.png',
  },
  {
    name: 'Zombie Villager',
    island: 'hub',
    mcclass: ZombieClass,
    armor: false,
    villager: true,
    child: false,
    image:
      'https://wiki.hypixel.net/images/b/ba/SkyBlock_entities_zombie_villager.png',
  },

  // The Farming Islands
  {
    name: 'Chicken',
    island: 'farming',
    mcclass: ChickenClass,
    image:
      'https://wiki.hypixel.net/images/1/1a/Minecraft_entities_chicken.png',
  },
  {
    name: 'Cow',
    island: 'farming',
    mcclass: CowClass,
    image: 'https://wiki.hypixel.net/images/3/3b/Minecraft_entities_cow.png',
  },
  {
    name: 'Mushroom Cow',
    island: 'farming',
    mcclass: MooshroomClass,
    image:
      'https://wiki.hypixel.net/images/2/26/Minecraft_entities_red_mooshroom.png',
  },
  {
    name: 'Pig',
    island: 'farming',
    mcclass: PigClass,
    image: 'https://wiki.hypixel.net/images/e/e8/Minecraft_entities_pig.png',
  },
  {
    name: 'Rabbit',
    island: 'farming',
    mcclass: RabbitClass,
    image:
      'https://wiki.hypixel.net/images/d/d0/Minecraft_entities_brown_rabbit.png',
  },
  {
    name: 'Sheep',
    island: 'farming',
    mcclass: SheepClass,
    image: 'https://wiki.hypixel.net/images/2/25/Minecraft_entities_sheep.png',
  },

  // Spider's Den
  // TODO: distinguish various kinds of spiders :(
  {
    name: "Arachne's Keeper",
    island: 'spider',
    mcclass: CaveSpiderClass,
    health: [3000],
    image:
      'https://wiki.hypixel.net/images/9/97/Minecraft_entities_cave_spider.png',
  },
  {
    name: 'Gravel Skeleton',
    island: 'spider',
    mcclass: SkeletonClass,
    armor: false,
    skeletonType: 0,
    image:
      'https://wiki.hypixel.net/images/f/f4/Minecraft_entities_skeleton.png',
  },
  {
    name: 'Rain Slime',
    island: 'spider',
    mcclass: SlimeClass,
    image: 'https://wiki.hypixel.net/images/2/22/Minecraft_entities_slime.png',
  },
  {
    name: 'Silverfish',
    island: 'spider',
    mcclass: SilverfishClass,
    image:
      'https://wiki.hypixel.net/images/8/88/Minecraft_entities_silverfish.gif',
  },

  // Crimson Isle
  {
    // Lv70 Blaze, Bezal, Mutated
    name: 'Blaze',
    island: 'nether',
    mcclass: BlazeClass,
    health: [250000, 300000, 500000],
    image: 'https://wiki.hypixel.net/images/8/8b/Minecraft_entities_blaze.gif',
  },
  {
    name: 'Flaming Spider',
    island: 'nether',
    mcclass: SpiderClass,
    image:
      'https://wiki.hypixel.net/images/8/84/SkyBlock_entities_flaming_spider.png',
  },
  {
    name: 'Kada Knight',
    island: 'nether',
    mcclass: ChickenClass,
    image:
      'https://wiki.hypixel.net/images/2/21/SkyBlock_entities_kada_knight.png',
  },
  {
    name: 'Magma Cube',
    island: 'nether',
    mcclass: MagmaCubeClass,
    isRidden: false,
    health: [400000, 600000],
    image:
      'https://wiki.hypixel.net/images/d/db/Minecraft_entities_magma_cube.png',
  },
  {
    name: 'Magma Cube Rider',
    island: 'nether',
    mcclass: MagmaCubeClass,
    isRidden: true,
    image:
      'https://wiki.hypixel.net/images/4/40/SkyBlock_entities_magma_cube_rider.png',
  },
  {
    name: 'Millenia-Aged Blaze',
    island: 'nether',
    mcclass: BlazeClass,
    health: [30000000],
    image: 'https://wiki.hypixel.net/images/8/8b/Minecraft_entities_blaze.gif',
  },
  {
    name: 'Mushroom Bull',
    island: 'nether',
    mcclass: MooshroomClass,
    image:
      'https://wiki.hypixel.net/images/2/26/Minecraft_entities_red_mooshroom.png',
  },
  {
    name: 'Smoldering Blaze',
    island: 'nether',
    mcclass: BlazeClass,
    health: [5500000],
    image: 'https://wiki.hypixel.net/images/8/8b/Minecraft_entities_blaze.gif',
  },
  {
    name: 'Wither Skeleton',
    island: 'nether',
    mcclass: SkeletonClass,
    armor: false,
    isInvisible: false,
    skeletonType: 1,
    image:
      'https://wiki.hypixel.net/images/b/b5/Minecraft_entities_wither_skeleton.png',
  },
  {
    name: 'Wither Spectre',
    island: 'nether',
    mcclass: SkeletonClass,
    armor: false,
    isInvisible: true,
    skeletonType: 1,
    image:
      'https://wiki.hypixel.net/images/b/b8/SkyBlock_entities_wither_spectre.png',
  },

  // The End
  {
    name: 'Enderman',
    island: 'end',
    mcclass: EndermanClass,
    health: [4500, 6000, 9000],
    image:
      'https://wiki.hypixel.net/images/b/b1/Minecraft_entities_enderman.png',
  },
  {
    name: 'Endermite',
    island: 'end',
    mcclass: EndermiteClass,
    image:
      'https://wiki.hypixel.net/images/9/95/Minecraft_entities_endermite.gif',
  },
  {
    name: 'Obsidian Defender',
    island: 'end',
    mcclass: SkeletonClass,
    armor: false,
    skeletonType: 1,
    image:
      'https://wiki.hypixel.net/images/9/9c/SkyBlock_entities_obsidian_defender.png',
  },
  {
    name: 'Voidling Extremist',
    island: 'end',
    mcclass: EndermanClass,
    health: [8000000],
    image:
      'https://wiki.hypixel.net/images/b/b1/Minecraft_entities_enderman.png',
  },
  {
    name: 'Voidling Fanatic',
    island: 'end',
    mcclass: EndermanClass,
    health: [750000],
    image:
      'https://wiki.hypixel.net/images/b/b1/Minecraft_entities_enderman.png',
  },
  {
    name: 'Watcher',
    island: 'end',
    mcclass: SkeletonClass,
    armor: false,
    skeletonType: 0,
    image: 'https://wiki.hypixel.net/images/f/f4/SkyBlock_entities_watcher.png',
  },
  {
    name: 'Zealot',
    island: 'end',
    mcclass: EndermanClass,
    health: [13000, 65000],
    image:
      'https://wiki.hypixel.net/images/b/b1/Minecraft_entities_enderman.png',
  },

  // Deep Caverns
  {
    name: 'Emerald Slime',
    island: 'deep',
    mcclass: SlimeClass,
    image: 'https://wiki.hypixel.net/images/2/22/Minecraft_entities_slime.png',
  },
  {
    name: 'Lapis Zombie',
    island: 'deep',
    mcclass: ZombieClass,
    armor: true,
    chestplate: 'Lapis Armor Chestplate',
    leggings: 'Lapis Armor Leggings',
    boots: 'Lapis Armor Boots',
    villager: false,
    child: false,
    image:
      'https://wiki.hypixel.net/images/0/0c/SkyBlock_entities_lapis_zombie.png',
  },
  {
    name: 'Miner Skeleton',
    island: 'deep',
    mcclass: SkeletonClass,
    armor: false,
    skeletonType: 0,
    image:
      'https://wiki.hypixel.net/images/5/5c/SkyBlock_entities_miner_skeleton.png',
  },
  {
    name: 'Miner Zombie',
    island: 'deep',
    mcclass: ZombieClass,
    armor: true,
    chestplate: 'Miner Chestplate',
    leggings: 'Miner Leggings',
    boots: 'Miner Boots',
    villager: false,
    child: false,
    image:
      'https://wiki.hypixel.net/images/8/86/SkyBlock_entities_miner_zombie.png',
  },
  {
    name: 'Redstone Pigman',
    island: 'deep',
    mcclass: PigmanClass,
    image:
      'https://wiki.hypixel.net/images/c/c5/Minecraft_entities_zombie_pigman.png',
  },
  {
    name: 'Sneaky Creeper',
    island: 'deep',
    mcclass: CreeperClass,
    image:
      'https://wiki.hypixel.net/images/f/fb/Minecraft_entities_creeper.png',
  },

  // Dwarven Mines
  {
    name: 'Ghost',
    island: 'dwarven',
    mcclass: CreeperClass,
    image: 'https://wiki.hypixel.net/images/3/3f/SkyBlock_entities_ghost.gif',
  },
  {
    name: 'Goblin',
    island: 'dwarven',
    mcclass: PlayerClass,
    playerName: ['Goblin'],
    image: 'https://wiki.hypixel.net/images/a/a1/SkyBlock_entities_goblin.png',
  },
  {
    name: 'Goblin Raiders',
    island: 'dwarven',
    mcclass: PlayerClass,
    playerName: [
      'Weakling',
      'Fireslinger',
      'Creeperlobber',
      'Pitfighter',
      'Murderlover',
    ],
    image:
      'https://wiki.hypixel.net/images/2/2b/SkyBlock_entities_goblin_murderlover.png',
  },
  {
    name: 'Ice Walker',
    island: 'dwarven',
    mcclass: PlayerClass,
    playerName: ['Ice Walker'],
    image:
      'https://wiki.hypixel.net/images/9/95/SkyBlock_entities_ice_walker.png',
  },
  {
    name: 'Star Sentry',
    island: 'dwarven',
    mcclass: PlayerClass,
    playerName: ['Crystal Sentry'],
    image:
      'https://wiki.hypixel.net/images/8/86/SkyBlock_entities_star_sentry.png',
  },
  {
    name: 'Treasure Hoarder',
    island: 'dwarven',
    mcclass: PlayerClass,
    playerName: ['Treasure Hunter'],
    image:
      'https://wiki.hypixel.net/images/a/a4/SkyBlock_entities_treasure_hoarder.png',
  },

  // Crystal Hollows
  {
    name: 'Automaton',
    island: 'crystal',
    mcclass: IronGolemClass,
    image:
      'https://wiki.hypixel.net/images/e/ee/Minecraft_entities_iron_golem.png',
  },
  {
    name: 'Butterfly',
    island: 'crystal',
    mcclass: ArmorStandClass,
    encoded: '',
    image:
      'https://wiki.hypixel.net/images/f/f1/SkyBlock_entities_butterfly.png',
  },
  {
    name: 'Grunt',
    island: 'crystal',
    mcclass: PlayerClass,
    playerName: ['Team Treasurite'],
    image:
      'https://wiki.hypixel.net/images/5/57/SkyBlock_entities_team_treasurite_grunt_1.png',
  },
  {
    name: 'Key Guardian',
    island: 'crystal',
    mcclass: ZombieClass,
    armor: false,
    villager: false,
    child: false,
    image:
      'https://wiki.hypixel.net/images/2/26/SkyBlock_entities_key_guardian.png',
  },
  {
    name: 'Sludge',
    island: 'crystal',
    mcclass: SlimeClass,
    image: 'https://wiki.hypixel.net/images/2/22/Minecraft_entities_slime.png',
  },
  {
    name: 'Thyst',
    island: 'crystal',
    mcclass: EndermiteClass,
    image:
      'https://wiki.hypixel.net/images/9/95/Minecraft_entities_endermite.gif',
  },
  {
    name: 'Yog',
    island: 'crystal',
    mcclass: MagmaCubeClass,
    image:
      'https://wiki.hypixel.net/images/d/db/Minecraft_entities_magma_cube.png',
  },

  // The Park
  {
    name: 'Howling Spirit',
    island: 'park',
    mcclass: WolfClass,
    health: [7000],
    image: 'https://wiki.hypixel.net/images/6/63/Minecraft_entities_wolf.png',
  },
  {
    name: 'Pack Spirit',
    island: 'park',
    mcclass: WolfClass,
    health: [6000],
    image: 'https://wiki.hypixel.net/images/6/63/Minecraft_entities_wolf.png',
  },
  {
    name: 'Soul of the Alpha',
    island: 'park',
    mcclass: WolfClass,
    health: [31150],
    image: 'https://wiki.hypixel.net/images/6/63/Minecraft_entities_wolf.png',
  },

  // Spooky Festival
];
