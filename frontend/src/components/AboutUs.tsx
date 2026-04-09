import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../services/useReveal';

const AboutUs: React.FC = () => {
  const { t } = useTranslation();
  const revealRef = useReveal();

  return (
    <section className="about-us" id="story" ref={revealRef}>
      <div className="about-container">
        <div className="about-content reveal">
          <h2>{t('about.title')}</h2>
          <p>
            {t('about.introDesc')}
          </p>
          <Link to="/historia" className="btn btn-outline">{t('about.historyBtn')}</Link>
        </div>
        <div className="about-image reveal delay-1">
          <img src="/img/AboutUs.png" alt={t('about.imgAlt')} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
