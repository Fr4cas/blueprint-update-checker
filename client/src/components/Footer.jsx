import React from 'react';
import '../css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>
        Version: 0.1 MVP | Language:
        <select className="select">
          <option>EN</option>
          <option>繁體</option>
        </select>
      </p>
    </footer>
  );
}

export default Footer;