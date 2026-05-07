// src/components/CompareApp.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListById, getDailyItems, saveDailyResult, getDailyResult } from '../data/lists';
import './CompareApp.css';

// Fisher-Yates shuffle — unbiased, O(n). Replaces the old sort(() => 0.5 - Math.random())
// which statistically favors items near the start of the array.
function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function CompareApp() {
  const { listId, mode = 'full' } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemsToCompare, setItemsToCompare] = useState([]);
  const [survivors, setSurvivors] = useState([]);
  const [eliminated, setEliminated] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [round, setRound] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [itemsPool, setItemsPool] = useState([]);
  const [isDaily, setIsDaily] = useState(false);
  const [listTitle, setListTitle] = useState('');

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    setIsDaily(mode === 'daily');
    if (mode === 'daily') {
      const result = getDailyResult(listId);
      if (result) {
        console.log('Already completed daily challenge for', listId);
      }
    }
  }, [mode, listId]);

  useEffect(() => {
    async function loadItems() {
      try {
        let items;
        if (listId === 'all' && mode === 'daily') {
          items = await getDailyItems();
          setTitle(`Daily Challenge — ${dateString}`);
          setDescription('Random items from all categories.');
          setListTitle('Daily Challenge');
        } else if (mode === 'daily') {
          const list = await getListById(listId);
          if (!list) {
            setError('List not found');
            setLoading(false);
            return;
          }
          items = await getDailyItems(listId);
          items = items.map(item => ({ ...item, originList: list.title }));
          setTitle(`${list.title} — Daily Challenge`);
          setDescription(`Daily selection of 10 items from ${list.title}.`);
          setListTitle(list.title);
        } else {
          const list = await getListById(listId);
          if (!list) {
            setError('List not found');
            setLoading(false);
            return;
          }
          // Add originList to every item so the category label always shows on comparison cards
          items = list.items.map(item => ({ ...item, originList: list.title }));
          setTitle(list.title);
          setDescription(list.description);
          setListTitle(list.title);
        }
        setItemsPool(items);
        initializeComparison(items);
      } catch (err) {
        console.error('Error loading items:', err);
        setError('Failed to load items. Please try again.');
        setLoading(false);
      }
    }
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId, mode, dateString]);

  const initializeComparison = (items) => {
    const shuffled = fisherYatesShuffle(items);
    const firstBatch = shuffled.slice(0, 2);
    const remaining = shuffled.slice(2);
    setItemsToCompare(firstBatch);
    setSurvivors(remaining);
    setEliminated([]);
    setSelectedItems([]);
    setRankings([]);
    setRound(1);
    setIsCompleted(false);
    setLoading(false);
  };

  const handlePick = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item!');
      return;
    }
    const selected = itemsToCompare.filter(item => selectedItems.includes(item));
    const nonSelected = itemsToCompare.filter(item => !selectedItems.includes(item));

    const newEliminated = [
      ...eliminated,
      ...nonSelected.map(item => ({
        ...item,
        eliminatedBy: selected.map(s => s.name),
      })),
    ];
    const newSurvivors = [...survivors, ...selected];
    processNextBatch(newSurvivors, newEliminated);
  };

  const handlePass = () => {
    const newSurvivors = [...survivors, ...itemsToCompare];
    processNextBatch(newSurvivors, eliminated);
  };

  const processNextBatch = (survivorPool, eliminatedPool) => {
    setEliminated(eliminatedPool);

    if (survivorPool.length >= 2) {
      const nextBatch = survivorPool.slice(0, 2);
      const remaining = survivorPool.slice(2);
      setItemsToCompare(nextBatch);
      setSurvivors(remaining);
      setSelectedItems([]);
      setRound(r => r + 1);
    } else if (survivorPool.length === 1) {
      const newRankings = [...rankings, survivorPool[0]];
      setRankings(newRankings);

      if (isDaily && newRankings.length === 1) {
        saveDailyResult(listId, currentDate, newRankings[0].id);
      }

      if (eliminatedPool.length + newRankings.length === itemsPool.length) {
        setIsCompleted(true);
        setItemsToCompare([]);
      } else {
        startNewRound(newRankings, eliminatedPool);
      }
    } else {
      setIsCompleted(true);
      setItemsToCompare([]);
    }
  };

  const startNewRound = (currentRankings, eliminatedItems) => {
    const remainingItems = itemsPool.filter(
      item => !currentRankings.some(ranked => ranked === item)
    );
    const shuffled = fisherYatesShuffle(remainingItems);
    const nextBatch = shuffled.slice(0, 2);
    const nextRemaining = shuffled.slice(2);

    setItemsToCompare(nextBatch);
    setSurvivors(nextRemaining);
    setRankings(currentRankings);
    setEliminated(eliminatedItems);
    setSelectedItems([]);
    setRound(r => r + 1);
  };

  const toggleSelection = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(s => s !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleBackToLists = () => navigate('/lists');
  const handleRestart = () => initializeComparison(itemsPool);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={handleBackToLists} className="back-button">
          Back to Lists
        </button>
      </div>
    );
  }

  const itemsRemaining = itemsPool.length - eliminated.length - rankings.length;

  return (
    <div className="compare-container">
      <header className="compare-header">
        <button onClick={handleBackToLists} className="back-button">
          ← Back to Lists
        </button>
        <div className="header-info">
          <h2>{title}</h2>
          <p>{description}</p>
          {isDaily && <div className="daily-badge">{dateString}</div>}
        </div>
      </header>

      <div className="compare-content">
        {/* ── Left: comparison area ── */}
        <div className="compare-main">
          {!isCompleted && itemsToCompare.length > 0 ? (
            <>
              <h3 className="compare-prompt">What's Your One?</h3>

              <div className="items-grid">
                {itemsToCompare.map((item, index) => (
                  <React.Fragment key={item.id || item.name || index}>
                    {index > 0 && (
                      <div className="or-divider">
                        <div>OR</div>
                      </div>
                    )}
                    <div
                      className={`item-card ${selectedItems.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleSelection(item)}
                    >
                      <div className="item-name">{item.name}</div>
                      <div className="item-category">
                        {item.originList || listTitle}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="action-buttons">
                <button
                  className="pick-button"
                  onClick={handlePick}
                  disabled={selectedItems.length === 0}
                >
                  Pick Selected
                </button>
                <button className="pass-button" onClick={handlePass}>
                  Keep All
                </button>
              </div>

              <div className="progress-indicator">
                Round {round} &bull; {itemsRemaining} item{itemsRemaining !== 1 ? 's' : ''} remaining
              </div>
            </>
          ) : (
            /* ── Completion / Results reveal ── */
            <div className="completed-message">
              <div className="winner-reveal">
                <div className="winner-label">🎉 Your #1 is...</div>
                {rankings.length > 0 && (
                  <div className="winner-card">
                    <div className="winner-name">{rankings[0].name}</div>
                    {rankings[0].originList && (
                      <div className="winner-category">
                        from {rankings[0].originList}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {rankings.length > 1 && (
                <p className="full-ranking-hint">
                  See your full ranking in the panel →
                </p>
              )}

              <div className="completion-actions">
                <button className="restart-button" onClick={handleRestart}>
                  Start Over
                </button>
                <button className="lists-button" onClick={handleBackToLists}>
                  Back to Lists
                </button>
              </div>

              {/* ── Community Stats — Coming Soon ── */}
              <div className="community-stats-section">
                <div className="community-stats-header">
                  <h3>Community Stats</h3>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
                <p className="community-stats-desc">
                  See how your #1 compares to what thousands of others picked for this category.
                </p>
                <div className="community-preview" aria-hidden="true">
                  {[62, 21, 11, 6].map((pct, i) => (
                    <div key={i} className="community-bar-row">
                      <div className="community-bar-label" />
                      <div className="community-bar-track">
                        <div className="community-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="community-bar-pct" />
                    </div>
                  ))}
                  <div className="community-lock-overlay">
                    <span className="community-lock-icon">🔒</span>
                  </div>
                </div>
                <p className="community-stats-cta">
                  Community leaderboards are coming — stay tuned!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: live rankings sidebar ── */}
        <div className="rankings-container">
          <h3>Your Rankings</h3>
          {rankings.length > 0 ? (
            <div className="rankings-list">
              {rankings.map((item, index) => (
                <div key={item.id || item.name || index} className="ranking-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="ranking-card">
                    <div className="item-name">{item.name}</div>
                    {item.originList && (
                      <div className="item-origin">{item.originList}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-rankings">Start comparing to find your #1!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompareApp;
