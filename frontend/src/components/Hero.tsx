import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../services/useReveal';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const revealRef = useReveal();

  return (
    <section className="hero" id="home" ref={revealRef}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="reveal">{t('hero.title')}</h1>
        <p className="hero-subtitle reveal">
          {t('hero.subtitle')}
        </p>
        <div className="hero-ctas reveal">
          <Link to="/reservar" className="btn btn-primary">{t('hero.bookNow')}</Link>
          <Link to="/carta" className="btn btn-outline-light">{t('hero.viewMenu')}</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
