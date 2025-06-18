import React from 'react';
import { useNavigate } from 'react-router-dom';

// assets
import AttachIcon from "../assets/attach.svg";
import ScanIcon from "../assets/scan.svg";

// css
import '../css/Home.css';

// components
import Footer from '../components/Footer';

// =========================================================================================
// js section start

function Home() {
  const navigate = useNavigate();

  //  js section end
  // =========================================================================================
  //  html section start 

  return (
    <>
      <div className="home-container">
        <h1 className="home-title">Blueprint QR Viewer</h1>
        <p className="home-subtitle">Welcome! What would you like to do?</p>

        <div className="home-buttons">
          <button className="home-button" onClick={() => navigate('/upload')}>
            <img src={AttachIcon} alt="Attach icon" className='icon' />
            QR Attacher
          </button>
          <button className="home-button" onClick={() => navigate('/scan')}>
            <img src={ScanIcon} alt="Scan icon" className='icon' />
            Scanner
          </button>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

// html section end
// =========================================================================================

export default Home;