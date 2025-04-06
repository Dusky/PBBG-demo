/**
 * Sample Monsters for the Fantasy Text MMORPG
 */

const sampleMonsters = [
  {
    id: 'training-dummy',
    name: 'Training Dummy',
    description: 'A wooden dummy shaped vaguely like a humanoid. It\'s covered in dents and scratches from countless practice strikes.',
    level: 1,
    type: 'construct',
    aggression: 'passive',
    attributes: {
      strength: 5,
      dexterity: 1,
      intelligence: 1,
      constitution: 20
    },
    stats: {
      health: {
        base: 30,
        current: 30
      },
      damage: {
        min: 0,
        max: 0
      },
      defense: 0,
      accuracy: 0,
      evasion: 0,
      attackSpeed: 0,
      critChance: 0,
      critMultiplier: 0
    },
    abilities: [],
    loot: [
      {
        itemId: 'splintered-wood',
        dropRate: 0.2,
        minQuantity: 1,
        maxQuantity: 2
      }
    ],
    experienceValue: 1,
    goldValue: {
      min: 0,
      max: 0
    },
    respawnTime: 10,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The training dummy stands still, absorbing your attack.'
      ],
      deathMessages: [
        'The training dummy falls apart, its wooden limbs scattering across the ground.'
      ],
      spawnMessages: [
        'A new training dummy has been set up.'
      ]
    }
  },
  {
    id: 'forest-wolf',
    name: 'Forest Wolf',
    description: 'A lean, gray wolf with piercing yellow eyes and sharp teeth. It looks hungry and aggressive.',
    level: 2,
    type: 'beast',
    aggression: 'neutral',
    attributes: {
      strength: 8,
      dexterity: 12,
      intelligence: 4,
      constitution: 7
    },
    stats: {
      health: {
        base: 40,
        current: 40
      },
      damage: {
        min: 3,
        max: 6
      },
      defense: 2,
      accuracy: 75,
      evasion: 15,
      attackSpeed: 1.2,
      critChance: 5,
      critMultiplier: 1.5
    },
    abilities: [
      {
        name: 'Fierce Bite',
        description: 'The wolf lunges forward with powerful jaws, delivering a vicious bite.',
        damage: {
          min: 5,
          max: 10
        },
        effect: {
          type: 'damage',
          value: 0,
          duration: 0
        },
        cooldown: 3,
        useChance: 0.3
      }
    ],
    loot: [
      {
        itemId: 'wolf-fang',
        dropRate: 0.4,
        minQuantity: 1,
        maxQuantity: 2
      },
      {
        itemId: 'wolf-pelt',
        dropRate: 0.3,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'raw-meat',
        dropRate: 0.6,
        minQuantity: 1,
        maxQuantity: 3
      }
    ],
    experienceValue: 15,
    goldValue: {
      min: 1,
      max: 5
    },
    respawnTime: 60,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The wolf snarls and lunges at you with snapping jaws.',
        'The wolf circles around you before darting in for a bite.',
        'The wolf growls deeply before attacking.'
      ],
      deathMessages: [
        'The wolf lets out a final whimper before collapsing.',
        'The wolf falls to the ground, its fierce spirit extinguished.',
        'With a mournful howl, the wolf succumbs to its wounds.'
      ],
      spawnMessages: [
        'A gray wolf emerges from the shadows of the forest.',
        'You hear rustling in the underbrush before a wolf appears.',
        'A lone wolf stalks into view, its yellow eyes fixed on you.'
      ]
    }
  },
  {
    id: 'goblin-scout',
    name: 'Goblin Scout',
    description: 'A small, green-skinned humanoid with pointed ears and a wicked grin. It wears tattered leather armor and carries a crude dagger.',
    level: 3,
    type: 'humanoid',
    aggression: 'aggressive',
    attributes: {
      strength: 6,
      dexterity: 10,
      intelligence: 6,
      constitution: 5
    },
    stats: {
      health: {
        base: 35,
        current: 35
      },
      damage: {
        min: 4,
        max: 7
      },
      defense: 3,
      accuracy: 70,
      evasion: 20,
      attackSpeed: 1.5,
      critChance: 10,
      critMultiplier: 1.5
    },
    abilities: [
      {
        name: 'Sneak Attack',
        description: 'The goblin darted forward with surprising speed, striking from an unexpected angle.',
        damage: {
          min: 6,
          max: 10
        },
        effect: {
          type: 'damage',
          value: 0,
          duration: 0
        },
        cooldown: 4,
        useChance: 0.4
      }
    ],
    loot: [
      {
        itemId: 'crude-dagger',
        dropRate: 0.3,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'tattered-leather',
        dropRate: 0.4,
        minQuantity: 1,
        maxQuantity: 2
      },
      {
        itemId: 'copper-coins',
        dropRate: 0.7,
        minQuantity: 2,
        maxQuantity: 8
      }
    ],
    experienceValue: 20,
    goldValue: {
      min: 3,
      max: 8
    },
    respawnTime: 90,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The goblin cackles as it lunges at you with its dagger.',
        'The goblin darts around you, looking for an opening to strike.',
        'With a high-pitched war cry, the goblin attacks!'
      ],
      deathMessages: [
        'The goblin crumples to the ground with a pitiful squeal.',
        'The goblin stares at you in disbelief before collapsing.',
        'With a final curse in its guttural language, the goblin falls.'
      ],
      spawnMessages: [
        'A goblin scout emerges from behind a tree, dagger in hand.',
        'You hear a malicious giggle as a goblin scout appears.',
        'A small, green figure darted between the trees - a goblin scout has spotted you!'
      ]
    }
  },
  {
    id: 'forest-bear',
    name: 'Forest Bear',
    description: 'A massive brown bear with powerful muscles and sharp claws. It stands nearly eight feet tall when on its hind legs.',
    level: 5,
    type: 'beast',
    aggression: 'neutral',
    attributes: {
      strength: 15,
      dexterity: 8,
      intelligence: 4,
      constitution: 14
    },
    stats: {
      health: {
        base: 90,
        current: 90
      },
      damage: {
        min: 8,
        max: 14
      },
      defense: 6,
      accuracy: 65,
      evasion: 5,
      attackSpeed: 0.8,
      critChance: 5,
      critMultiplier: 1.8
    },
    abilities: [
      {
        name: 'Mighty Swipe',
        description: 'The bear swings its massive paw in a wide arc.',
        damage: {
          min: 12,
          max: 18
        },
        effect: {
          type: 'damage',
          value: 0,
          duration: 0
        },
        cooldown: 3,
        useChance: 0.3
      },
      {
        name: 'Crushing Hug',
        description: 'The bear grabs you in a powerful embrace, squeezing the breath from your lungs.',
        damage: {
          min: 10,
          max: 15
        },
        effect: {
          type: 'debuff',
          value: -5,
          duration: 2
        },
        cooldown: 5,
        useChance: 0.2
      }
    ],
    loot: [
      {
        itemId: 'bear-claw',
        dropRate: 0.5,
        minQuantity: 1,
        maxQuantity: 3
      },
      {
        itemId: 'bear-pelt',
        dropRate: 0.4,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'raw-meat',
        dropRate: 0.8,
        minQuantity: 3,
        maxQuantity: 6
      }
    ],
    experienceValue: 45,
    goldValue: {
      min: 0,
      max: 2
    },
    respawnTime: 180,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The bear roars and charges at you with frightening speed.',
        'The bear swings its massive paw at you with enough force to shatter bone.',
        'Standing on its hind legs, the bear towers over you before attacking.'
      ],
      deathMessages: [
        'The mighty bear crashes to the ground with a final, pitiful moan.',
        'The bear collapses heavily, the light fading from its eyes.',
        'With a mournful sound, the great bear falls and is still.'
      ],
      spawnMessages: [
        'A massive bear emerges from the trees, sniffing the air.',
        'You hear a deep growl as a forest bear noticed your presence.',
        'A hulking shape rises from its resting place - a forest bear has spotted you.'
      ]
    }
  },
  {
    id: 'forest-spider',
    name: 'Giant Forest Spider',
    description: 'A spider the size of a large dog, with gleaming black carapace and venomous fangs that drip with poison.',
    level: 4,
    type: 'beast',
    aggression: 'aggressive',
    attributes: {
      strength: 7,
      dexterity: 14,
      intelligence: 2,
      constitution: 6
    },
    stats: {
      health: {
        base: 45,
        current: 45
      },
      damage: {
        min: 5,
        max: 9
      },
      defense: 4,
      accuracy: 80,
      evasion: 25,
      attackSpeed: 1.6,
      critChance: 10,
      critMultiplier: 1.5
    },
    abilities: [
      {
        name: 'Venomous Bite',
        description: 'The spider sinks its fangs deep, injecting a painful venom.',
        damage: {
          min: 6,
          max: 10
        },
        effect: {
          type: 'dot',
          value: 3,
          duration: 3
        },
        cooldown: 4,
        useChance: 0.4
      },
      {
        name: 'Web Snare',
        description: 'The spider shoots a sticky web, entangling its prey.',
        damage: {
          min: 0,
          max: 0
        },
        effect: {
          type: 'debuff',
          value: -10,
          duration: 2
        },
        cooldown: 5,
        useChance: 0.3
      }
    ],
    loot: [
      {
        itemId: 'spider-silk',
        dropRate: 0.6,
        minQuantity: 1,
        maxQuantity: 3
      },
      {
        itemId: 'venom-sac',
        dropRate: 0.3,
        minQuantity: 1,
        maxQuantity: 1
      }
    ],
    experienceValue: 30,
    goldValue: {
      min: 0,
      max: 3
    },
    respawnTime: 120,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The spider skitters forward with alarming speed, fangs bared.',
        'The spider drops silently from above, attempting to surprise you.',
        'Eight gleaming eyes focus on you as the spider prepares to strike.'
      ],
      deathMessages: [
        'The spider\'s legs curl inward as it dies with a hissing sound.',
        'The spider twitches violently before becoming still.',
        'With a final spasm, the giant spider collapses in on itself.'
      ],
      spawnMessages: [
        'You noticed a large, dark shape moving among the trees - a giant spider!',
        'Silken strands descend from above as a giant spider lowers itself down.',
        'A giant spider emerges from a hidden burrow, its fangs clicking menacingly.'
      ]
    }
  },
  {
    id: 'goblin-warrior',
    name: 'Goblin Warrior',
    description: 'A goblin slightly larger than the scouts, wearing mismatched armor pieces and wielding a rusty shortsword. War paint adorns its green face.',
    level: 5,
    type: 'humanoid',
    aggression: 'aggressive',
    attributes: {
      strength: 10,
      dexterity: 9,
      intelligence: 5,
      constitution: 8
    },
    stats: {
      health: {
        base: 55,
        current: 55
      },
      damage: {
        min: 6,
        max: 10
      },
      defense: 7,
      accuracy: 65,
      evasion: 15,
      attackSpeed: 1.2,
      critChance: 8,
      critMultiplier: 1.5
    },
    abilities: [
      {
        name: 'Wild Swing',
        description: 'The goblin warrior swings its sword in a wide, reckless arc.',
        damage: {
          min: 9,
          max: 15
        },
        effect: {
          type: 'damage',
          value: 0,
          duration: 0
        },
        cooldown: 3,
        useChance: 0.4
      }
    ],
    loot: [
      {
        itemId: 'rusty-shortsword',
        dropRate: 0.3,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'mismatched-armor',
        dropRate: 0.4,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'copper-coins',
        dropRate: 0.8,
        minQuantity: 5,
        maxQuantity: 15
      }
    ],
    experienceValue: 35,
    goldValue: {
      min: 5,
      max: 12
    },
    respawnTime: 120,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The goblin warrior beats its chest before charging at you with its sword.',
        'With surprising strength, the goblin warrior swings its blade at you.',
        'The goblin warrior shouts a battle cry in its guttural language as it attacks.'
      ],
      deathMessages: [
        'The goblin warrior falls to its knees, then face-first into the dirt.',
        'The goblin warrior coughs blood and collapses, its weapon clattering away.',
        'With a final defiant snarl, the goblin warrior succumbs to its wounds.'
      ],
      spawnMessages: [
        'A goblin warrior steps forward, brandishing its weapon threateningly.',
        'The clank of crude armor announces the arrival of a goblin warrior.',
        'A goblin warrior spots you and raises its weapon with a war cry.'
      ]
    }
  },
  {
    id: 'goblin-shaman',
    name: 'Goblin Shaman',
    description: 'An elderly goblin adorned with bones, feathers, and tribal markings. It carries a gnarled staff topped with a glowing crystal.',
    level: 6,
    type: 'humanoid',
    aggression: 'aggressive',
    attributes: {
      strength: 5,
      dexterity: 8,
      intelligence: 14,
      constitution: 7
    },
    stats: {
      health: {
        base: 50,
        current: 50
      },
      damage: {
        min: 5,
        max: 8
      },
      defense: 4,
      accuracy: 75,
      evasion: 20,
      attackSpeed: 1.0,
      critChance: 15,
      critMultiplier: 1.8
    },
    abilities: [
      {
        name: 'Fire Bolt',
        description: 'The shaman shoots a bolt of magical fire from its staff.',
        damage: {
          min: 10,
          max: 16
        },
        effect: {
          type: 'damage',
          value: 0,
          duration: 0
        },
        cooldown: 3,
        useChance: 0.5
      },
      {
        name: 'Healing Totem',
        description: 'The shaman plants a totem that pulses with healing energy.',
        damage: {
          min: 0,
          max: 0
        },
        effect: {
          type: 'heal',
          value: 8,
          duration: 3
        },
        cooldown: 6,
        useChance: 0.3
      },
      {
        name: 'Curse',
        description: 'The shaman points at you, uttering words of power that weaken your resolve.',
        damage: {
          min: 0,
          max: 0
        },
        effect: {
          type: 'debuff',
          value: -5,
          duration: 3
        },
        cooldown: 5,
        useChance: 0.4
      }
    ],
    loot: [
      {
        itemId: 'shaman-staff',
        dropRate: 0.3,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'magical-crystal',
        dropRate: 0.2,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'bone-fetish',
        dropRate: 0.5,
        minQuantity: 1,
        maxQuantity: 3
      },
      {
        itemId: 'copper-coins',
        dropRate: 0.8,
        minQuantity: 10,
        maxQuantity: 20
      }
    ],
    experienceValue: 60,
    goldValue: {
      min: 8,
      max: 15
    },
    respawnTime: 240,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The goblin shaman waves its staff, muttering arcane words.',
        'Glowing symbols appear around the shaman as it prepares a spell.',
        'The crystal atop the shaman\'s staff pulses with malevolent energy.'
      ],
      deathMessages: [
        'The goblin shaman\'s staff clatters to the ground as its body goes limp.',
        'With a final, desperate incantation that dies on its lips, the shaman collapses.',
        'The shaman\'s eyes widened in disbelief before it falls, its magical energies dissipating.'
      ],
      spawnMessages: [
        'The air tingled with arcane energy as a goblin shaman appeared.',
        'A hunched goblin steps forward, its staff glowing with an eerie light.',
        'Rattling bones and jingling fetishes announced the arrival of a goblin shaman.'
      ]
    }
  },
  {
    id: 'skeleton-warrior',
    name: 'Skeleton Warrior',
    description: 'The animated remains of an ancient warrior, its yellowed bones held together by dark magic. It wields a rusted sword with surprising skill.',
    level: 7,
    type: 'undead',
    aggression: 'aggressive',
    attributes: {
      strength: 12,
      dexterity: 10,
      intelligence: 3,
      constitution: 8
    },
    stats: {
      health: {
        base: 65,
        current: 65
      },
      damage: {
        min: 8,
        max: 14
      },
      defense: 8,
      accuracy: 70,
      evasion: 20,
      attackSpeed: 1.1,
      critChance: 7,
      critMultiplier: 1.6
    },
    abilities: [
      {
        name: 'Bone Strike',
        description: 'The skeleton warrior strikes with unexpected precision.',
        damage: {
          min: 12,
          max: 18
        },
        effect: {
          type: 'damage',
          value: 0,
          duration: 0
        },
        cooldown: 3,
        useChance: 0.4
      }
    ],
    loot: [
      {
        itemId: 'ancient-sword',
        dropRate: 0.3,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'bone-fragments',
        dropRate: 0.7,
        minQuantity: 2,
        maxQuantity: 5
      },
      {
        itemId: 'silver-coins',
        dropRate: 0.5,
        minQuantity: 5,
        maxQuantity: 15
      }
    ],
    experienceValue: 55,
    goldValue: {
      min: 5,
      max: 15
    },
    respawnTime: 180,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The skeleton warrior\'s bones rattled as it lunged forward with its blade.',
        'Empty eye sockets somehow fixed on you as the skeleton swung its weapon.',
        'The skeleton warrior moved with unnaturally fluid motion as it attacked.'
      ],
      deathMessages: [
        'The skeleton warrior collapsed into a pile of bones, the magic animating it dispelled.',
        'With a final, silent defiance, the skeleton warrior fell apart.',
        'The skeleton warrior shatters under your final blow, bones scattering across the ground.'
      ],
      spawnMessages: [
        'Bones stirred and assembled themselves into a skeleton warrior.',
        'A skeleton warrior rose from the ground, ancient armor hanging from its frame.',
        'The clatter of bones announced the arrival of a skeleton warrior.'
      ]
    }
  },
  {
    id: 'animated-statue',
    name: 'Animated Statue',
    description: 'A stone statue depicting an ancient warrior that has been granted unnatural movement. Its stone eyes glow with an inner light.',
    level: 8,
    type: 'construct',
    aggression: 'aggressive',
    attributes: {
      strength: 16,
      dexterity: 6,
      intelligence: 4,
      constitution: 18
    },
    stats: {
      health: {
        base: 110,
        current: 110
      },
      damage: {
        min: 12,
        max: 18
      },
      defense: 15,
      accuracy: 60,
      evasion: 5,
      attackSpeed: 0.7,
      critChance: 5,
      critMultiplier: 1.5
    },
    abilities: [
      {
        name: 'Stone Fist',
        description: 'The statue swung its massive stone fist with devastating force.',
        damage: {
          min: 15,
          max: 22
        },
        effect: {
          type: 'damage',
          value: 0,
          duration: 0
        },
        cooldown: 4,
        useChance: 0.3
      },
      {
        name: 'Ground Slam',
        description: 'The statue slams both fists into the ground, sending shock waves in all directions.',
        damage: {
          min: 10,
          max: 15
        },
        effect: {
          type: 'stun',
          value: 0,
          duration: 1
        },
        cooldown: 6,
        useChance: 0.2
      }
    ],
    loot: [
      {
        itemId: 'stone-fragment',
        dropRate: 0.8,
        minQuantity: 2,
        maxQuantity: 5
      },
      {
        itemId: 'arcane-dust',
        dropRate: 0.4,
        minQuantity: 1,
        maxQuantity: 3
      },
      {
        itemId: 'gemstone',
        dropRate: 0.2,
        minQuantity: 1,
        maxQuantity: 1
      }
    ],
    experienceValue: 75,
    goldValue: {
      min: 0,
      max: 5
    },
    respawnTime: 300,
    isBoss: false,
    flavor: {
      attackMessages: [
        'The statue moved with surprising speed for something made of stone.',
        'The ground trembled slightly with each step the animated statue took.',
        'The statue\'s eyes flared brightly as it prepared to attack.'
      ],
      deathMessages: [
        'The statue froze in mid-motion before crumbling into rubble.',
        'With a groan of stone grinding against stone, the animated statue fell apart.',
        'The glow in the statue\'s eyes dimmed and extinguished as it collapsed.'
      ],
      spawnMessages: [
        'What you thought was an ordinary statue suddenly began to move!',
        'The stone statue\'s eyes began to glow with an eerie light as it stepped off its pedestal.',
        'With the groan of stone grinding against stone, a nearby statue came to life.'
      ]
    }
  }
];

module.exports = sampleMonsters; 