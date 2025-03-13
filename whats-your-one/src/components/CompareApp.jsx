// src/components/CompareApp.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListById } from '../data/lists';
import './CompareApp.css';

function CompareApp() {
  const { listId } = useParams();
  const [currentList, setCurrentList] = useState(null);
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);

  // Initial setup
  useEffect(() => {
    console.log('Loading list with ID:', listId);
    const list = getListById(listId);
    
    if (!list) {
      console.error('List not found:', listId);
      setLoading(false);
      return;
    }
    
    setCurrentList(list);
    
    // Shuffle and set initial batch
    const shuffled = [...list.items].sort(() => 0.5 - Math.random());
    setCurrentItems(shuffled.slice(0, 2)); // Start with 2 items
    
    setLoading(false);
  }, [listId]);

  // Handle user selection
  const handlePick = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item!");
      return;
    }
    
    // Move to next step
    processSelection();
  };

  // Handle passing on all items
  const handlePass = () => {
    // Select all items
    setSelectedItems(currentItems.map(item => item.id));
    processSelection();
  };

  // Process the current selection
  const processSelection = () => {
    const list = getListById(listId);
    if (!list) return;
    
    // Get remaining items (not yet processed)
    const remainingItems = list.items.filter(
      item => !favorites.includes(item.id) && 
             !currentItems.find(current => current.id === item.id)
    );
    
    // Get selected items as full objects
    const selected = currentItems.filter(
      item => selectedItems.includes(item.id)
    );
    
    if (remainingItems.length === 0) {
      // No more items to compare, add current selections to favorites
      setFavorites([...favorites, ...selected.map(item => item.id)]);
      setCurrentItems([]);
    } else {
      // Continue with next batch
      const shuffled = [...remainingItems].sort(() => 0.5 - Math.random());
      const nextBatch = shuffled.slice(0, 2); // Always show 2 items for simplicity
      
      // Add current selections to favorites
      setFavorites([...favorites, ...selected.map(item => item.id)]);
      setCurrentItems(nextBatch);
      setRound(round + 1);
    }
    
    // Clear selections for next round
    setSelectedItems([]);
  };

  // Toggle item selection
  const toggleSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Restart the comparison
  const handleRestart = () => {
    const list = getListById(listId);
    if (!list) return;
    
    const shuffled = [...list.items].sort(() => 0.5 - Math.random());
    setCurrentItems(shuffled.slice(0, 2));
    setSelectedItems([]);
    setFavorites([]);
    setRound(1);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!currentList) {
    return (
      <div className="error-container">
        <h2>List Not Found</h2>
        <p>Sorry, we couldn't find the list you're looking for.</p>
        <Link to="/lists" className="button">Back to Lists</Link>
      </div>
    );
  }

  return (
    <div className="compare-container">
      <header className="compare-header">
        <Link to="/lists" className="back-button">← Back to Lists</Link>
        <div>
          <h1>{currentList.title}</h1>
          <p>{currentList.description}</p>
        </div>
      </header>

      <div className="compare-content">
        <div className="compare-main">
          {currentItems.length > 0 ? (
            <>
              <h2>Round {round}: Choose your favorite(s)</h2>
              <div className="items-grid">
                {currentItems.map(item => (
                  <div 
                    key={item.id}
                    className={`item-card ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="item-placeholder">{item.name.charAt(0)}</div>
                    )}
                    <div className="item-name">{item.name}</div>
                  </div>
                ))}
              </div>
              <div className="action-buttons">
                <button 
                  className="pick-button"
                  onClick={handlePick}
                >
                  Pick Selected
                </button>
                <button 
                  className="pass-button"
                  onClick={handlePass}
                >
                  Keep All
                </button>
              </div>
            </>
          ) : (
            <div className="completed-message">
              <h2>All Done!</h2>
              <p>You've completed all the comparisons.</p>
              <button 
                className="restart-button"
                onClick={handleRestart}
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        <div className="favorites-container">
          <h2>Your Favorites</h2>
          {favorites.length > 0 ? (
            <ol className="favorites-list">
              {favorites.map((itemId, index) => {
                const item = currentList.items.find(i => i.id === itemId);
                if (!item) return null;
                
                return (
                  <li key={item.id} className="favorite-item">
                    <div className="rank">{index + 1}</div>
                    <div className="favorite-card">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="item-placeholder">{item.name.charAt(0)}</div>
                      )}
                      <div className="item-name">{item.name}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="no-favorites">Start comparing to find your favorites!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompareApp;