// src/components/ListsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { allLists, getDailyResult } from '../data/lists';
import './ListsPage.css';

function ListsPage() {
  const [dailyResults, setDailyResults] = useState({});
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  // Load any saved daily results
  useEffect(() => {
    const results = {};
    // Check the main daily challenge
    const dailyAllResult = getDailyResult('all');
    if (dailyAllResult) {
      results['all'] = dailyAllResult;
    }
    
    // Check each list
    allLists.forEach(list => {
      const listResult = getDailyResult(list.id);
      if (listResult) {
        results[list.id] = listResult;
      }
    });
    
    setDailyResults(results);
  }, []);

  // Find item name from ID
  const getItemNameById = (listId, itemId) => {
    if (listId === 'all') {
      // Check all lists
      for (const list of allLists) {
        const item = list.items.find(item => item.id === itemId);
        if (item) return item.name;
      }
    } else {
      // Check specific list
      const list = allLists.find(list => list.id === listId);
      if (list) {
        const item = list.items.find(item => item.id === itemId);
        if (item) return item.name;
      }
    }
    return 'Unknown';
  };

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
        {allLists.map(list => (
          <div key={list.id} className="list-card">
            <div className="list-image">
              {list.coverImage ? (
                <img src={list.coverImage} alt={list.title} />
              ) : (
                <div className="list-placeholder">{list.title.charAt(0)}</div>
              )}
            </div>
            <h2>{list.title}</h2>
            <p>{list.description}</p>
            <div className="list-options">
              <Link to={`/compare/${list.id}/full`} className="list-option full">
                Full List ({list.items.length})
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