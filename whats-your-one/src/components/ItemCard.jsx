import React from 'react';
import './ItemCard.css';

function ItemCard({ item, isSelected, onSelect }) {
  return (
    <div 
      className={`item-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(item.id)}
    >
      {item.image ? (
        <img src={item.image} alt={item.name} />
      ) : (
        <span className="item-name">{item.name}</span>
      )}
    </div>
  );
}

export default ItemCard;