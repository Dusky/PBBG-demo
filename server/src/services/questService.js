/**
 * Quest Service
 * 
 * Handles all quest-related functionality, including accepting, tracking, completing quests,
 * and updating quest objectives.
 */

const mongoose = require('mongoose');
const Player = require('../models/Player');
const Quest = require('../models/Quest');

/**
 * Get all available quests for a player
 * @param {string} playerId - Player's ID
 * @returns {Promise<Array>} - Array of available quests
 */
async function getAvailableQuests(playerId) {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error(`Player not found: ${playerId}`);
    }
    
    // Get current zone to find zone-specific quests
    const currentZone = player.character.currentZone;
    const playerLevel = player.character.level;
    
    // Get player's active and completed quests
    const activeQuestIds = player.character.quests
      .filter(q => q.status === 'active')
      .map(q => q.questId);
    
    const completedQuestIds = player.character.quests
      .filter(q => q.status === 'completed')
      .map(q => q.questId);
    
    // Find quests that match the player's level and zone
    const availableQuests = await Quest.find({
      isActive: true,
      level: { $lte: playerLevel + 2 }, // Allow quests up to 2 levels higher
      $or: [
        { zone: currentZone },
        { zone: null }, // Global quests
        { zone: { $exists: false } }
      ]
    });
    
    // Filter out quests that the player has already completed or is working on
    const filteredQuests = availableQuests.filter(quest => {
      // Skip already active quests
      if (activeQuestIds.includes(quest.questId)) {
        return false;
      }
      
      // Skip completed non-repeatable quests
      if (completedQuestIds.includes(quest.questId) && !quest.isRepeatable) {
        return false;
      }
      
      // Check prerequisites
      if (quest.prerequisiteQuests && quest.prerequisiteQuests.length > 0) {
        for (const prereqId of quest.prerequisiteQuests) {
          if (!completedQuestIds.includes(prereqId)) {
            return false; // Missing prerequisite
          }
        }
      }
      
      return true;
    });
    
    // Format quests for client display
    return filteredQuests.map(quest => ({
      questId: quest.questId,
      title: quest.title,
      description: quest.description,
      level: quest.level,
      type: quest.type,
      giver: quest.giver,
      isRepeatable: quest.isRepeatable,
      objectives: quest.objectives.map(obj => ({
        description: obj.description,
        type: obj.type,
        required: obj.required,
        targetDisplayName: obj.targetDisplayName || obj.target
      })),
      rewards: quest.rewards.map(reward => {
        const formattedReward = {
          type: reward.type,
          value: reward.value
        };
        
        if (reward.type === 'item' && reward.itemId) {
          formattedReward.itemId = reward.itemId;
          formattedReward.quantity = reward.quantity || 1;
        }
        
        return formattedReward;
      })
    }));
  } catch (error) {
    console.error('Error getting available quests:', error);
    return [];
  }
}

/**
 * Get active quests for a player
 * @param {string} playerId - Player's ID 
 * @returns {Promise<Array>} - Array of active quests with details
 */
async function getActiveQuests(playerId) {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error(`Player not found: ${playerId}`);
    }
    
    const activePlayerQuests = player.character.quests.filter(q => q.status === 'active');
    
    // Get full quest details for each active quest
    const questDetails = [];
    
    for (const playerQuest of activePlayerQuests) {
      const questData = await Quest.findOne({ questId: playerQuest.questId });
      
      if (questData) {
        questDetails.push({
          questId: playerQuest.questId,
          title: questData.title,
          description: questData.description,
          level: questData.level,
          type: questData.type,
          status: playerQuest.status,
          progress: playerQuest.progress,
          startedAt: playerQuest.startedAt,
          objectives: playerQuest.objectives.map(obj => ({
            description: obj.description,
            type: obj.type,
            target: obj.target,
            required: obj.required,
            current: obj.current,
            completed: obj.completed
          }))
        });
      }
    }
    
    return questDetails;
  } catch (error) {
    console.error('Error getting active quests:', error);
    return [];
  }
}

/**
 * Accept a quest
 * @param {string} playerId - Player's ID
 * @param {string} questId - Quest ID to accept
 * @returns {Promise<Object>} - Result of accepting quest
 */
async function acceptQuest(playerId, questId) {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return { success: false, message: 'Player not found' };
    }
    
    // Check if player already has this quest
    const existingQuest = player.character.quests.find(q => q.questId === questId);
    if (existingQuest && existingQuest.status === 'active') {
      return { success: false, message: 'Quest already accepted' };
    }
    
    // Get quest details
    const quest = await Quest.findOne({ questId });
    if (!quest) {
      return { success: false, message: 'Quest not found' };
    }
    
    // Check if player meets level requirement
    if (player.character.level < quest.level) {
      return { 
        success: false, 
        message: `You need to be at least level ${quest.level} to accept this quest` 
      };
    }
    
    // Check prerequisites
    if (quest.prerequisiteQuests && quest.prerequisiteQuests.length > 0) {
      const completedQuestIds = player.character.quests
        .filter(q => q.status === 'completed')
        .map(q => q.questId);
      
      for (const prereqId of quest.prerequisiteQuests) {
        if (!completedQuestIds.includes(prereqId)) {
          return { 
            success: false, 
            message: 'You have not completed the prerequisite quests' 
          };
        }
      }
    }
    
    // Format objectives for player tracking
    const playerObjectives = quest.objectives.map(obj => ({
      description: obj.description,
      type: obj.type,
      target: obj.target,
      required: obj.required,
      current: 0,
      completed: false
    }));
    
    // Add the quest to player's active quests
    const now = new Date();
    
    // If they had this quest before and failed/abandoned, update it
    if (existingQuest) {
      existingQuest.status = 'active';
      existingQuest.progress = 0;
      existingQuest.objectives = playerObjectives;
      existingQuest.startedAt = now;
      existingQuest.completedAt = null;
    } else {
      // Add as a new quest
      player.character.quests.push({
        questId: quest.questId,
        name: quest.title,
        status: 'active',
        progress: 0,
        objectives: playerObjectives,
        startedAt: now
      });
    }
    
    await player.save();
    
    return {
      success: true,
      message: `Accepted quest: ${quest.title}`,
      quest: {
        questId: quest.questId,
        title: quest.title,
        description: quest.description,
        objectives: playerObjectives,
        dialogueStart: quest.dialogueStart
      }
    };
  } catch (error) {
    console.error('Error accepting quest:', error);
    return { 
      success: false, 
      message: 'Error accepting quest' 
    };
  }
}

/**
 * Update quest progress based on player actions
 * @param {string} playerId - Player's ID
 * @param {string} actionType - Type of action (kill, collect, etc.)
 * @param {string} targetId - ID of the target (monster, item, etc.)
 * @param {number} amount - Amount to progress (default 1)
 * @returns {Promise<Object>} - Result of updating quest progress
 */
async function updateQuestProgress(playerId, actionType, targetId, amount = 1) {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return { 
        success: false, 
        message: 'Player not found' 
      };
    }
    
    // Find active quests with matching objective type and target
    const questsUpdated = [];
    
    for (const playerQuest of player.character.quests) {
      // Skip completed or failed quests
      if (playerQuest.status !== 'active') continue;
      
      let questUpdated = false;
      
      // Check each objective
      for (const objective of playerQuest.objectives) {
        // Skip already completed objectives
        if (objective.completed) continue;
        
        // Check if this objective matches the action type and target
        if (objective.type === actionType && objective.target === targetId) {
          // Update progress
          objective.current += amount;
          
          // Check if objective is now completed
          if (objective.current >= objective.required) {
            objective.current = objective.required;
            objective.completed = true;
          }
          
          questUpdated = true;
        }
      }
      
      // If any objectives were updated, check if all objectives are complete
      if (questUpdated) {
        const allCompleted = playerQuest.objectives.every(obj => obj.completed);
        
        questsUpdated.push({
          questId: playerQuest.questId,
          name: playerQuest.name,
          objectivesUpdated: playerQuest.objectives.filter(obj => 
            obj.type === actionType && obj.target === targetId
          ),
          completed: allCompleted
        });
        
        // Mark the quest as ready to complete if all objectives are done
        if (allCompleted) {
          playerQuest.progress = 100;
          // Note: We don't automatically complete the quest here,
          // the player needs to turn it in
        } else {
          // Calculate approximate progress percentage
          const totalRequired = playerQuest.objectives.reduce((sum, obj) => sum + obj.required, 0);
          const totalCurrent = playerQuest.objectives.reduce((sum, obj) => sum + obj.current, 0);
          playerQuest.progress = Math.floor((totalCurrent / totalRequired) * 100);
        }
      }
    }
    
    // Save changes if any quests were updated
    if (questsUpdated.length > 0) {
      await player.save();
    }
    
    return {
      success: true,
      questsUpdated,
      message: questsUpdated.length > 0 ? 'Quest progress updated' : 'No matching quest objectives found'
    };
  } catch (error) {
    console.error('Error updating quest progress:', error);
    return { 
      success: false, 
      message: 'Error updating quest progress' 
    };
  }
}

/**
 * Complete a quest and grant rewards
 * @param {string} playerId - Player's ID
 * @param {string} questId - Quest ID to complete
 * @returns {Promise<Object>} - Result of completing quest
 */
async function completeQuest(playerId, questId) {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return { 
        success: false, 
        message: 'Player not found' 
      };
    }
    
    // Find the quest in player's active quests
    const playerQuest = player.character.quests.find(
      q => q.questId === questId && q.status === 'active'
    );
    
    if (!playerQuest) {
      return { 
        success: false, 
        message: 'Quest not found or not active' 
      };
    }
    
    // Check if all objectives are completed
    const allCompleted = playerQuest.objectives.every(obj => obj.completed);
    if (!allCompleted) {
      return { 
        success: false, 
        message: 'Not all quest objectives are completed' 
      };
    }
    
    // Get quest details for rewards
    const quest = await Quest.findOne({ questId });
    if (!quest) {
      return { 
        success: false, 
        message: 'Quest details not found' 
      };
    }
    
    // Process rewards
    const rewardsGiven = [];
    
    for (const reward of quest.rewards) {
      switch (reward.type) {
        case 'experience':
          // Add experience and check for level up
          const expResult = await player.addExperience(reward.value);
          rewardsGiven.push({
            type: 'experience',
            value: reward.value,
            levelUp: expResult.leveledUp,
            newLevel: expResult.leveledUp ? expResult.newLevel : null
          });
          break;
          
        case 'gold':
          // Add gold
          player.character.gold.carried += reward.value;
          rewardsGiven.push({
            type: 'gold',
            value: reward.value
          });
          break;
          
        case 'item':
          // Add item to inventory
          if (reward.itemId) {
            // Find existing stack or add new item
            const existingItem = player.character.inventory.find(
              item => item.itemId === reward.itemId
            );
            
            if (existingItem && existingItem.stackable !== false) {
              existingItem.quantity += reward.quantity || 1;
            } else {
              player.character.inventory.push({
                itemId: reward.itemId,
                quantity: reward.quantity || 1,
                acquiredAt: new Date()
              });
            }
            
            rewardsGiven.push({
              type: 'item',
              itemId: reward.itemId,
              quantity: reward.quantity || 1
            });
          }
          break;
          
        case 'attribute':
          // Increase an attribute
          if (reward.attribute && player.character.attributes[reward.attribute]) {
            player.character.attributes[reward.attribute] += reward.value;
            rewardsGiven.push({
              type: 'attribute',
              attribute: reward.attribute,
              value: reward.value
            });
          }
          break;
      }
    }
    
    // Mark quest as completed
    playerQuest.status = 'completed';
    playerQuest.completedAt = new Date();
    
    // For repeatable quests, reset it after a cooldown period
    if (quest.isRepeatable) {
      // Track when completed for cooldown purposes
      if (!player.character.repeatedQuests) {
        player.character.repeatedQuests = [];
      }
      
      player.character.repeatedQuests.push({
        questId: quest.questId,
        completedAt: new Date()
      });
    }
    
    await player.save();
    
    return {
      success: true,
      message: `Completed quest: ${quest.title}`,
      rewards: rewardsGiven,
      dialogueComplete: quest.dialogueComplete
    };
  } catch (error) {
    console.error('Error completing quest:', error);
    return { 
      success: false, 
      message: 'Error completing quest' 
    };
  }
}

module.exports = {
  getAvailableQuests,
  getActiveQuests,
  acceptQuest,
  updateQuestProgress,
  completeQuest
};