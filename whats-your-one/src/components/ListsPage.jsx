// src/components/ListsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllListsMetadata, getDailyResult, getListById } from '../data/lists';
import './ListsPage.css';

function ListsPage() {
  const [lists, setLists] = useState([]);
  const [dailyResults, setDailyResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [itemNames, setItemNames] = useState({});
  
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

// Inside your ListsPage component, add these functions
const getListColor = (listId) => {
  // Create a deterministic color based on list ID
  const colors = [
    '#4285F4', // Blue
    '#EA4335', // Red
    '#34A853', // Green
    '#FBBC05', // Yellow
    '#8F44AD', // Purple
    '#16A085', // Teal
    '#E67E22', // Orange
    '#2C3E50', // Navy
    '#27AE60', // Emerald
    '#E74C3C', // Red Orange
    '#9B59B6', // Amethyst
    '#1ABC9C'  // Turquoise
  ];
  
  // Simple hash function to pick a color
  let hash = 0;
  for (let i = 0; i < listId.length; i++) {
    hash = ((hash << 5) - hash) + listId.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Make sure it's positive and select a color
  hash = Math.abs(hash);
  return colors[hash % colors.length];
};

const getListIcon = (listId) => {
  // Map list IDs to emojis or first letters (emojis look great as category icons)
  const iconMap = {
    'movies': '🎬',
    'songs-2000s': '🎵',
    'gen1-pokemon': '🎮',
    'video-games': '🕹️',
    'ocean-animals': '🐙',
    'foods': '🍔',
    'sports': '⚽',
    'tv-shows': '📺',
    'destinations': '🏝️',
    'board-games': '🎲',
    'boy-names': '👶',
    'sports-franchises': '🏆'
  };
  
  // Return the icon if it exists, otherwise the first letter
  return iconMap[listId] || listId.charAt(0).toUpperCase();
};

  // Load lists and daily results
  useEffect(() => {
    async function loadData() {
      try {
        // Load all list metadata
        const listsData = await getAllListsMetadata();
        setLists(listsData);
        
        // Check daily results
        const results = {};
        const names = {};
        
        // Check the main daily challenge
        const dailyAllResult = getDailyResult('all');
        if (dailyAllResult) {
          results['all'] = dailyAllResult;
          
          // Look for the item in any list to get its name
          for (const listMeta of listsData) {
            const list = await getListById(listMeta.id);
            const item = list.items.find(item => item.id === dailyAllResult);
            if (item) {
              names[dailyAllResult] = item.name;
              break;
            }
          }
        }
        
        // Check each list's daily results
        for (const listMeta of listsData) {
          const listResult = getDailyResult(listMeta.id);
          if (listResult) {
            results[listMeta.id] = listResult;
            
            // Get the name of the selected item
            if (!names[listResult]) {
              const list = await getListById(listMeta.id);
              const item = list.items.find(item => item.id === listResult);
              if (item) {
                names[listResult] = item.name;
              }
            }
          }
        }
        
        setDailyResults(results);
        setItemNames(names);
        setLoading(false);
      } catch (error) {
        console.error('Error loading lists:', error);
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Get the name of an item using the cached names
  const getItemNameById = (listId, itemId) => {
    return itemNames[itemId] || 'Unknown';
  };

  if (loading) {
    return <div className="loading">Loading lists...</div>;
  }

  return (
    <div className="lists-container">
      <div className="lists-header">
        <h1>What's Your One?</h1>
        <p>Select a category to start comparing and find your favorite!</p>
        
        {Object.keys(dailyResults).length > 0 && (
          <Link to="/share" className="share-button">
            Share Today's Results
          </Link>
        )}
      </div>
      
      <div className="daily-challenge-container">
        <div className="daily-challenge-card">
          <div className="challenge-header">
            <div className="calendar-date">{dateString}</div>
            <h2>Today's Challenge</h2>
          </div>
          <p>Random items from all categories. New selection every day!</p>
          
          {dailyResults['all'] ? (
            <div className="completed-challenge">
              <p>Your choice: <strong>{getItemNameById('all', dailyResults['all'])}</strong></p>
              <Link to="/compare/all/daily" className="challenge-button secondary">
                Try Again
              </Link>
            </div>
          ) : (
            <Link to="/compare/all/daily" className="challenge-button">
              Take the Challenge
            </Link>
          )}
        </div>
      </div>
      
      <h2 className="category-heading">Categories</h2>
      
      <div className="lists-grid">
        {lists.map(list => (
          <div key={list.id} className="list-card">
<div className="list-image" style={{ 
  backgroundColor: getListColor(list.id),
  backgroundImage: 'none'
}}>
  <div className="list-icon">{getListIcon(list.id)}</div>
</div>
            <h2>{list.title}</h2>
            <p>{list.description}</p>
            <div className="list-options">
              <Link to={`/compare/${list.id}/full`} className="list-option full">
                Full List ({list.itemCount || '?'})
              </Link>
              <div className="daily-option">
                <div className="daily-header">
                  <span className="daily-label">Daily 10</span>
                  <span className="daily-date">{dateString}</span>
                </div>
                
                {dailyResults[list.id] ? (
                  <div className="completed-daily">
                    <p>Your choice: <strong>{getItemNameById(list.id, dailyResults[list.id])}</strong></p>
                    <Link to={`/compare/${list.id}/daily`} className="try-again-link">
                      Try Again
                    </Link>
                  </div>
                ) : (
                  <Link to={`/compare/${list.id}/daily`} className="take-challenge-link">
                    Take Challenge
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="admin-link-container">
        <Link to="/admin" className="admin-link">+ Add New Category</Link>
      </div>
    </div>
  );
}

export default ListsPage;