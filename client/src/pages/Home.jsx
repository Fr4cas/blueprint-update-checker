import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>🏗️ Blueprint QR Viewer</h1>
      <p>Welcome! What would you like to do?</p>

      <div>
        <button onClick={() => navigate('/upload')}>
          📤 Upload a New Blueprint
        </button>
        <button onClick={() => navigate('/scan')}>
          📷 Scan a QR Code
        </button>
      </div>

      <footer>
        <p>
          Version: 0.1 MVP | Language:
          <select>
            <option>EN</option>
            <option>繁體</option>
          </select>
        </p>
      </footer>
    </div>
  );
}

export default Home;