import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../context/ConfigContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { config } = useConfig();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>{t('footer.addressTitle')}</h4>
          <p>{config.restaurant_address}</p>
          <div className="footer-map mt-2">
            <img src="/img/Mapa.jpg" alt={t('footer.googleMap')} className="footer-map__img" />
          </div>
        </div>
        
        <div className="footer-column">
          <h4>{t('footer.contactTitle')}</h4>
          <p>Tel: {config.restaurant_phone}</p>
          <p>Email: {config.restaurant_email}</p>
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
