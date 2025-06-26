import { useTranslation } from 'react-i18next';

import '../css/Footer.css';

function Footer() {
  const { t, i18n } = useTranslation('common');

  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <footer className="footer">
      <p>
        {t('version', { version: '0.1 MVP' })} | {t('language')}:
        <select className="select" onChange={changeLanguage} defaultValue={i18n.language}>
          <option value={"en"}>EN</option>
          <option value={"zh"}>中文</option>
        </select>
      </p>
    </footer>
  );
}

export default Footer;