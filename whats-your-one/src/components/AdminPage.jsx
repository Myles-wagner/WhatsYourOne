// src/components/AdminPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createNewList, allLists } from '../data/lists';
import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const [newList, setNewList] = useState({
    id: '',
    title: '',
    description: '',
    items: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewList({
      ...newList,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newList.id || !newList.title || !newList.description || !newList.items) {
      setError('Please fill out all fields');
      return;
    }
    
    // Check if ID already exists
    if (allLists.some(list => list.id === newList.id)) {
      setError('A list with this ID already exists');
      return;
    }
    
    // Parse items
    const items = newList.items.split('\n').filter(item => item.trim());
    if (items.length < 2) {
      setError('Please add at least 2 items');
      return;
    }
    
    // Create the new list
    createNewList(newList.id, newList.title, newList.description, items);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('whats-your-one-lists', JSON.stringify(allLists));
    } catch (err) {
      console.error('Failed to save lists to localStorage:', err);
    }
    
    // Navigate to lists page
    navigate('/lists');
  };

  return (
    <div className="admin-container">
      <header>
        <Link to="/lists" className="back-button">← Back to Lists</Link>
        <h1>Add New Category</h1>
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="id">Category ID (no spaces):</label>
          <input 
            type="text" 
            id="id" 
            name="id" 
            value={newList.id} 
            onChange={handleChange}
            placeholder="e.g. ice-cream-flavors"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Category Title:</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={newList.title} 
            onChange={handleChange}
            placeholder="e.g. Ice Cream Flavors"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input 
            type="text" 
            id="description" 
            name="description" 
            value={newList.description} 
            onChange={handleChange}
            placeholder="e.g. Find your favorite ice cream flavor"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="items">Items (one per line):</label>
          <textarea 
            id="items" 
            name="items" 
            value={newList.items} 
            onChange={handleChange}
            rows="10"
            placeholder="Vanilla&#10;Chocolate&#10;Strawberry&#10;Mint Chocolate Chip&#10;..."
          />
        </div>
        
        <button type="submit" className="submit-button">Add Category</button>
      </form>
    </div>
  );
}

export default AdminPage;