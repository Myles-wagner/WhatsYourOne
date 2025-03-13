import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ListsPage from './components/ListsPage';
import ComparePage from './components/ComparePage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lists" element={<ListsPage />} />
        <Route path="/compare/:listId" element={<ComparePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);