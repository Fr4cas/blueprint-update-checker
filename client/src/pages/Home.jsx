import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import Footer from '../components/Footer';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Blueprint QR Viewer</h1>
      <p className="home-subtitle">Welcome! What would you like to do?</p>

      <div className="home-buttons">
        <button className="home-button" onClick={() => navigate('/upload')}>
          Upload a Blueprint
        </button>
        <button className="home-button" onClick={() => navigate('/scan')}>
          Scan a QR Code
        </button>
      </div>

      <Footer/>
    </div>
  );
}

export default Home;