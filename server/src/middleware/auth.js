const jwt = require('jsonwebtoken');
const Player = require('../models/Player');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Find player
    const player = await Player.findById(decoded.id);
    
    if (!player) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Update last active timestamp
    player.lastActive = Date.now();
    await player.save();
    
    // Add player to request
    req.player = player;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

module.exports = auth; 