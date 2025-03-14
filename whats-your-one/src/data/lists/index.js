// src/data/lists/index.js
import * as defaultLists from './defaultLists';
import * as userLists from './userLists';

// Get a list by ID - checks both default and user lists
export async function getListById(id) {
  // First check default lists
  if (defaultLists.hasListId(id)) {
    return await defaultLists.getListById(id);
  }
  
  // Then check user lists
  return await userLists.getListById(id);
}

// Get metadata for all lists without loading all items
export async function getAllListsMetadata() {
  const defaultListsMeta = await defaultLists.getAllListsMetadata();
  const userListsMeta = await userLists.getAllListsMetadata();
  
  return [...defaultListsMeta, ...userListsMeta];
}

// Create a new user list
export async function createNewList(id, title, description, items) {
  return await userLists.createNewList(id, title, description, items);
}

// Daily challenge functions
export function getSeededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash; 
  }
  return Math.abs((hash % 1000) / 1000);
}

// Get daily items with better distribution across lists
export async function getDailyItems(listId = null, date = new Date()) {
  const dateString = date.toISOString().split('T')[0];
  
  // If getting items from a specific list, use the current implementation
  if (listId && listId !== 'all') {
    const list = await getListById(listId);
    if (!list) return [];
    
    // Shuffle deterministically using the date seed
    const shuffled = [...list.items].sort((a, b) => {
      const seedA = dateString + a.id;
      const seedB = dateString + b.id;
      return getSeededRandom(seedA) - getSeededRandom(seedB);
    });
    
    // Take the first 10 items
    return shuffled.slice(0, Math.min(10, shuffled.length)).map(item => ({
      ...item,
      originList: list.title,
      originListId: list.id
    }));
  }
  
  // For the "all" option, use a more balanced approach
  const allListsMeta = await getAllListsMetadata();
  
  // Create a more balanced selection of items
  const selectedItems = [];
  const targetItemCount = 10;
  
  // First pass: Try to get one item from each list
  const availableLists = [...allListsMeta]; // Make a copy so we can modify it
  
  // Shuffle the lists in a deterministic way based on the date
  availableLists.sort((a, b) => {
    const seedA = dateString + a.id;
    const seedB = dateString + b.id;
    return getSeededRandom(seedA) - getSeededRandom(seedB);
  });
  
  // First, try to get one item from each list
  for (const listMeta of availableLists) {
    if (selectedItems.length >= targetItemCount) break;
    
    const list = await getListById(listMeta.id);
    if (!list || list.items.length === 0) continue;
    
    // Deterministically shuffle the items
    const shuffledItems = [...list.items].sort((a, b) => {
      const seedA = dateString + a.id;
      const seedB = dateString + b.id;
      return getSeededRandom(seedA) - getSeededRandom(seedB);
    });
    
    // Add the first item
    selectedItems.push({
      ...shuffledItems[0],
      originList: list.title,
      originListId: list.id
    });
  }
  
  // If we still need more items, do a second pass with the remaining slots
  if (selectedItems.length < targetItemCount) {
    // Reshuffle the lists for the second pass
    availableLists.sort((a, b) => {
      const seedA = dateString + 'second-pass-' + a.id;
      const seedB = dateString + 'second-pass-' + b.id;
      return getSeededRandom(seedA) - getSeededRandom(seedB);
    });
    
    // Track which items we've already selected to avoid duplicates
    const selectedItemIds = new Set(selectedItems.map(item => item.id));
    
    // Fill remaining slots
    for (const listMeta of availableLists) {
      if (selectedItems.length >= targetItemCount) break;
      
      const list = await getListById(listMeta.id);
      if (!list || list.items.length <= 1) continue; // Skip if empty or only had one item (which we already took)
      
      // Get items we haven't selected yet
      const remainingItems = list.items.filter(item => !selectedItemIds.has(item.id));
      if (remainingItems.length === 0) continue;
      
      // Deterministically shuffle the remaining items
      const shuffledItems = [...remainingItems].sort((a, b) => {
        const seedA = dateString + 'second-' + a.id;
        const seedB = dateString + 'second-' + b.id;
        return getSeededRandom(seedA) - getSeededRandom(seedB);
      });
      
      // Add the first item from this second shuffle
      selectedItems.push({
        ...shuffledItems[0],
        originList: list.title,
        originListId: list.id
      });
      
      // Update our tracking set
      selectedItemIds.add(shuffledItems[0].id);
    }
  }
  
  // If we still don't have enough items (unlikely), we'd need a third pass
  // that's less strict about list diversity
  if (selectedItems.length < targetItemCount) {
    // Get all remaining items not yet selected
    const selectedItemIds = new Set(selectedItems.map(item => item.id));
    const allRemainingItems = [];
    
    for (const listMeta of allListsMeta) {
      const list = await getListById(listMeta.id);
      if (!list) continue;
      
      // Add remaining items we haven't selected yet
      for (const item of list.items) {
        if (!selectedItemIds.has(item.id)) {
          allRemainingItems.push({
            ...item,
            originList: list.title,
            originListId: list.id
          });
        }
      }
    }
    
    // Deterministically shuffle all remaining items
    allRemainingItems.sort((a, b) => {
      const seedA = dateString + 'final-' + a.id;
      const seedB = dateString + 'final-' + b.id;
      return getSeededRandom(seedA) - getSeededRandom(seedB);
    });
    
    // Add as many as needed to reach the target
    const neededCount = targetItemCount - selectedItems.length;
    selectedItems.push(...allRemainingItems.slice(0, neededCount));
  }
  
  // Final shuffle to mix up the order (still deterministic by date)
  return selectedItems.sort((a, b) => {
    const seedA = dateString + 'final-order-' + a.id;
    const seedB = dateString + 'final-order-' + b.id;
    return getSeededRandom(seedA) - getSeededRandom(seedB);
  });
}

// Storage functions for daily results
export function saveDailyResult(listId, date, itemId) {
  const dateString = date.toISOString().split('T')[0];
  const key = `whats-your-one-daily-${listId}-${dateString}`;
  
  try {
    localStorage.setItem(key, itemId);
    return true;
  } catch (e) {
    console.error('Failed to save daily result:', e);
    return false;
  }
}

export function getDailyResult(listId, date = new Date()) {
  const dateString = date.toISOString().split('T')[0];
  const key = `whats-your-one-daily-${listId}-${dateString}`;
  
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('Failed to get daily result:', e);
    return null;
  }
}

export async function getAllDailyResults(date = new Date()) {
  const dateString = date.toISOString().split('T')[0];
  const results = [];
  
  // Check for main daily challenge
  const dailyAllResult = getDailyResult('all', date);
  if (dailyAllResult) {
    // Find the item in any list
    const allListsMeta = await getAllListsMetadata();
    
    for (const listMeta of allListsMeta) {
      const list = await getListById(listMeta.id);
      const item = list.items.find(item => item.id === dailyAllResult);
      
      if (item) {
        results.push({
          listId: 'all',
          listTitle: 'Daily Challenge',
          item: {
            ...item,
            listId: list.id,
            listTitle: list.title
          }
        });
        break;
      }
    }
  }
  
  // Check results for each list
  const allListsMeta = await getAllListsMetadata();
  for (const listMeta of allListsMeta) {
    const listResult = getDailyResult(listMeta.id, date);
    if (listResult) {
      const list = await getListById(listMeta.id);
      const item = list.items.find(item => item.id === listResult);
      
      if (item) {
        results.push({
          listId: list.id,
          listTitle: list.title,
          item: item
        });
      }
    }
  }
  
  return results;
}