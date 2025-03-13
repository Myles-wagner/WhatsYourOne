import React from 'react';
import ItemCard from './ItemCard';
import './ResultsView.css';

function ResultsView({ favorites }) {
  return (
    <div className="results-container">
      <h2>Your Favorites</h2>
      {favorites.length > 0 ? (
        <ol className="favorites-list">
          {favorites.map((item, index) => (
            <li key={item.id} className="favorite-item">
              <span className="rank">{index + 1}</span>
              <ItemCard item={item} />
            </li>
          ))}
        </ol>
      ) : (
        <p className="no-favorites">Start comparing items to find your favorites!</p>
      )}
    </div>
  );
}

export default ResultsView;