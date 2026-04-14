import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>{t('footer.addressTitle')}</h4>
          <p>{t('footer.address1')}</p>
          <p>{t('footer.address2')}</p>
          <div className="footer-map mt-2">
            <img src="/img/Mapa.jpg" alt={t('footer.googleMap')} className="footer-map__img" />
          </div>
        </div>
        
        <div className="footer-column">
          <h4>{t('footer.contactTitle')}</h4>
          <p>Tel: +34 912 345 678</p>
          <p>Email: info@mesonmarinero.com</p>
        </div>
        
        <div className="footer-column">
          <h4>{t('footer.followTitle')}</h4>
          <div className="social-links">
            <a href="#" className="social-icon">Instagram</a>
            <a href="#" className="social-icon">Facebook</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>{t('footer.copyright')}</p>
          <div className="legal-links">
            <a href="#">{t('footer.privacyPolicy')}</a>
            <a href="#">{t('footer.termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
