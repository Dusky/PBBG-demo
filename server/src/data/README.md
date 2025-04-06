# Fantasy MMORPG Sample Data

This directory contains sample game content data and scripts for populating the MongoDB database with initial content for the Fantasy Text-Based MMORPG.

## Sample Data Files

- **sampleZones.js** - Contains definitions for game zones including starting area, training grounds, and various adventure areas.
- **sampleMonsters.js** - Contains definitions for game monsters with different difficulties and abilities.
- **sampleItems.js** - Contains definitions for game items, including weapons, armor, consumables, and materials.

## Data Structure

Each sample file exports an array of objects with properties matching the MongoDB schemas defined in the models directory.

## Seeding the Database

The `seedDatabase.js` script will connect to MongoDB and load all the sample data into the database.

### Prerequisites

1. MongoDB must be running on localhost:27017 or configured in the server's `.env` file.
2. The appropriate models must be defined in the `server/src/models` directory.

### Running the Seed Script

From the server directory, run:

```bash
node src/data/seedDatabase.js
```

### Configuration

The script looks for the MongoDB connection string in the following places:

1. The `MONGODB_URI` environment variable in the `.env` file
2. Fallback: `mongodb://127.0.0.1:27017/fantasy-mmorpg`

### What the Script Does

1. Connects to MongoDB
2. Clears existing data in the Zones, Monsters, and Items collections
3. Inserts the sample data from the respective files
4. Reports success or failure for each collection
5. Closes the MongoDB connection

### Example Output

```
Connecting to MongoDB at mongodb://127.0.0.1:27017/fantasy-mmorpg
MongoDB connected successfully
Cleared existing zones
Inserted 7 zones
Cleared existing monsters
Inserted 9 monsters
Cleared existing items
Inserted 120 items

--- Seeding Results ---
Zones: SUCCESS
Monsters: SUCCESS
Items: SUCCESS
Database connection closed
Database seeding completed successfully!
```

## Extending the Sample Data

To add more content:

1. Add new objects to the respective sample file arrays
2. Run the seeding script to update the database

## Notes for Developers

- The sample data is designed to provide a coherent gaming experience from the start
- Zones are interconnected according to the zone connections defined in each zone object
- Monsters are balanced for a level 1-5 character progression
- Items include a variety of equipment suitable for beginning players 