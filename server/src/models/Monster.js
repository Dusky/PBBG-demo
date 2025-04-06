const mongoose = require('mongoose');

const MonsterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  type: {
    type: String,
    enum: ['humanoid', 'beast', 'undead', 'elemental', 'demon', 'dragon', 'construct', 'aberration'],
    default: 'beast'
  },
  aggression: {
    type: String,
    enum: ['passive', 'neutral', 'aggressive'],
    default: 'neutral'
  },
  attributes: {
    strength: { type: Number, default: 5 },
    dexterity: { type: Number, default: 5 },
    intelligence: { type: Number, default: 5 },
    constitution: { type: Number, default: 5 },
    wisdom: { type: Number, default: 5 },
    vitality: { type: Number, default: 5 }
  },
  stats: {
    health: {
      base: { type: Number, required: true },
      current: { type: Number }
    },
    damage: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    defense: { type: Number, default: 0 },
    accuracy: { type: Number, default: 70 }, // percentage
    evasion: { type: Number, default: 10 },  // percentage
    attackSpeed: { type: Number, default: 1.5 }, // attacks per second
    critChance: { type: Number, default: 5 }, // percentage
    critMultiplier: { type: Number, default: 1.5 } // multiplier
  },
  abilities: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    damage: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
    effect: {
      type: {
        type: String,
        enum: ['damage', 'heal', 'buff', 'debuff', 'stun', 'dot'],
        default: 'damage'
      },
      value: { type: Number, default: 0 },
      duration: { type: Number, default: 0 } // in combat turns
    },
    cooldown: { type: Number, default: 3 }, // in combat turns
    useChance: { type: Number, default: 0.2, min: 0, max: 1 } // percentage chance to use this ability when available
  }],
  loot: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    dropRate: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.1
    },
    minQuantity: {
      type: Number,
      default: 1
    },
    maxQuantity: {
      type: Number,
      default: 1
    }
  }],
  experienceValue: {
    type: Number,
    required: true,
    min: 1
  },
  goldValue: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10 }
  },
  respawnTime: {
    type: Number,
    default: 60, // in seconds
    min: 1
  },
  isBoss: {
    type: Boolean,
    default: false
  },
  flavor: {
    attackMessages: [{ type: String }],
    deathMessages: [{ type: String }],
    spawnMessages: [{ type: String }]
  }
}, {
  timestamps: true
});

const Monster = mongoose.model('Monster', MonsterSchema);

module.exports = Monster; 