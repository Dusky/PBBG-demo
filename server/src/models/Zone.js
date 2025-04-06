const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  levelRange: {
    min: {
      type: Number,
      required: true,
      default: 1
    },
    max: {
      type: Number,
      required: true,
      default: 5
    }
  },
  terrain: {
    type: String,
    enum: ['forest', 'mountains', 'desert', 'swamp', 'plains', 'dungeon', 'cave', 'village', 'city'],
    default: 'forest'
  },
  isDangerous: {
    type: Boolean,
    default: true
  },
  isSafe: {
    type: Boolean,
    default: false
  },
  isStartingZone: {
    type: Boolean,
    default: false
  },
  connections: [{
    zoneName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    direction: {
      type: String,
      enum: ['north', 'south', 'east', 'west', 'up', 'down', 'portal'],
      required: true
    },
    requiredLevel: {
      type: Number,
      default: 1
    },
    requiredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    }
  }],
  monsters: [{
    monsterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monster',
      required: true
    },
    spawnRate: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.3
    },
    maxCount: {
      type: Number,
      default: 5
    }
  }],
  npcs: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    dialogue: [{
      text: String,
      response: String,
      condition: {
        type: String,
        default: null
      }
    }],
    isQuestGiver: {
      type: Boolean,
      default: false
    },
    isVendor: {
      type: Boolean,
      default: false
    },
    inventory: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      price: {
        type: Number,
        default: 0
      },
      stock: {
        type: Number,
        default: -1 // -1 means unlimited
      }
    }]
  }],
  resources: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    harvestTime: {
      type: Number,
      default: 5 // in seconds
    },
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
      },
      dropRate: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
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
    respawnTime: {
      type: Number,
      default: 300 // in seconds (5 minutes)
    }
  }],
  ambientText: [{
    type: String
  }]
}, {
  timestamps: true
});

const Zone = mongoose.model('Zone', ZoneSchema);

module.exports = Zone; 