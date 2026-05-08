import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>What's Your One?</h1>
        <p className="tagline">Pick your #1. See if the world agrees.</p>
      </div>
      <div className="home-description">
        <p>
          Head-to-head matchups. Pick your favorites. Find your #1 — then see how you stack up against everyone else.
        </p>
      </div>
      <div className="cta-container">
        <Link to="/lists" className="cta-button">Get Started</Link>
      </div>
    </div>
  );
}

export default HomePage;
