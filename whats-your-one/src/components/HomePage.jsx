import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>What's Your One?</h1>
        <p className="tagline">Discover your favorites through simple comparisons</p>
      </div>
      
      <div className="home-description">
        <p>
          Welcome to <strong>What's Your One?</strong> — a fun way to discover your true favorites 
          by making simple choices. Instead of ranking everything at once, you'll be shown items in small 
          batches and pick the ones you prefer.
        </p>
        <p>
          Through this process of elimination, we'll help you discover what you truly love most. 
          Your choices are saved as you go, so you can take your time.
        </p>
      </div>
      
      <div className="instructions">
        <h2>How It Works</h2>
        <ol>
          <li>Choose a category that interests you</li>
          <li>You'll be shown items in small groups</li>
          <li>Select the ones you prefer (or press "Pass" if you like them all)</li>
          <li>Continue until you've ranked everything</li>
          <li>Discover your true #1 favorite!</li>
        </ol>
      </div>
      
      <div className="cta-container">
        <Link to="/lists" className="cta-button">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default HomePage;