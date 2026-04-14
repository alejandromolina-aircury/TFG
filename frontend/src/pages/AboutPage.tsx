import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/pages/PageHero.css';
import '../styles/pages/AboutPage.css';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <Navbar />
      <header className="page-hero">
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1>{t('aboutPage.title')}</h1>
          <p>{t('aboutPage.subtitle')}</p>
        </div>
      </header>
      <main className="about-container-page">
        <section className="about-section">
          <h2>{t('aboutPage.section1Title')}</h2>
          <p>{t('aboutPage.section1P1')}</p>
          <p>{t('aboutPage.section1P2')}</p>
        </section>

        <section className="about-section">
          <h2>{t('aboutPage.valuesTitle')}</h2>
          <ul className="about-values">
            <li>
              <strong>{t('aboutPage.val1Title')}</strong> {t('aboutPage.val1Desc')}
            </li>
            <li>
              <strong>{t('aboutPage.val2Title')}</strong> {t('aboutPage.val2Desc')}
            </li>
            <li>
              <strong>{t('aboutPage.val3Title')}</strong> {t('aboutPage.val3Desc')}
            </li>
          </ul>
        </section>

        <section className="about-visit-cta">
          <h2>{t('aboutPage.visitTitle')}</h2>
          <p>{t('aboutPage.visitDesc')}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
