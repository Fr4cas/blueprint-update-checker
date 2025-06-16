import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home.jsx';
import UploadPage from './pages/UploadPage.jsx';

// Handles all pathing of app
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadPage />} />
    </Routes>
  );
}

export default App;