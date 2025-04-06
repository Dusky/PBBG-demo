/**
 * Sample Quests for the Fantasy Text MMORPG
 */

const sampleQuests = [
  // First quest - introductory in starting area
  {
    questId: 'wolf-problem',
    title: 'The Wolf Problem',
    description: 'Captain Rodrick has requested help controlling the wolf population near Shadowglen Village, as they have become increasingly bold and threatening to the village.',
    level: 1,
    type: 'main',
    giver: 'Captain Rodrick',
    zone: 'starting-area',
    objectives: [
      {
        description: 'Slay forest wolves',
        type: 'kill',
        target: 'wolf-1',
        required: 3,
        targetDisplayName: 'Forest Wolf'
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 50
      },
      {
        type: 'gold',
        value: 25
      },
      {
        type: 'item',
        itemId: 'health-potion-minor',
        quantity: 2
      }
    ],
    isRepeatable: false,
    dialogueStart: 'The wolves have been getting too close to the village lately. We need to thin their numbers before they get brave enough to attack our livestock. Hunt down three of them and report back to me.',
    dialogueComplete: 'Good work! That should keep them at bay for a while. The village is safer thanks to your efforts. Here's your reward.'
  },
  
  // Gathering quest
  {
    questId: 'healing-supplies',
    title: 'Healing Supplies',
    description: 'Lily the Herbalist needs healing herbs from the forest edge to prepare medicines for the village.',
    level: 1,
    type: 'side',
    giver: 'Lily the Herbalist',
    zone: 'starting-area',
    objectives: [
      {
        description: 'Collect healing herbs',
        type: 'collect',
        target: 'healing-herb',
        required: 5,
        targetDisplayName: 'Healing Herb'
      },
      {
        description: 'Collect wild berries',
        type: 'collect',
        target: 'wild-berries',
        required: 8,
        targetDisplayName: 'Wild Berries'
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 40
      },
      {
        type: 'item',
        itemId: 'health-potion-minor',
        quantity: 3
      },
      {
        type: 'attribute',
        attribute: 'wisdom',
        value: 1
      }
    ],
    isRepeatable: true,
    repeatCooldown: 24, // 24 hours
    dialogueStart: 'I'm running low on supplies for my healing potions. Could you gather some herbs and berries from the forest? I'll teach you a bit about herbalism as a reward.',
    dialogueComplete: 'These are perfect! Thank you for your help. Here, take these potions I made earlier, and let me show you how to identify the most potent herbs.'
  },
  
  // Elder's wisdom quest
  {
    questId: 'village-history',
    title: 'Village History',
    description: 'Elder Thorne wishes to share the history of Shadowglen Village with newcomers to help them understand the region.',
    level: 1,
    type: 'side',
    giver: 'Elder Thorne',
    zone: 'starting-area',
    objectives: [
      {
        description: 'Listen to Elder Thorne's tales',
        type: 'talk',
        target: 'npc-elder-thorne',
        required: 1,
        targetDisplayName: 'Elder Thorne'
      },
      {
        description: 'Visit the Shrine of Renewal',
        type: 'interact',
        target: 'location-shrine-of-renewal',
        required: 1,
        targetDisplayName: 'Shrine of Renewal'
      },
      {
        description: 'Visit the village blacksmith',
        type: 'interact',
        target: 'location-grim\'s-forge',
        required: 1,
        targetDisplayName: 'Grim\'s Forge'
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 30
      },
      {
        type: 'gold',
        value: 15
      },
      {
        type: 'attribute',
        attribute: 'intelligence',
        value: 1
      }
    ],
    isRepeatable: false,
    dialogueStart: 'Welcome to our village, young one. To truly understand this place, you should learn of its history and visit some of our important landmarks. I'll share what I know if you're willing to listen.',
    dialogueComplete: 'Now you know something of our humble village. Remember these tales, for they may guide you in the days to come. Your interest in our history shows wisdom beyond your years.'
  },
  
  // Goblin threat quest - continues after wolf problem
  {
    questId: 'goblin-threat',
    title: 'The Goblin Threat',
    description: 'With the wolf problem handled, Captain Rodrick is now concerned about goblin scouts spotted near the village.',
    level: 2,
    type: 'main',
    giver: 'Captain Rodrick',
    zone: 'starting-area',
    objectives: [
      {
        description: 'Defeat goblin scouts',
        type: 'kill',
        target: 'goblin-1',
        required: 2,
        targetDisplayName: 'Goblin Scout'
      },
      {
        description: 'Collect goblin insignias',
        type: 'collect',
        target: 'bone-fetish',
        required: 2,
        targetDisplayName: 'Bone Fetish'
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 75
      },
      {
        type: 'gold',
        value: 50
      },
      {
        type: 'item',
        itemId: 'leather-boots',
        quantity: 1
      }
    ],
    prerequisiteQuests: ['wolf-problem'],
    isRepeatable: false,
    dialogueStart: 'Now that the wolves are under control, we have a new problem. Goblin scouts have been spotted near the village. This could mean trouble - their tribes rarely send scouts unless they're planning something. Eliminate them and bring back their tribal insignias so we can identify which clan they belong to.',
    dialogueComplete: 'These insignias... they're from the Boneclaw tribe. This is worse than I feared. Thank you for dealing with these scouts, but I fear this might just be the beginning of our troubles with the goblins. Still, you've bought us valuable time to prepare.'
  },
  
  // Daily repeatable quest
  {
    questId: 'forest-patrol',
    title: 'Forest Patrol',
    description: 'Help keep the forest paths safe by patrolling and eliminating threats.',
    level: 2,
    type: 'daily',
    giver: 'Captain Rodrick',
    zone: 'starting-area',
    objectives: [
      {
        description: 'Defeat any monsters',
        type: 'kill',
        target: 'any',
        required: 5,
        targetDisplayName: 'Any Monster'
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 40
      },
      {
        type: 'gold',
        value: 30
      }
    ],
    prerequisiteQuests: ['wolf-problem'],
    isRepeatable: true,
    repeatCooldown: 24, // 24 hours
    dialogueStart: 'We need to keep the forest paths safe for travelers. Can you patrol the area and deal with any threats you find?',
    dialogueComplete: 'Good work. That should keep the paths safe for today at least. Come back tomorrow if you're looking for more work.'
  }
];

module.exports = sampleQuests;