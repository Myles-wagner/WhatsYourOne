import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ComparisonView from './ComparisonView';
import ResultsView from './ResultsView';
import { createPicker } from '../utils/picker';
import { getListById } from '../data/lists';
import './ComparePage.css';

function ComparePage() {
  const { listId } = useParams();
  const [picker, setPicker] = useState(null);
  const [list, setList] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedList = getListById(listId);
    
    if (!selectedList) {
      setLoading(false);
      return;
    }
    
    setList(selectedList);
    
    // Initialize picker with the list items
    const newPicker = createPicker(selectedList.items);
    setPicker(newPicker);
    
    // Try to load from localStorage
    try {
      const savedState = localStorage.getItem(`whats-your-one-${listId}`);
      if (savedState) {
        console.log('Found saved state for', listId);
      }
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
    
    setLoading(false);
  }, [listId]);

  // Update the picker and trigger a re-render
  const updatePicker = () => {
    setForceUpdate(prev => prev + 1);
    
    try {
      // Save to localStorage (simplified for now)
      localStorage.setItem(`whats-your-one-${listId}`, JSON.stringify({ lastUpdated: new Date() }));
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!list) {
    return (
      <div className="error-container">
        <h2>List Not Found</h2>
        <p>Sorry, the list you're looking for doesn't exist.</p>
        <Link to="/lists" className="button">Go Back to Lists</Link>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <header className="compare-header">
        <Link to="/lists" className="back-button">← Back to Lists</Link>
        <div className="title-container">
          <h1>{list.title}</h1>
          <p>{list.description}</p>
        </div>
      </header>
      
      <main className="compare-content">
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
            <button 
              onClick={() => {
                const newPicker = createPicker(list.items);
                setPicker(newPicker);
              }}
              className="restart-button"
            >
              Start Over
            </button>
          </div>
        )}
        
        <ResultsView favorites={picker.favorites} />
      </main>
    </div>
  );
}

export default ComparePage;