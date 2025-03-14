// src/data/lists/defaultLists.js
// Registry of all built-in lists

// Default list registry - maps ID to module path
const listRegistry = {
  'movies': () => import('./movies.js'),
  'songs-2000s': () => import('./songs-2000s.js'),
  'sports-franchises': () => import('./sports-franchises.js'),
  'gen1-pokemon': () => import('./gen1-pokemon.js'),
  'video-games': () => import('./video-games.js'),
  'ocean-animals': () => import('./ocean-animals.js'),
  'foods': () => import('./foods.js'),
  'sports': () => import('./sports.js'),
  'tv-shows': () => import('./tv-shows.js'),
  'destinations': () => import('./destinations.js'),
  'board-games': () => import('./board-games.js'),
  'boy-names': () => import('./boy-names.js')
};

// Returns true if the list ID exists in the registry
export function hasListId(id) {
  return id in listRegistry;
}

// Get the list of all available list IDs
export function getListIds() {
  return Object.keys(listRegistry);
}

// Get a specific list by ID
export async function getListById(id) {
  if (listRegistry[id]) {
    try {
      const module = await listRegistry[id]();
      return module.default;
    } catch (error) {
      console.error(`Error loading list ${id}:`, error);
      return null;
    }
  }
  return null;
}

// Get metadata for all lists without loading items
export async function getAllListsMetadata() {
  const metadata = [];
  
  for (const id of getListIds()) {
    try {
      const list = await getListById(id);
      if (list) {
        metadata.push({
          id: list.id,
          title: list.title,
          description: list.description,
          coverImage: list.coverImage,
          itemCount: list.items.length
        });
      }
    } catch (error) {
      console.error(`Error loading metadata for ${id}:`, error);
    }
  }
  
  return metadata;
}