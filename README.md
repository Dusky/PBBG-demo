# Fantasy Text-Based Browser MMORPG

A modular fantasy MMORPG with a hybrid text and visual interface, built with modern web technologies.

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: Vue.js 3
- **Database**: MongoDB
- **Real-time Communication**: Socket.io

## Features

- Hybrid interface with text output and visual grid map
- Interactive navigation with directional controls
- Real-time multiplayer interactions
- Automatic turn-based combat system with monsters
- Item and equipment system
- Character progression with levels and stats
- Comprehensive attribute-based combat system
- Modular content system for easy addition of zones, items, and monsters
- Chat system (global, zone-based, and private)

## Advanced Combat System

The game features a robust attribute-based combat system:

- **STR (Strength)**: Increases physical damage (5% per point)
- **DEX (Dexterity)**: Affects critical hit chance (0.5% per point)
- **CON (Constitution)**: Provides physical resistance (0.75% per point)
- **INT (Intelligence)**: Affects spell damage (not yet implemented)
- **WIS (Wisdom)**: Provides magic resistance (1% per point)
- **VIT (Vitality)**: Increases max health (5 HP per point)

Combat includes critical hits, damage resistances, and automatic counter-attacks from monsters.

## User Interface

The game combines traditional text-based gameplay with modern UI elements:

- **Visual Grid Map**: See your character's position and navigate the world using an interactive 9x9 grid
- **Directional Controls**: Easy movement with intuitive directional buttons
- **Zone-Based Monster List**: All monsters in the current zone are displayed for easy engagement
- **Automatic Combat**: Turn-based combat flows automatically with detailed combat logs
- **Player Stats**: View and track character statistics and equipment
- **Interactive Chat**: Communicate with other players through various chat channels
- **Combat Status Display**: Real-time health bars and combat information during battles

## Project Structure

```
/client         # Vue.js frontend
  /public       # Static assets
  /src          # Source files
    /components # Vue components
    /views      # Vue views/pages
    /assets     # Frontend assets

/server         # Node.js backend
  /src          # Source files
    /config     # Configuration files
    /controllers# Request handlers
    /middleware # Express middleware
    /models     # MongoDB models
    /routes     # API routes
    /services   # Business logic
    /data       # Game content data
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd client
   npm install
   ```

4. Create a `.env` file in the server directory based on `.env.example`

5. Start the development server:
   ```
   # In server directory
   npm run dev
   
   # In client directory (in a different terminal)
   npm run serve
   ```

6. Open your browser and navigate to `http://localhost:8080`

## Gameplay

1. **Navigation**: Use the directional buttons (North, South, East, West) to navigate the grid map
2. **Combat**: Click the "Attack" button next to a monster to initiate automatic combat
   - Combat proceeds automatically with turns every 3 seconds
   - You can retreat from combat using the "Retreat" button
   - Defeating monsters grants experience and loot
3. **Chat**: Use the chat panel to communicate with other players
4. **Inventory**: Manage your items and equipment in the inventory panel

## Adding New Content

The game is designed to be highly modular, making it easy to add new content:

### Adding Zones

Create a new zone in the database with connections to existing zones.

### Adding Monsters

Create new monster entries in the database with appropriate attributes and associate them with zones.

### Adding Items

Create new item entries in the database and add them to monster loot tables or zone resources.

## Roadmap

See our [milestones.md](./milestones.md) file for detailed development plans and progress tracking.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Vue.js, Node.js, and MongoDB
- Uses Socket.io for real-time communication 