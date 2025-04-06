const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PlayerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  character: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: Number,
      default: 1
    },
    experience: {
      type: Number,
      default: 0
    },
    attributes: {
      strength: { type: Number, default: 10 },
      dexterity: { type: Number, default: 10 },
      intelligence: { type: Number, default: 10 },
      constitution: { type: Number, default: 10 },
      wisdom: { type: Number, default: 10 },
      vitality: { type: Number, default: 10 }
    },
    health: {
      current: { type: Number, default: 100 },
      max: { type: Number, default: 100 }
    },
    mana: {
      current: { type: Number, default: 50 },
      max: { type: Number, default: 50 }
    },
    inventory: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
    equipment: {
      head: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      body: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      legs: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      feet: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      hands: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      mainHand: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      offHand: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null }
    },
    currentZone: {
      type: String,
      default: 'starting-area'
    },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
PlayerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
PlayerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player; 