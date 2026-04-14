import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPublicMenu } from '../services/api';
import type { MenuCategory } from '../types';
import '../styles/pages/PageHero.css';
import '../styles/pages/MenuPage.css';

const MenuPage: React.FC = () => {
  const { t } = useTranslation();
  const [sections, setSections] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicMenu()
      .then(data => setSections(data))
      .catch(err => console.error("Error loading menu", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="menu-page">
      <Navbar />
      <header className="page-hero">
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1>{t('menu.title')}</h1>
          <p>{t('menu.subtitle')}</p>
        </div>
      </header>
      <main className="menu-container">
        {loading ? (
          <div className="menu-loading">
            <div className="spinner">⏳</div>
            <p>{t('menu.loading')}</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="menu-empty">
            <p className="menu-empty__title">{t('menu.emptyTitle')}</p>
            <p className="menu-empty__desc">{t('menu.emptyDesc')}</p>
          </div>
        ) : (
          sections.map((section, idx) => (
            <div key={idx} className="menu-section">
              <h2>{section.name}</h2>
              {section.description && (
                <p className="menu-section__desc">{section.description}</p>
              )}
              <div className="menu-items">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="menu-item">
                    <div className="menu-item__row">
                      <span className="menu-item__name">{item.name}</span>
                      <div className="menu-item__divider"></div>
                      <span className="menu-item__price">{item.price}</span>
                    </div>
                    {item.description && (
                      <p className="menu-item__desc">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <footer className="menu-thanks">
          <h3>{t('menu.thanksTitle')}</h3>
          <p>{t('menu.thanksText')}</p>
        </footer>
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
