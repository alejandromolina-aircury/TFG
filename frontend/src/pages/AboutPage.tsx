import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <Navbar />
      <header className="page-hero" style={{ 
        position: 'relative',
        padding: '8rem 0', 
        textAlign: 'center', 
        backgroundImage: 'url("/img/Home.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white' 
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 900, color: 'white' }}>{t('aboutPage.title')}</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>{t('aboutPage.subtitle')}</p>
        </div>
      </header>
      <main className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{t('aboutPage.section1Title')}</h2>
          <p>
            {t('aboutPage.section1P1')}
          </p>
          <p>
            {t('aboutPage.section1P2')}
          </p>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{t('aboutPage.valuesTitle')}</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--accent-decor)' }}>
              <strong>{t('aboutPage.val1Title')}</strong> {t('aboutPage.val1Desc')}
            </li>
            <li style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--accent-decor)' }}>
              <strong>{t('aboutPage.val2Title')}</strong> {t('aboutPage.val2Desc')}
            </li>
            <li style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--accent-decor)' }}>
              <strong>{t('aboutPage.val3Title')}</strong> {t('aboutPage.val3Desc')}
            </li>
          </ul>
        </section>

        <section style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius)' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{t('aboutPage.visitTitle')}</h2>
          <p>{t('aboutPage.visitDesc')}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
