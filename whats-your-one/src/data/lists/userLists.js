// src/data/lists/userLists.js
// Handles user-created lists stored in localStorage

const USER_LISTS_KEY = 'whats-your-one-user-lists';
const placeholderBase = "https://via.placeholder.com/300x160?text=";

// Load user lists from localStorage
function loadUserLists() {
  try {
    const savedLists = localStorage.getItem(USER_LISTS_KEY);
    if (savedLists) {
      return JSON.parse(savedLists);
    }
  } catch (error) {
    console.error('Failed to load user lists from localStorage:', error);
  }
  return {};
}

// Save user lists to localStorage
function saveUserLists(lists) {
  try {
    localStorage.setItem(USER_LISTS_KEY, JSON.stringify(lists));
    return true;
  } catch (error) {
    console.error('Failed to save user lists to localStorage:', error);
    return false;
  }
}

// Check if a user list exists
export function hasListId(id) {
  const userLists = loadUserLists();
  return id in userLists;
}

// Get all user list IDs
export function getListIds() {
  const userLists = loadUserLists();
  return Object.keys(userLists);
}

// Get a user list by ID
export async function getListById(id) {
  const userLists = loadUserLists();
  return userLists[id] || null;
}

// Get metadata for all user lists
export async function getAllListsMetadata() {
  const userLists = loadUserLists();
  return Object.values(userLists).map(list => ({
    id: list.id,
    title: list.title,
    description: list.description,
    coverImage: list.coverImage,
    itemCount: list.items.length,
    isUserCreated: true
  }));
}

// Create a new user list
export async function createNewList(id, title, description, items) {
  const userLists = loadUserLists();
  
  // Check if ID already exists
  if (id in userLists) {
    throw new Error(`A list with ID "${id}" already exists`);
  }
  
  // Create the new list
  const newList = {
    id,
    title,
    description,
    coverImage: `${placeholderBase}${title.replace(/\s+/g, '')}`,
    items: items.map((item, index) => ({
      id: `${id}${index + 1}`,
      name: item
    })),
    isUserCreated: true
  };
  
  // Add to user lists
  userLists[id] = newList;
  
  // Save to localStorage
  saveUserLists(userLists);
  
  return newList;
}

// Delete a user list
export async function deleteList(id) {
  const userLists = loadUserLists();
  
  if (!(id in userLists)) {
    return false;
  }
  
  delete userLists[id];
  saveUserLists(userLists);
  
  return true;
}

// Edit an existing user list
export async function editList(id, updates) {
  const userLists = loadUserLists();
  
  if (!(id in userLists)) {
    return false;
  }
  
  userLists[id] = { ...userLists[id], ...updates };
  saveUserLists(userLists);
  
  return userLists[id];
}