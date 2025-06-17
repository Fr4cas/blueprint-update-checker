import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ScanPage from './pages/ScanPage.jsx';

// Handles all pathing of app
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/scan" element={<ScanPage />} />
    </Routes>
  );
}

export default App;