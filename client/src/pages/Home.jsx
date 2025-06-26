import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('home')

  //  js section end
  // =========================================================================================
  //  html section start 

  return (
    <>
      <div className="home-container">
        <h1 className="home-title">{t('title')}</h1>
        <p className="home-subtitle">{t('subtitle')}</p>

        <div className="home-buttons">
          <button className="home-button" onClick={() => navigate('/upload')}>
            <img src={AttachIcon} alt="Attach icon" className='icon' />
            {t('button.attach')}
          </button>
          <button className="home-button" onClick={() => navigate('/scan')}>
            <img src={ScanIcon} alt="Scan icon" className='icon' />
            {t('button.scan')}
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