import React from 'react';
import { Link } from 'react-router-dom';
import './ListsPage.css';

// Import the lists data
import { allLists } from '../data/lists';

function ListsPage() {
  return (
    <div className="lists-container">
      <h1>Choose a List</h1>
      <p>Select a category to start comparing and find your favorite!</p>
      
      <div className="lists-grid">
        {allLists.map(list => (
          <Link 
            to={`/compare/${list.id}`} 
            className="list-card" 
            key={list.id}
          >
            <div className="list-image">
              {list.coverImage ? (
                <img src={list.coverImage} alt={list.title} />
              ) : (
                <div className="list-placeholder">{list.title.charAt(0)}</div>
              )}
            </div>
            <h2>{list.title}</h2>
            <p>{list.description}</p>
            <span className="item-count">{list.items.length} items</span>
          </Link>
        ))}
      </div>
	<div className="admin-link-container">
  <Link to="/admin" className="admin-link">+ Add New Category</Link>
</div>
    </div>
  );
}

export default ListsPage;