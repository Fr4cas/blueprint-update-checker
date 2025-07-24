import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AttachIcon from "../assets/attach.svg";
import ScanIcon from "../assets/scan.svg";

import '../css/Home.css';

import Display from '../components/Display'
import Footer from '../components/Footer';

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation('home')

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
        <Display />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Home;