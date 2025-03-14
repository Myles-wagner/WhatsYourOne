// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createNewList, getAllListsMetadata } from '../data/lists';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingLists, setExistingLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load existing list IDs to check for duplicates
  useEffect(() => {
    async function loadLists() {
      try {
        const lists = await getAllListsMetadata();
        setExistingLists(lists);
        setLoading(false);
      } catch (error) {
        console.error('Error loading lists:', error);
        setError('Failed to load existing lists. Some validations may not work.');
        setLoading(false);
      }
    }
    
    loadLists();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewList({
      ...newList,
      [name]: value
    });
    
    // Clear error when user starts typing again
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Basic validation
    if (!newList.id || !newList.title || !newList.description || !newList.items) {
      setError('Please fill out all fields');
      setIsSubmitting(false);
      return;
    }
    
    // Validate ID format (no spaces, only alphanumeric and hyphens)
    if (!/^[a-z0-9-]+$/.test(newList.id)) {
      setError('Category ID must contain only lowercase letters, numbers, and hyphens');
      setIsSubmitting(false);
      return;
    }
    
    // Parse items
    const items = newList.items.split('\n').filter(item => item.trim());
    if (items.length < 2) {
      setError('Please add at least 2 items');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Check if ID already exists
      if (existingLists.some(list => list.id === newList.id)) {
        setError('A list with this ID already exists');
        setIsSubmitting(false);
        return;
      }
      
      // Create the new list
      await createNewList(newList.id, newList.title, newList.description, items);
      
      // Navigate to lists page after successful creation
      navigate('/lists');
    } catch (error) {
      setError(`Error creating list: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Category...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
}

export default AdminPage;