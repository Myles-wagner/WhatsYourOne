// src/components/CompareApp.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListById } from '../data/lists';
import './CompareApp.css';

function CompareApp() {
  const { listId } = useParams();
  const [currentList, setCurrentList] = useState(null);
  const [itemsToCompare, setItemsToCompare] = useState([]);
  const [survivors, setSurvivors] = useState([]);
  const [eliminated, setEliminated] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

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
    initializeComparison(list.items);
  }, [listId]);

  // Initialize the comparison with shuffled items
  const initializeComparison = (items) => {
    // Shuffle all items
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    
    // Get first batch (2 items)
    const firstBatch = shuffled.slice(0, 2);
    const remaining = shuffled.slice(2);
    
    setItemsToCompare(firstBatch);
    setSurvivors(remaining);
    setEliminated([]);
    setSelectedItems([]);
    setFavorites([]);
    setRound(1);
    setIsCompleted(false);
    setLoading(false);
  };

  // Handle user selection
  const handlePick = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item!");
      return;
    }
    
    // Get the selected items
    const selected = itemsToCompare.filter(item => selectedItems.includes(item.id));
    
    // Get the non-selected items
    const nonSelected = itemsToCompare.filter(item => !selectedItems.includes(item.id));
    
    // Add non-selected items to eliminated, with reference to what eliminated them
    const newEliminated = [
      ...eliminated,
      ...nonSelected.map(item => ({
        ...item,
        eliminatedBy: selected.map(s => s.id)
      }))
    ];
    
    // Add selected items to a temporary survivor pool
    const newSurvivors = [...survivors, ...selected];
    
    processNextBatch(newSurvivors, newEliminated);
  };

  // Handle passing on all items
  const handlePass = () => {
    // All current items survive
    const newSurvivors = [...survivors, ...itemsToCompare];
    processNextBatch(newSurvivors, eliminated);
  };

  // Process the next batch of items
  const processNextBatch = (survivorPool, eliminatedPool) => {
    setEliminated(eliminatedPool);
    
    // If there are at least 2 items left to compare
    if (survivorPool.length >= 2) {
      // Get the next 2 items
      const nextBatch = survivorPool.slice(0, 2);
      const remaining = survivorPool.slice(2);
      
      setItemsToCompare(nextBatch);
      setSurvivors(remaining);
      setSelectedItems([]);
      setRound(round + 1);
    }
    // If only 1 item remains in this round
    else if (survivorPool.length === 1) {
      // Add the last item to favorites
      const newFavorites = [...favorites, survivorPool[0].id];
      setFavorites(newFavorites);
      
      // If we've processed all items, we're done
      if (eliminatedPool.length + newFavorites.length >= currentList.items.length) {
        setIsCompleted(true);
        setItemsToCompare([]);
      } 
      // Otherwise, start a new round with remaining items
      else {
        startNewRound(newFavorites, eliminatedPool);
      }
    }
    // If no items remain (should never happen, but just in case)
    else {
      setIsCompleted(true);
      setItemsToCompare([]);
    }
  };

  // Start a new round with remaining items
  const startNewRound = (currentFavorites, eliminatedItems) => {
    // Get all items that haven't been favorited yet
    const remainingItems = currentList.items.filter(
      item => !currentFavorites.includes(item.id)
    );
    
    // Shuffle remaining items
    const shuffled = [...remainingItems].sort(() => 0.5 - Math.random());
    
    // Set up the next batch
    const nextBatch = shuffled.slice(0, 2);
    const nextRemaining = shuffled.slice(2);
    
    setItemsToCompare(nextBatch);
    setSurvivors(nextRemaining);
    setFavorites(currentFavorites);
    setEliminated(eliminatedItems);
    setSelectedItems([]);
    setRound(1);
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
    if (currentList) {
      initializeComparison(currentList.items);
    }
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
          {!isCompleted && itemsToCompare.length > 0 ? (
            <>
              <h2>Round {round}: Choose your favorite(s)</h2>
              <div className="items-grid">
                {itemsToCompare.map(item => (
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