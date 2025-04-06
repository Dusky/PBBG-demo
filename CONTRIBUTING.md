# Contributing to Fantasy Text MMORPG

Thank you for your interest in contributing to our Fantasy Text MMORPG! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```
   # Server dependencies
   cd server
   npm install
   
   # Client dependencies
   cd client
   npm install
   ```
3. Create a `.env` file in the server directory with appropriate environment variables
4. Run the development servers:
   ```
   # Server (from server directory)
   npm run dev
   
   # Client (from client directory)
   npm run serve
   ```

## Project Structure

### Server-Side (Node.js/Express)

- `server/src/models` - MongoDB models for game entities
- `server/src/services` - Business logic for game functionality
- `server/src/routes` - API routes
- `server/src/middleware` - Express middleware
- `server/src/data` - Seed data and game content

### Client-Side (Vue.js)

- `client/src/components` - Vue components
- `client/src/views` - Page-level Vue components
- `client/src/assets` - Static assets
- `client/src/services` - API service modules

## Coding Standards

### General

- Use meaningful variable and function names
- Write clear comments for complex logic
- Keep functions small and focused
- Follow the existing code style and patterns

### Server-Side

- Use async/await for asynchronous operations
- Validate input data before processing
- Handle errors and provide appropriate error messages
- Use middleware for authentication and authorization

### Client-Side

- Follow Vue.js best practices
- Use composition API style (setup function)
- Keep components reusable and maintainable
- Use reactive data appropriately

## Game Systems Overview

### Character System

Characters have:
- Basic stats (health, mana)
- Attributes (STR, DEX, CON, INT, WIS, VIT)
- Inventory and equipment
- Experience and levels

### Combat System

Combat is:
- Turn-based and automatic
- Attribute-driven (STR for damage, DEX for crits, etc.)
- Monster state is persisted between attacks
- Includes critical hits and damage resistances

### Zone System

Zones:
- Have connections to other zones
- Contain monsters and resources
- Include descriptive information
- Display as an interactive grid map

## Adding Content

### Adding a New Monster

1. Define the monster in the appropriate data file
2. Set up proper attributes and stats
3. Add to zone spawning system
4. Test combat balance

### Adding a New Zone

1. Create the zone definition in data files
2. Establish connections to existing zones
3. Populate with appropriate monsters and resources
4. Add any special features or mechanics

## Pull Request Process

1. Create a feature branch for your changes
2. Make your changes with appropriate tests
3. Ensure all tests pass
4. Update documentation if necessary
5. Submit a pull request with a clear description of changes
6. Address any feedback from code reviews

## Bug Reports

When reporting bugs, please include:
- Detailed steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or console logs if applicable
- Browser/environment information

## Feature Requests

Feature requests are welcome! Please provide:
- Clear description of the feature
- Rationale for adding it
- Any relevant examples or mockups

## Communication

- Use GitHub issues for bug reports and feature requests
- Join our Discord server for real-time discussion
- Participate in regular developer meetings

Thank you for contributing to make our Fantasy Text MMORPG even better! 