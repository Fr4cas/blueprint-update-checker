import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ScanPage from './pages/ScanPage.jsx';

function NotFound() {
  return <h2 style={{ textAlign: 'center' }}>404 – Page Not Found</h2>;
}

// Handles all pathing of app
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;