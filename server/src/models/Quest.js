const mongoose = require('mongoose');

const ObjectiveSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['kill', 'collect', 'talk', 'discover', 'interact', 'craft', 'deliver'],
    required: true
  },
  target: {
    type: String,
    required: true
  },
  required: {
    type: Number,
    default: 1
  },
  targetDisplayName: {
    type: String,
    default: null
  }
});

const RewardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['experience', 'gold', 'item', 'attribute', 'reputation'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  itemId: {
    type: String
  },
  quantity: {
    type: Number,
    default: 1
  },
  attribute: {
    type: String,
    enum: ['strength', 'dexterity', 'intelligence', 'constitution', 'wisdom', 'vitality']
  },
  faction: {
    type: String
  }
});

const QuestSchema = new mongoose.Schema({
  questId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    enum: ['main', 'side', 'daily', 'repeatable', 'achievement', 'event'],
    default: 'side'
  },
  giver: {
    type: String
  },
  zone: {
    type: String
  },
  position: {
    x: Number,
    y: Number
  },
  objectives: [ObjectiveSchema],
  rewards: [RewardSchema],
  prerequisiteQuests: [{
    type: String
  }],
  isRepeatable: {
    type: Boolean,
    default: false
  },
  repeatCooldown: {
    type: Number,
    default: 0 // In hours, 0 = no cooldown
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dialogueStart: {
    type: String
  },
  dialogueComplete: {
    type: String
  },
  dialogueProgress: [{
    progress: Number,
    text: String
  }]
}, {
  timestamps: true
});

const Quest = mongoose.model('Quest', QuestSchema);

module.exports = Quest;