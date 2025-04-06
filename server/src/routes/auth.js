const express = require('express');
const jwt = require('jsonwebtoken');
const Player = require('../models/Player');
const router = express.Router();

// Register a new player
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, characterName } = req.body;
    
    // Validate inputs
    if (!username || !email || !password || !characterName) {
      return res.status(400).json({ 
        message: 'All fields are required',
        validation: {
          isValid: false,
          fields: {
            username: !username ? 'Username is required' : null,
            email: !email ? 'Email is required' : null,
            password: !password ? 'Password is required' : null,
            characterName: !characterName ? 'Character name is required' : null
          }
        }
      });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        validation: {
          isValid: false,
          fields: {
            password: 'Password must be at least 6 characters long'
          }
        }
      });
    }
    
    // Check if username or email already exists
    const existingPlayer = await Player.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingPlayer) {
      const field = existingPlayer.username === username ? 'username' : 'email';
      return res.status(400).json({ 
        message: `This ${field} is already registered`,
        validation: {
          isValid: false,
          fields: {
            [field]: `This ${field} is already registered`
          }
        }
      });
    }
    
    // Create new player
    const newPlayer = new Player({
      username,
      email,
      password,
      character: {
        name: characterName
      }
    });
    
    // Save player to database
    await newPlayer.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: newPlayer._id }, 
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Player registered successfully',
      token,
      player: {
        id: newPlayer._id,
        username: newPlayer.username,
        character: newPlayer.character
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({ 
        message: 'Validation failed',
        validation: {
          isValid: false,
          fields: validationErrors
        }
      });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login player
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate inputs
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required',
        validation: {
          isValid: false,
          fields: {
            username: !username ? 'Username is required' : null,
            password: !password ? 'Password is required' : null
          }
        }
      });
    }
    
    // Find player by username
    const player = await Player.findOne({ username });
    
    if (!player) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        validation: {
          isValid: false,
          fields: {
            username: 'User not found'
          }
        }
      });
    }
    
    // Compare passwords
    const isMatch = await player.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        validation: {
          isValid: false,
          fields: {
            password: 'Incorrect password'
          }
        }
      });
    }
    
    // Update player online status
    player.isOnline = true;
    player.lastActive = Date.now();
    await player.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: player._id }, 
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      player: {
        id: player._id,
        username: player.username,
        character: player.character
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout player
router.post('/logout', async (req, res) => {
  try {
    const playerId = req.body.playerId;
    
    if (!playerId) {
      return res.status(400).json({ message: 'Player ID required' });
    }
    
    // Update player online status
    await Player.findByIdAndUpdate(playerId, {
      isOnline: false,
      lastActive: Date.now()
    });
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

module.exports = router; 