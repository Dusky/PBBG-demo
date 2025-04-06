const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['weapon', 'armor', 'consumable', 'quest', 'miscellaneous'],
    required: true
  },
  subType: {
    type: String,
    enum: [
      // Weapon subtypes
      'sword', 'axe', 'mace', 'staff', 'wand', 'bow', 'dagger', 
      // Armor subtypes
      'head', 'body', 'legs', 'feet', 'hands', 'shield', 
      // Consumable subtypes
      'potion', 'food', 'scroll', 
      // Other
      'key', 'material', 'treasure', null
    ],
    default: null
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  value: {
    type: Number,
    default: 0,
    min: 0
  },
  stackable: {
    type: Boolean,
    default: false
  },
  maxStack: {
    type: Number,
    default: 1
  },
  equippable: {
    type: Boolean,
    default: false
  },
  equipSlot: {
    type: String,
    enum: ['head', 'body', 'legs', 'feet', 'hands', 'mainHand', 'offHand', null],
    default: null
  },
  attributes: {
    damage: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
    defense: { type: Number, default: 0 },
    strengthBonus: { type: Number, default: 0 },
    dexterityBonus: { type: Number, default: 0 },
    intelligenceBonus: { type: Number, default: 0 },
    constitutionBonus: { type: Number, default: 0 },
    healthBonus: { type: Number, default: 0 },
    manaBonus: { type: Number, default: 0 }
  },
  effects: [{
    type: {
      type: String,
      enum: ['heal', 'damage', 'buff', 'debuff'],
      required: function() { return this.effects.length > 0; }
    },
    target: {
      type: String,
      enum: ['self', 'enemy', 'ally', 'all'],
      required: function() { return this.effects.length > 0; }
    },
    value: {
      type: Number,
      required: function() { return this.effects.length > 0; }
    },
    duration: {
      type: Number,
      default: 0 // 0 means instant, > 0 means duration in turns
    }
  }],
  requiredLevel: {
    type: Number,
    default: 1,
    min: 1
  },
  isQuestItem: {
    type: Boolean,
    default: false
  },
  dropRate: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.05 // 5% drop rate
  }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item; 