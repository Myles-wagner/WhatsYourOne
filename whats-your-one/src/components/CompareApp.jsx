// src/components/CompareApp.jsx - replace or update the existing file
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getListById, 
  getDailyItems, 
  saveDailyResult,
  getDailyResult 
} from '../data/lists';
import './CompareApp.css';

function CompareApp() {
  const { listId, mode = 'full' } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemsToCompare, setItemsToCompare] = useState([]);
  const [survivors, setSurvivors] = useState([]);
  const [eliminated, setEliminated] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [itemsPool, setItemsPool] = useState([]);
  const [isDaily, setIsDaily] = useState(false);
  
  // Date for daily challenges
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // Check if this is a daily challenge
  useEffect(() => {
    setIsDaily(mode === 'daily');
    
    // For daily mode, check if already completed
    if (mode === 'daily') {
      const result = getDailyResult(listId);
      if (result) {
        // Already completed today - could add logic to confirm restart
        console.log('Already completed daily challenge for', listId);
      }
    }
  }, [mode, listId]);

  // Initialize items based on list and mode
  useEffect(() => {
    let items = [];
    
    if (listId === 'all' && mode === 'daily') {
      // Daily challenge with items from all lists
      items = getDailyItems();
      setTitle(`Daily Challenge - ${dateString}`);
      setDescription('Random items from all categories.');
    } 
    else if (mode === 'daily') {
      // Daily challenge for specific list
      const list = getListById(listId);
      if (!list) {
        setLoading(false);
        return;
      }
      
      items = getDailyItems(listId);
      setTitle(`${list.title} - Daily Challenge`);
      setDescription(`Daily selection of items from ${list.title}.`);
    } 
    else {
      // Regular full list
      const list = getListById(listId);
      if (!list) {
        setLoading(false);
        return;
      }
      
      items = [...list.items];
      setTitle(list.title);
      setDescription(list.description);
    }
    
    setItemsPool(items);
    initializeComparison(items);
  }, [listId, mode]);

  // Initialize the comparison
  const initializeComparison = (items) => {
    // Shuffle all items (for regular mode - daily is already shuffled)
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
      const newFavorites = [...favorites, survivorPool[0]];
      setFavorites(newFavorites);
      
      // If this is a daily challenge, save the result
      if (isDaily && newFavorites.length === 1) {
        saveDailyResult(listId, currentDate, newFavorites[0].id);
      }
      
      // If we've processed all items, we're done
      if (eliminatedPool.length + newFavorites.length >= itemsPool.length) {
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
    const remainingItems = itemsPool.filter(
      item => !currentFavorites.some(fav => fav.id === item.id)
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
    setRound(round + 1);
  };

  // Toggle item selection
  const toggleSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Return to lists page
  const handleBackToLists = () => {
    navigate('/lists');
  };

  // Restart the comparison
  const handleRestart = () => {
    initializeComparison(itemsPool);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="compare-container">
      <header className="compare-header">
        <button onClick={handleBackToLists} className="back-button">← Back to Lists</button>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
          {isDaily && <div className="daily-badge">{dateString}</div>}
        </div>
      </header>

      <div className="compare-content">
        <div className="compare-main">
          {!isCompleted && itemsToCompare.length > 0 ? (
            <>
              <h2>What's Your One?</h2>
              <div className="items-grid">
                {itemsToCompare.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index === 1 && <div className="or-divider">OR</div>}
                    <div 
                      className={`item-card ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelection(item.id)}
                    >
                      <div className="item-name">{item.name}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="action-buttons">
                <button 
                  className="pick-button"
                  onClick={handlePick}
                  disabled={selectedItems.length === 0}
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
              <div className="progress-indicator">
                Round {round} • {itemsPool.length - (eliminated.length + favorites.length)} items remaining
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
              <button 
                className="lists-button"
                onClick={handleBackToLists}
              >
                Back to Lists
              </button>
            </div>
          )}
        </div>

        <div className="favorites-container">
          <h2>Your Favorites</h2>
          {favorites.length > 0 ? (
            <ol className="favorites-list">
              {favorites.map((item, index) => (
                <li key={item.id} className="favorite-item">
                  <div className="rank">{index + 1}</div>
                  <div className="favorite-card">
                    <div className="item-name">{item.name}</div>
                    {item.originList && (
                      <div className="item-origin">from {item.originList}</div>
                    )}
                  </div>
                </li>
              ))}
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