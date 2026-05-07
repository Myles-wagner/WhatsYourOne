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
  const dateString = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Create a deterministic color based on list ID
  const getListColor = (listId) => {
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
      '#1ABC9C', // Turquoise
    ];
    // Simple hash function to pick a color
    let hash = 0;
    for (let i = 0; i < listId.length; i++) {
      hash = hash * 31 + listId.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };

  // Map list IDs to emojis
  const getListIcon = (listId) => {
    const iconMap = {
      'movies': '🎬',
      'classic-movies': '🎥',
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
      'sports-franchises': '🏆',
    };
    return iconMap[listId] || listId.charAt(0).toUpperCase();
  };

  // Load lists and daily results
  useEffect(() => {
    async function loadData() {
      try {
        const listsData = await getAllListsMetadata();
        setLists(listsData);

        const results = {};
        const names = {};

        // Check the main daily challenge
        const dailyAllResult = getDailyResult('all');
        if (dailyAllResult) {
          results['all'] = dailyAllResult;
          // Look for the item in any list to get its name
          for (const listMeta of listsData) {
            const listId = listMeta.id || listMeta;
            const list = await getListById(listId);
            const resultId = dailyAllResult.id || dailyAllResult;
            const item = list.items.find(
              item => (item.id || item) === resultId || item === dailyAllResult
            );
            if (item) {
              names[resultId] = item.name || item;
              break;
            }
          }
        }

        // Check each list's daily results
        for (const listMeta of listsData) {
          const listId = listMeta.id || listMeta;
          const listResult = getDailyResult(listId);
          if (listResult) {
            results[listId] = listResult;
            const resultId = listResult.id || listResult;
            if (!names[resultId]) {
              const list = await getListById(listId);
              const item = list.items.find(
                item => (item.id || item) === resultId || item === listResult
              );
              if (item) {
                names[resultId] = item.name || item;
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

  // Get the display name of an item using the cached names
  const getItemName = (result) => {
    if (!result) return 'Unknown';
    const resultId = result.id || result;
    return itemNames[resultId] || result.name || 'Unknown';
  };

  if (loading) {
    return <div className="loading">Loading lists...</div>;
  }

  return (
    <div className="lists-container">
      <div className="lists-header">
        <h1>What's Your One?</h1>
        <p>Select a category to start comparing and find your #1!</p>
        {Object.keys(dailyResults).length > 0 && (
          <Link to="/share" className="share-button">
            Share Today's Results
          </Link>
        )}
      </div>

      {/* Today's Daily Challenge Banner */}
      <div className="daily-challenge-container">
        <div className="daily-challenge-card">
          <div className="challenge-header">
            <div className="calendar-date">{dateString}</div>
            <h2>Today's Challenge</h2>
            <p>Random items from all categories. New selection every day!</p>
          </div>
          {dailyResults['all'] ? (
            <div className="completed-challenge">
              <p>Your #1: <strong>{getItemName(dailyResults['all'])}</strong></p>
              <Link to="/compare/all/daily" className="challenge-button secondary">
                Try Again
              </Link>
            </div>
          ) : (
            <Link to="/compare/all/daily" className="challenge-button">
              What's Your One?
            </Link>
          )}
        </div>
      </div>

      {/* Category Grid */}
      <h2 className="category-heading">Categories</h2>
      <div className="lists-grid">
        {lists.map(list => {
          const listId = list.id || list;
          return (
            <div key={listId} className="list-card">
              <div
                className="list-image"
                style={{ backgroundColor: getListColor(listId), backgroundImage: 'none' }}
              >
                <div className="list-icon">{getListIcon(listId)}</div>
              </div>
              <div className="list-info">
                <h3>{list.title}</h3>
                <p>{list.description}</p>
              </div>
              <div className="list-options">
                <Link to={`/compare/${listId}/full`} className="list-option full">
                  Full List ({list.itemCount || '?'})
                </Link>
                <div className="daily-option">
                  <div className="daily-header">
                    <span className="daily-label">Daily 10</span>
                    <span className="daily-date">{dateString}</span>
                  </div>
                  {dailyResults[listId] ? (
                    <div className="completed-daily">
                      <span>Your #1: <strong>{getItemName(dailyResults[listId])}</strong></span>
                      <Link to={`/compare/${listId}/daily`} className="try-again-link">
                        Try Again
                      </Link>
                    </div>
                  ) : (
                    <Link to={`/compare/${listId}/daily`} className="take-challenge-link">
                      What's Your One?
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-link-container">
        <Link to="/admin" className="admin-link">+ Add New Category</Link>
      </div>
    </div>
  );
}

export default ListsPage;
