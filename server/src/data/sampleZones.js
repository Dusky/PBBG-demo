/**
 * Sample Zones for the Fantasy Text MMORPG
 */

const sampleZones = [
  {
    name: 'starting-village',
    displayName: 'Oakvale Village',
    description: 'A peaceful village nestled in the heart of a lush forest. The wooden houses with thatched roofs and the friendly villagers make this a welcoming place for new adventurers.',
    levelRange: {
      min: 1,
      max: 5
    },
    terrain: 'village',
    isDangerous: false,
    isSafe: true,
    isStartingZone: true,
    connections: [
      {
        zoneName: 'forest-path',
        description: 'A narrow path leading into the dense forest',
        direction: 'east',
        requiredLevel: 1
      },
      {
        zoneName: 'training-grounds',
        description: 'A well-worn area where new adventurers can practice their skills',
        direction: 'north',
        requiredLevel: 1
      }
    ],
    npcs: [
      {
        name: 'Elder Thaddeus',
        description: 'An elderly man with a long white beard and kind eyes, he seems to know much about the world.',
        dialogue: [
          {
            text: 'Welcome to Oakvale, young adventurer. These are dangerous times, and we need brave souls like you.',
            response: 'What dangers lurk nearby?'
          },
          {
            text: 'The forest to the east has been overrun with wolves and goblins. If you\'re feeling brave, you might help us clear them out.',
            response: 'I\'ll see what I can do.'
          }
        ],
        isQuestGiver: true,
        isVendor: false
      },
      {
        name: 'Merchant Gilda',
        description: 'A stout woman with a friendly smile, she sells basic supplies to adventurers.',
        dialogue: [
          {
            text: 'Need supplies for your journey? I\'ve got the best prices in the village!',
            response: 'Show me what you have.'
          }
        ],
        isQuestGiver: false,
        isVendor: true,
        inventory: [
          {
            itemId: 'health-potion-minor',
            price: 5,
            stock: -1
          },
          {
            itemId: 'mana-potion-minor',
            price: 5,
            stock: -1
          },
          {
            itemId: 'leather-armor',
            price: 10,
            stock: 3
          },
          {
            itemId: 'wooden-shield',
            price: 8,
            stock: 2
          }
        ]
      }
    ],
    ambientText: [
      'The sounds of daily village life fill the air - children playing, merchants haggling, and the distant clang of a blacksmith\'s hammer.',
      'A gentle breeze carries the scent of fresh bread from the bakery.',
      'Villagers nod respectfully as you pass by.',
      'A group of children run past, playing with wooden swords and pretending to be heroes.'
    ]
  },
  {
    name: 'training-grounds',
    displayName: 'Training Grounds',
    description: 'A wide clearing north of the village where new adventurers can hone their skills. Training dummies and practice targets are scattered about.',
    levelRange: {
      min: 1,
      max: 3
    },
    terrain: 'plains',
    isDangerous: false,
    isSafe: true,
    isStartingZone: false,
    connections: [
      {
        zoneName: 'starting-village',
        description: 'The path back to Oakvale Village',
        direction: 'south',
        requiredLevel: 1
      }
    ],
    npcs: [
      {
        name: 'Drill Sergeant Harkon',
        description: 'A weathered man with numerous scars and a stern expression. Despite his gruff demeanor, he\'s dedicated to training new adventurers.',
        dialogue: [
          {
            text: 'Think you\'ve got what it takes? Let\'s see your form, recruit!',
            response: 'I\'m ready to train.'
          },
          {
            text: 'Remember, in real combat there are no second chances. Train hard here so you survive out there.',
            response: 'I understand.'
          }
        ],
        isQuestGiver: true,
        isVendor: false
      }
    ],
    monsters: [
      {
        monsterId: 'training-dummy',
        spawnRate: 1,
        maxCount: 5
      }
    ],
    ambientText: [
      'The sound of practice weapons striking training dummies echoes across the grounds.',
      'A group of novice adventurers practice basic fighting stances nearby.',
      'Sergeant Harkon\'s voice booms as he corrects a trainee\'s form.',
      'The smell of sweat and determination fills the air.'
    ]
  },
  {
    name: 'forest-path',
    displayName: 'Forest Path',
    description: 'A narrow dirt path winding through the dense Greenvale Forest. Sunlight filters through the canopy above, casting dappled shadows on the ground.',
    levelRange: {
      min: 2,
      max: 5
    },
    terrain: 'forest',
    isDangerous: true,
    isSafe: false,
    isStartingZone: false,
    connections: [
      {
        zoneName: 'starting-village',
        description: 'The path back to Oakvale Village',
        direction: 'west',
        requiredLevel: 1
      },
      {
        zoneName: 'deep-forest',
        description: 'The path continues deeper into the forest',
        direction: 'east',
        requiredLevel: 3
      },
      {
        zoneName: 'forest-clearing',
        description: 'A small path leading to a clearing',
        direction: 'north',
        requiredLevel: 2
      }
    ],
    monsters: [
      {
        monsterId: 'forest-wolf',
        spawnRate: 0.4,
        maxCount: 3
      },
      {
        monsterId: 'goblin-scout',
        spawnRate: 0.3,
        maxCount: 2
      }
    ],
    resources: [
      {
        name: 'Herb Patch',
        description: 'A small patch of medicinal herbs growing along the path.',
        harvestTime: 3,
        items: [
          {
            itemId: 'healing-herb',
            dropRate: 0.8,
            minQuantity: 1,
            maxQuantity: 3
          }
        ],
        respawnTime: 180
      },
      {
        name: 'Berry Bush',
        description: 'A bush with small, red berries that look edible.',
        harvestTime: 2,
        items: [
          {
            itemId: 'forest-berries',
            dropRate: 0.9,
            minQuantity: 2,
            maxQuantity: 5
          }
        ],
        respawnTime: 120
      }
    ],
    ambientText: [
      'Leaves rustle in the gentle forest breeze.',
      'Birds chirp in the trees overhead.',
      'A small woodland creature scurries across the path and disappears into the underbrush.',
      'The distant howl of a wolf echoes through the trees.',
      'The path ahead is dappled with shadows and sunlight.'
    ]
  },
  {
    name: 'forest-clearing',
    displayName: 'Forest Clearing',
    description: 'A sunlit clearing in the heart of Greenvale Forest. Wildflowers dot the grassy area, and a small stream trickles along one edge.',
    levelRange: {
      min: 3,
      max: 6
    },
    terrain: 'forest',
    isDangerous: true,
    isSafe: false,
    isStartingZone: false,
    connections: [
      {
        zoneName: 'forest-path',
        description: 'The path back into the forest',
        direction: 'south',
        requiredLevel: 2
      },
      {
        zoneName: 'goblin-camp',
        description: 'A crude path trampled by many feet leading to what appears to be a camp',
        direction: 'east',
        requiredLevel: 4
      }
    ],
    monsters: [
      {
        monsterId: 'forest-wolf',
        spawnRate: 0.3,
        maxCount: 2
      },
      {
        monsterId: 'goblin-scout',
        spawnRate: 0.3,
        maxCount: 2
      },
      {
        monsterId: 'forest-bear',
        spawnRate: 0.2,
        maxCount: 1
      }
    ],
    resources: [
      {
        name: 'Clear Stream',
        description: 'Crystal clear water flows in this small forest stream.',
        harvestTime: 2,
        items: [
          {
            itemId: 'fresh-water',
            dropRate: 1,
            minQuantity: 1,
            maxQuantity: 1
          }
        ],
        respawnTime: 60
      },
      {
        name: 'Mushroom Circle',
        description: 'A circle of peculiar mushrooms with vibrant caps.',
        harvestTime: 3,
        items: [
          {
            itemId: 'forest-mushroom',
            dropRate: 0.7,
            minQuantity: 1,
            maxQuantity: 3
          },
          {
            itemId: 'glowing-mushroom',
            dropRate: 0.1,
            minQuantity: 1,
            maxQuantity: 1
          }
        ],
        respawnTime: 240
      }
    ],
    ambientText: [
      'Butterflies flit between colorful wildflowers in the clearing.',
      'The gentle sound of the stream provides a soothing backdrop.',
      'Sunlight bathes the clearing in a warm glow.',
      'A gentle breeze carries the scent of wildflowers.',
      'The clearing is peaceful, almost magically so.'
    ]
  },
  {
    name: 'deep-forest',
    displayName: 'Deep Forest',
    description: 'The dense, dark heart of Greenvale Forest. The trees here are ancient, their gnarled branches creating a thick canopy that blocks much of the sunlight.',
    levelRange: {
      min: 4,
      max: 7
    },
    terrain: 'forest',
    isDangerous: true,
    isSafe: false,
    isStartingZone: false,
    connections: [
      {
        zoneName: 'forest-path',
        description: 'The path back toward the forest edge',
        direction: 'west',
        requiredLevel: 3
      },
      {
        zoneName: 'forgotten-ruins',
        description: 'A barely visible trail leading to what appear to be ancient ruins',
        direction: 'north',
        requiredLevel: 5
      }
    ],
    monsters: [
      {
        monsterId: 'forest-wolf',
        spawnRate: 0.2,
        maxCount: 2
      },
      {
        monsterId: 'forest-bear',
        spawnRate: 0.3,
        maxCount: 2
      },
      {
        monsterId: 'forest-spider',
        spawnRate: 0.4,
        maxCount: 3
      }
    ],
    resources: [
      {
        name: 'Ancient Tree',
        description: 'A massive, ancient tree with thick bark.',
        harvestTime: 5,
        items: [
          {
            itemId: 'sturdy-wood',
            dropRate: 0.6,
            minQuantity: 1,
            maxQuantity: 3
          },
          {
            itemId: 'tree-sap',
            dropRate: 0.3,
            minQuantity: 1,
            maxQuantity: 2
          }
        ],
        respawnTime: 600
      }
    ],
    ambientText: [
      'The forest is unnaturally quiet here, as if holding its breath.',
      'Thick roots snake across the forest floor, making travel difficult.',
      'The air is thick and musty with the scent of decomposing leaves and moss.',
      'Occasionally, you hear the distant sound of something large moving through the underbrush.',
      'Strange, glowing eyes seem to watch from the shadows, but vanish when you look directly at them.'
    ]
  },
  {
    name: 'goblin-camp',
    displayName: 'Goblin Camp',
    description: 'A crude encampment of small, dome-shaped huts made from branches and animal hides. The area is littered with gnawed bones and discarded weapons.',
    levelRange: {
      min: 5,
      max: 8
    },
    terrain: 'forest',
    isDangerous: true,
    isSafe: false,
    isStartingZone: false,
    connections: [
      {
        zoneName: 'forest-clearing',
        description: 'The path back to the forest clearing',
        direction: 'west',
        requiredLevel: 4
      }
    ],
    monsters: [
      {
        monsterId: 'goblin-scout',
        spawnRate: 0.4,
        maxCount: 3
      },
      {
        monsterId: 'goblin-warrior',
        spawnRate: 0.3,
        maxCount: 2
      },
      {
        monsterId: 'goblin-shaman',
        spawnRate: 0.1,
        maxCount: 1
      }
    ],
    npcs: [],
    resources: [
      {
        name: 'Forgotten Chest',
        description: 'A battered chest, probably stolen by the goblins. It seems locked but might be breakable.',
        harvestTime: 8,
        items: [
          {
            itemId: 'copper-coins',
            dropRate: 0.6,
            minQuantity: 5,
            maxQuantity: 15
          },
          {
            itemId: 'iron-dagger',
            dropRate: 0.2,
            minQuantity: 1,
            maxQuantity: 1
          }
        ],
        respawnTime: 1800
      }
    ],
    ambientText: [
      'The stench of the goblin camp assaults your nostrils - a mix of unwashed bodies, rotting food, and worse.',
      'Crude drawings depicting successful raids adorn the sides of some huts.',
      'The guttural language of goblins can be heard from all directions.',
      'A cookfire smolders in the center of the camp, with something unidentifiable roasting on a spit.',
      'Goblins watch you warily from the shadows, hands on their crude weapons.'
    ]
  },
  {
    name: 'forgotten-ruins',
    displayName: 'Forgotten Ruins',
    description: 'The crumbling remains of an ancient civilization. Stone pillars, some still standing but most toppled, are covered in unreadable inscriptions and overgrown with vines.',
    levelRange: {
      min: 6,
      max: 10
    },
    terrain: 'ruins',
    isDangerous: true,
    isSafe: false,
    isStartingZone: false,
    connections: [
      {
        zoneName: 'deep-forest',
        description: 'The trail back to the deep forest',
        direction: 'south',
        requiredLevel: 5
      },
      {
        zoneName: 'ancient-temple',
        description: 'A partially collapsed doorway leading into what appears to be a temple',
        direction: 'north',
        requiredLevel: 8,
        requiredItem: 'ancient-key'
      }
    ],
    monsters: [
      {
        monsterId: 'skeleton-warrior',
        spawnRate: 0.3,
        maxCount: 3
      },
      {
        monsterId: 'animated-statue',
        spawnRate: 0.2,
        maxCount: 2
      }
    ],
    resources: [
      {
        name: 'Ancient Inscriptions',
        description: 'Carved stone tablets with mysterious symbols. Perhaps they hold ancient knowledge.',
        harvestTime: 10,
        items: [
          {
            itemId: 'rubbings-of-inscriptions',
            dropRate: 0.8,
            minQuantity: 1,
            maxQuantity: 1
          },
          {
            itemId: 'fragment-of-knowledge',
            dropRate: 0.1,
            minQuantity: 1,
            maxQuantity: 1
          }
        ],
        respawnTime: 1200
      },
      {
        name: 'Buried Treasure',
        description: 'Something glints from beneath the rubble and soil.',
        harvestTime: 15,
        items: [
          {
            itemId: 'silver-coins',
            dropRate: 0.5,
            minQuantity: 10,
            maxQuantity: 30
          },
          {
            itemId: 'ancient-key',
            dropRate: 0.05,
            minQuantity: 1,
            maxQuantity: 1
          }
        ],
        respawnTime: 3600
      }
    ],
    ambientText: [
      'The wind whistles through the ruins, creating an eerie melody.',
      'There\'s a sense of being watched by unseen eyes among the ruins.',
      'The ground is littered with fragments of pottery and unidentifiable artifacts.',
      'Occasionally, you hear what sounds like whispers in an unknown language.',
      'Despite the ruins\' age, there\'s remarkably little vegetation growing on certain structures, as if nature itself avoids them.'
    ]
  }
];

module.exports = sampleZones; 