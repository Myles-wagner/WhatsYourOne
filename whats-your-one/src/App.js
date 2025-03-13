// src/App.js - update to add the share route
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ListsPage from './components/ListsPage';
import CompareApp from './components/CompareApp';
import AdminPage from './components/AdminPage';
import SharePage from './components/SharePage'; // Add this import
import './App.css';

function App() {
  return (
    <HashRouter basename="/">
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/compare/:listId/:mode" element={<CompareApp />} />
          <Route path="/compare/:listId" element={<CompareApp />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/share" element={<SharePage />} /> {/* Add this route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;