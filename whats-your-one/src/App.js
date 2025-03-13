import React, { useState, useEffect } from 'react';
import ComparisonView from './components/ComparisonView';
import ResultsView from './components/ResultsView';
import { createPicker } from './utils/picker';
import './App.css';

// Sample data for testing
const sampleItems = [
  { id: 'movie1', name: 'The Shawshank Redemption', image: 'https://via.placeholder.com/150?text=Shawshank' },
  { id: 'movie2', name: 'The Godfather', image: 'https://via.placeholder.com/150?text=Godfather' },
  { id: 'movie3', name: 'The Dark Knight', image: 'https://via.placeholder.com/150?text=DarkKnight' },
  { id: 'movie4', name: 'Pulp Fiction', image: 'https://via.placeholder.com/150?text=PulpFiction' },
  { id: 'movie5', name: 'Fight Club', image: 'https://via.placeholder.com/150?text=FightClub' },
  { id: 'movie6', name: 'Inception', image: 'https://via.placeholder.com/150?text=Inception' },
  { id: 'movie7', name: 'The Matrix', image: 'https://via.placeholder.com/150?text=Matrix' },
  { id: 'movie8', name: 'Goodfellas', image: 'https://via.placeholder.com/150?text=Goodfellas' },
];

function App() {
  const [picker, setPicker] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Initialize picker with sample items
    const newPicker = createPicker(sampleItems);
    setPicker(newPicker);

    // Try to load from localStorage
    try {
      const savedState = localStorage.getItem('whats-your-one');
      if (savedState) {
        console.log('Found saved state, could restore here');
        // For a full implementation, restore state here
      }
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  }, []);

  // Update the picker and trigger a re-render
  const updatePicker = () => {
    setForceUpdate(prev => prev + 1);
    
    try {
      // Save to localStorage (simplified for now)
      localStorage.setItem('whats-your-one', JSON.stringify({ lastUpdated: new Date() }));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  };

  const handlePick = (selectedIds) => {
    if (!picker || !selectedIds || selectedIds.length === 0) return;
    
    picker.pick(selectedIds);
    updatePicker();
  };

  const handlePass = () => {
    if (!picker) return;
    
    picker.pass();
    updatePicker();
  };

  const handleUndo = () => {
    if (!picker) return;
    
    if (picker.undo()) {
      updatePicker();
    }
  };

  const handleRedo = () => {
    if (!picker) return;
    
    if (picker.redo()) {
      updatePicker();
    }
  };

  if (!picker) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>What's Your One?</h1>
        <p>Select your favorites by comparing items</p>
      </header>
      
      <main>
        <div className="app-content">
          {picker.evaluating.length > 0 ? (
            <ComparisonView 
              items={picker.evaluating} 
              onPick={handlePick}
              onPass={handlePass}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
          ) : (
            <div className="completed-message">
              <h2>All Done!</h2>
              <p>You've completed all the comparisons.</p>
            </div>
          )}
          
          <ResultsView favorites={picker.favorites} />
        </div>
      </main>
    </div>
  );
}

export default App;