// src/components/SharePage.jsx - create this new file
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDailyResults } from '../data/lists';
import './SharePage.css';

function SharePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const shareCardRef = useRef(null);
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  useEffect(() => {
    const dailyResults = getAllDailyResults();
    setResults(dailyResults);
    setLoading(false);
  }, []);

  const handleDownloadImage = () => {
    alert("In a real implementation, this would save the card as an image.");
    // In a real implementation, you would:
    // 1. Use html2canvas or a similar library to capture the shareCardRef as an image
    // 2. Convert it to a blob and download it or allow sharing to social media
  };

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
    navigator.clipboard.writeText(url)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert("Failed to copy link");
      });
  };

  if (loading) {
    return <div className="loading">Loading your results...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="share-container empty">
        <h2>No Results Yet</h2>
        <p>Complete some daily challenges to see your results here!</p>
        <Link to="/lists" className="back-button">Back to Lists</Link>
      </div>
    );
  }

  return (
    <div className="share-container">
      <header className="share-header">
        <Link to="/lists" className="back-button">← Back to Lists</Link>
        <h1>Your Daily Favorites</h1>
        <p>{dateString}</p>
      </header>

      <div className="share-actions">
        <button className="download-button" onClick={handleDownloadImage}>
          Download Image
        </button>
        <button className="copy-button" onClick={handleCopyLink}>
          Copy Link
        </button>
      </div>

      <div className="share-card" ref={shareCardRef}>
        <div className="share-card-header">
          <h2>What's Your One?</h2>
          <div className="share-date">{dateString}</div>
        </div>

        <div className="share-results">
          {results.map((result, index) => (
            <div key={index} className="share-result-item">
              <div className="result-category">{result.listTitle}</div>
              <div className="result-choice">{result.item.name}</div>
            </div>
          ))}
        </div>

        <div className="share-footer">
          <p>Play at: whatsyourone.app</p>
        </div>
      </div>
    </div>
  );
}

export default SharePage;