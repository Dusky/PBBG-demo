/**
 * Sample Items for the Fantasy Text MMORPG
 */

const sampleItems = [
  // Consumables
  {
    id: 'health-potion-minor',
    name: 'Minor Health Potion',
    description: 'A small vial containing a red liquid that restores a small amount of health when consumed.',
    type: 'consumable',
    subType: 'potion',
    rarity: 'common',
    level: 1,
    value: 5,
    stackable: true,
    maxStack: 10,
    requiredLevel: 1,
    equippable: false,
    effects: [
      {
        type: 'heal',
        target: 'self',
        value: 20,
        duration: 0
      }
    ]
  },
  {
    id: 'mana-potion-minor',
    name: 'Minor Mana Potion',
    description: 'A small vial containing a blue liquid that restores a small amount of mana when consumed.',
    type: 'consumable',
    subType: 'potion',
    rarity: 'common',
    level: 1,
    value: 5,
    stackable: true,
    maxStack: 10,
    requiredLevel: 1,
    equippable: false,
    effects: [
      {
        type: 'heal',
        target: 'self',
        value: 15,
        duration: 0
      }
    ]
  },
  {
    id: 'healing-herb',
    name: 'Healing Herb',
    description: 'A common herb with mild medicinal properties. Can be used directly or in crafting potions.',
    type: 'consumable',
    subType: 'herb',
    rarity: 'common',
    level: 1,
    value: 2,
    stackable: true,
    maxStack: 20,
    requiredLevel: 1,
    equippable: false,
    effects: [
      {
        type: 'heal',
        target: 'self',
        value: 5,
        duration: 0
      }
    ]
  },
  {
    id: 'forest-berries',
    name: 'Forest Berries',
    description: 'Sweet red berries that provide a small amount of nourishment.',
    type: 'consumable',
    subType: 'food',
    rarity: 'common',
    level: 1,
    value: 1,
    stackable: true,
    maxStack: 20,
    requiredLevel: 1,
    equippable: false,
    effects: [
      {
        type: 'heal',
        target: 'self',
        value: 3,
        duration: 0
      }
    ]
  },
  {
    id: 'fresh-water',
    name: 'Fresh Water',
    description: 'Clear, pure water collected from a forest stream.',
    type: 'consumable',
    subType: 'food',
    rarity: 'common',
    level: 1,
    value: 1,
    stackable: true,
    maxStack: 5,
    requiredLevel: 1,
    equippable: false,
    effects: [
      {
        type: 'buff',
        target: 'self',
        value: 1,
        duration: 5
      }
    ]
  },
  {
    id: 'forest-mushroom',
    name: 'Forest Mushroom',
    description: 'An edible mushroom commonly found in forests.',
    type: 'consumable',
    subType: 'food',
    rarity: 'common',
    level: 1,
    value: 2,
    stackable: true,
    maxStack: 10,
    requiredLevel: 1,
    equippable: false,
    effects: [
      {
        type: 'heal',
        target: 'self',
        value: 4,
        duration: 0
      }
    ]
  },
  {
    id: 'glowing-mushroom',
    name: 'Glowing Mushroom',
    description: 'A rare mushroom that emits a soft blue glow. It has unusual magical properties.',
    type: 'consumable',
    subType: 'potion',
    rarity: 'uncommon',
    level: 3,
    value: 15,
    stackable: true,
    maxStack: 5,
    requiredLevel: 1,
    equippable: false,
    effects: [
      {
        type: 'buff',
        target: 'self',
        value: 5,
        duration: 10
      }
    ]
  },
  
  // Weapons
  {
    id: 'wooden-sword',
    name: 'Wooden Sword',
    description: 'A simple sword carved from wood. It\'s little more than a practice weapon.',
    type: 'weapon',
    subType: 'sword',
    rarity: 'common',
    level: 1,
    value: 5,
    stackable: false,
    equippable: true,
    equipSlot: 'mainHand',
    attributes: {
      damage: {
        min: 2,
        max: 4
      },
      strengthBonus: 0,
      dexterityBonus: 0
    },
    requiredLevel: 1
  },
  {
    id: 'rusty-shortsword',
    name: 'Rusty Shortsword',
    description: 'A shortsword covered in rust. Despite its condition, it\'s still sharp enough to be dangerous.',
    type: 'weapon',
    subType: 'sword',
    rarity: 'common',
    level: 2,
    value: 10,
    stackable: false,
    equippable: true,
    equipSlot: 'mainHand',
    attributes: {
      damage: {
        min: 3,
        max: 6
      },
      strengthBonus: 1,
      dexterityBonus: 0
    },
    requiredLevel: 1
  },
  {
    id: 'iron-dagger',
    name: 'Iron Dagger',
    description: 'A simple but well-crafted iron dagger. Its small size makes it quick to wield.',
    type: 'weapon',
    subType: 'dagger',
    rarity: 'common',
    level: 3,
    value: 15,
    stackable: false,
    equippable: true,
    equipSlot: 'mainHand',
    attributes: {
      damage: {
        min: 2,
        max: 5
      },
      strengthBonus: 0,
      dexterityBonus: 2
    },
    requiredLevel: 2
  },
  {
    id: 'hunters-bow',
    name: 'Hunter\'s Bow',
    description: 'A simple wooden bow used for hunting game in the forest.',
    type: 'weapon',
    subType: 'bow',
    rarity: 'common',
    level: 4,
    value: 20,
    stackable: false,
    equippable: true,
    equipSlot: 'mainHand',
    attributes: {
      damage: {
        min: 4,
        max: 8
      },
      strengthBonus: 0,
      dexterityBonus: 3
    },
    requiredLevel: 3
  },
  {
    id: 'shaman-staff',
    name: 'Goblin Shaman\'s Staff',
    description: 'A gnarled wooden staff topped with a small crystal. It hums faintly with residual magic.',
    type: 'weapon',
    subType: 'staff',
    rarity: 'uncommon',
    level: 6,
    value: 45,
    stackable: false,
    equippable: true,
    equipSlot: 'mainHand',
    attributes: {
      damage: {
        min: 5,
        max: 9
      },
      strengthBonus: 0,
      dexterityBonus: 0,
      intelligenceBonus: 5,
      manaBonus: 10
    },
    requiredLevel: 5
  },
  {
    id: 'ancient-sword',
    name: 'Ancient Sword',
    description: 'A remarkably well-preserved sword from a bygone era. Despite its age, the edge is still sharp.',
    type: 'weapon',
    subType: 'sword',
    rarity: 'uncommon',
    level: 7,
    value: 60,
    stackable: false,
    equippable: true,
    equipSlot: 'mainHand',
    attributes: {
      damage: {
        min: 8,
        max: 15
      },
      strengthBonus: 3,
      dexterityBonus: 1
    },
    requiredLevel: 6
  },
  
  // Armor
  {
    id: 'leather-armor',
    name: 'Leather Armor',
    description: 'A simple set of armor made from tanned leather. It offers basic protection without sacrificing mobility.',
    type: 'armor',
    subType: 'body',
    rarity: 'common',
    level: 2,
    value: 15,
    stackable: false,
    equippable: true,
    equipSlot: 'body',
    attributes: {
      defense: 5,
      dexterityBonus: 1
    },
    requiredLevel: 1
  },
  {
    id: 'leather-cap',
    name: 'Leather Cap',
    description: 'A simple cap made of hardened leather that provides minimal protection.',
    type: 'armor',
    subType: 'head',
    rarity: 'common',
    level: 2,
    value: 8,
    stackable: false,
    equippable: true,
    equipSlot: 'head',
    attributes: {
      defense: 3,
      dexterityBonus: 0
    },
    requiredLevel: 1
  },
  {
    id: 'leather-boots',
    name: 'Leather Boots',
    description: 'Sturdy boots made of leather. They\'re comfortable and provide good traction.',
    type: 'armor',
    subType: 'feet',
    rarity: 'common',
    level: 2,
    value: 10,
    stackable: false,
    equippable: true,
    equipSlot: 'feet',
    attributes: {
      defense: 2,
      dexterityBonus: 1
    },
    requiredLevel: 1
  },
  {
    id: 'wooden-shield',
    name: 'Wooden Shield',
    description: 'A round shield made of wood with a metal rim. It provides basic protection.',
    type: 'armor',
    subType: 'shield',
    rarity: 'common',
    level: 2,
    value: 12,
    stackable: false,
    equippable: true,
    equipSlot: 'offHand',
    attributes: {
      defense: 6,
      strengthBonus: 0
    },
    requiredLevel: 1
  },
  {
    id: 'mismatched-armor',
    name: 'Mismatched Armor',
    description: 'A hodgepodge of armor pieces cobbled together from various sources. It\'s not pretty, but it works.',
    type: 'armor',
    subType: 'body',
    rarity: 'common',
    level: 4,
    value: 20,
    stackable: false,
    equippable: true,
    equipSlot: 'body',
    attributes: {
      defense: 8,
      strengthBonus: 1,
      dexterityBonus: -1
    },
    requiredLevel: 3
  },
  {
    id: 'adventurers-cloak',
    name: 'Adventurer\'s Cloak',
    description: 'A tough, weatherproof cloak that has seen many travels. It provides some protection and is good in all weather.',
    type: 'armor',
    subType: 'body',
    rarity: 'uncommon',
    level: 5,
    value: 35,
    stackable: false,
    equippable: true,
    equipSlot: 'body',
    attributes: {
      defense: 6,
      dexterityBonus: 2,
      constitutionBonus: 1
    },
    requiredLevel: 4
  },
  
  // Quest Items and Materials
  {
    id: 'ancient-key',
    name: 'Ancient Key',
    description: 'A tarnished key of unusual design. It seems to be very old and must unlock something important.',
    type: 'quest',
    rarity: 'rare',
    level: 1,
    value: 0,
    stackable: false,
    isQuestItem: true
  },
  {
    id: 'rubbings-of-inscriptions',
    name: 'Rubbings of Ancient Inscriptions',
    description: 'Paper rubbings taken from mysterious stone inscriptions. They might be valuable to a scholar.',
    type: 'quest',
    rarity: 'uncommon',
    level: 1,
    value: 20,
    stackable: true,
    maxStack: 5
  },
  {
    id: 'fragment-of-knowledge',
    name: 'Fragment of Knowledge',
    description: 'A small, glowing shard that seems to contain some form of ancient wisdom or memory.',
    type: 'quest',
    rarity: 'rare',
    level: 1,
    value: 100,
    stackable: true,
    maxStack: 3
  },
  {
    id: 'wolf-fang',
    name: 'Wolf Fang',
    description: 'A sharp canine tooth from a forest wolf. It could be used in crafting or sold to collectors.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 3,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'wolf-pelt',
    name: 'Wolf Pelt',
    description: 'The thick, gray pelt of a forest wolf. It could be used in crafting leather goods.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 8,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'raw-meat',
    name: 'Raw Meat',
    description: 'A chunk of raw meat from a wild animal. It could be cooked to make food.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 2,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'bear-claw',
    name: 'Bear Claw',
    description: 'A large, curved claw from a forest bear. It\'s sharp and could be useful for crafting.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 5,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'bear-pelt',
    name: 'Bear Pelt',
    description: 'The thick, brown pelt of a forest bear. It\'s warm and could make good winter clothing.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'uncommon',
    level: 1,
    value: 15,
    stackable: true,
    maxStack: 5
  },
  {
    id: 'spider-silk',
    name: 'Spider Silk',
    description: 'Strands of strong, sticky silk from a giant forest spider. It has many uses in crafting.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 6,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'venom-sac',
    name: 'Venom Sac',
    description: 'A small sac filled with potent venom from a giant forest spider. Useful for making poisons or medicines.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'uncommon',
    level: 1,
    value: 12,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'bone-fetish',
    name: 'Bone Fetish',
    description: 'A small trinket made from bones and feathers by goblin shamans. It seems to have a trace of magic.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'uncommon',
    level: 1,
    value: 10,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'magical-crystal',
    name: 'Magical Crystal',
    description: 'A small crystal that pulses with arcane energy. It could be used in magical crafting.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'uncommon',
    level: 1,
    value: 25,
    stackable: true,
    maxStack: 5
  },
  {
    id: 'bone-fragments',
    name: 'Bone Fragments',
    description: 'Broken pieces of bone from a skeleton. They might be useful for certain crafting recipes.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 4,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'stone-fragment',
    name: 'Stone Fragment',
    description: 'A piece of carved stone that broke off from an animated statue. It has faint magical properties.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 7,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'arcane-dust',
    name: 'Arcane Dust',
    description: 'Glittering dust that seems to be the residue of magical energies. Used in many magical crafting recipes.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'uncommon',
    level: 1,
    value: 20,
    stackable: true,
    maxStack: 50
  },
  {
    id: 'gemstone',
    name: 'Gemstone',
    description: 'A small but valuable gemstone. It catches the light beautifully.',
    type: 'miscellaneous',
    subType: 'treasure',
    rarity: 'uncommon',
    level: 1,
    value: 50,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'sturdy-wood',
    name: 'Sturdy Wood',
    description: 'A piece of high-quality wood from an ancient forest tree. Good for crafting.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 5,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'tree-sap',
    name: 'Tree Sap',
    description: 'Sticky sap collected from a forest tree. It has adhesive properties and some alchemical uses.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 3,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'splintered-wood',
    name: 'Splintered Wood',
    description: 'Broken pieces of wood from a shattered training dummy. Not particularly valuable, but has some uses.',
    type: 'miscellaneous',
    subType: 'material',
    rarity: 'common',
    level: 1,
    value: 1,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'copper-coins',
    name: 'Copper Coins',
    description: 'A small pile of copper coins, the most common currency in the realm.',
    type: 'miscellaneous',
    subType: 'treasure',
    rarity: 'common',
    level: 1,
    value: 1,
    stackable: true,
    maxStack: 100
  },
  {
    id: 'silver-coins',
    name: 'Silver Coins',
    description: 'A handful of silver coins. Each is worth about 10 copper coins.',
    type: 'miscellaneous',
    subType: 'treasure',
    rarity: 'uncommon',
    level: 1,
    value: 10,
    stackable: true,
    maxStack: 100
  }
];

module.exports = sampleItems; 