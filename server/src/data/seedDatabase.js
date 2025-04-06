/**
 * Database Seeding Script
 * 
 * This script loads sample data into MongoDB for the Fantasy MMORPG.
 * Run with: node seedDatabase.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const sampleZones = require('./sampleZones');
const sampleMonsters = require('./sampleMonsters');
const sampleItems = require('./sampleItems');

// Import your models
const Zone = require('../models/Zone');
const Monster = require('../models/Monster');
const Item = require('../models/Item');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fantasy-mmorpg';
    console.log(`Connecting to MongoDB at ${uri}`);
    
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Seed zones
const seedZones = async () => {
  try {
    // Clear existing zones
    await Zone.deleteMany({});
    console.log('Cleared existing zones');
    
    // Insert sample zones
    const result = await Zone.insertMany(sampleZones);
    console.log(`Inserted ${result.length} zones`);
    return true;
  } catch (error) {
    console.error('Error seeding zones:', error);
    return false;
  }
};

// Seed monsters
const seedMonsters = async () => {
  try {
    // Clear existing monsters
    await Monster.deleteMany({});
    console.log('Cleared existing monsters');
    
    // Insert sample monsters
    const result = await Monster.insertMany(sampleMonsters);
    console.log(`Inserted ${result.length} monsters`);
    return true;
  } catch (error) {
    console.error('Error seeding monsters:', error);
    return false;
  }
};

// Seed items
const seedItems = async () => {
  try {
    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');
    
    // Insert sample items
    const result = await Item.insertMany(sampleItems);
    console.log(`Inserted ${result.length} items`);
    return true;
  } catch (error) {
    console.error('Error seeding items:', error);
    return false;
  }
};

// Main function to run all seeding operations
const seedAll = async () => {
  // Connect to database
  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to database. Exiting.');
    process.exit(1);
  }
  
  // Seed data
  const zonesSeeded = await seedZones();
  const monstersSeeded = await seedMonsters();
  const itemsSeeded = await seedItems();
  
  // Report results
  console.log('\n--- Seeding Results ---');
  console.log(`Zones: ${zonesSeeded ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Monsters: ${monstersSeeded ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Items: ${itemsSeeded ? 'SUCCESS' : 'FAILED'}`);
  
  // Close connection
  await mongoose.connection.close();
  console.log('Database connection closed');
  
  // Exit with appropriate code
  if (zonesSeeded && monstersSeeded && itemsSeeded) {
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } else {
    console.error('Database seeding completed with errors.');
    process.exit(1);
  }
};

// Run the seeding process
seedAll(); 