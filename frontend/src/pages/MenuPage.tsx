import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPublicMenu } from '../services/api';
import type { MenuCategory } from '../types';

const MenuPage: React.FC = () => {
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
      <header className="page-hero" style={{ 
        position: 'relative',
        padding: '8rem 0', 
        textAlign: 'center', 
        backgroundImage: 'url("/img/Home.png")', // Mediterranean fish plate
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
          <h1 style={{ fontSize: 'var(--hero-h1-size, 3.5rem)', marginBottom: '1.5rem', fontWeight: 900, color: 'white' }}>Nuestra Carta</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>Los mejores sabores del Mediterráneo, seleccionados para ti.</p>
        </div>
      </header>
      <main className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: 'var(--text-muted)' }}>Cargando nuestra carta...</p>
          </div>
        ) : sections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>La carta no está disponible en este momento.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Por favor, vuelve a consultarla más tarde o pregunta a nuestro personal.</p>
          </div>
        ) : (
          sections.map((section, idx) => (
            <div key={idx} className="menu-section" style={{ marginBottom: '4rem' }}>
              <h2 style={{ 
                color: 'var(--primary)', 
                borderBottom: '2px solid var(--accent-decor)', 
                paddingBottom: '0.75rem', 
                marginBottom: '2rem', 
                fontSize: '1.75rem',
                fontFamily: "'Playfair Display', serif"
              }}>
                {section.name}
              </h2>
              {section.description && (
                <p style={{ 
                  fontSize: '1rem', 
                  color: 'var(--text-muted)', 
                  marginBottom: '2rem', 
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}>
                  {section.description}
                </p>
              )}
              <div className="menu-items">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} style={{ 
                    marginBottom: '1.75rem', 
                    borderBottom: '1px dashed var(--border)', 
                    paddingBottom: '0.75rem' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-dark)' }}>{item.name}</span>
                      <div style={{ flex: 1, borderBottom: '1px dotted var(--border)', margin: '0 0.5rem', marginBottom: '0.3rem', opacity: 0.3 }}></div>
                      <span style={{ color: 'var(--accent-action)', fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>{item.price}</span>
                    </div>
                    {item.description && (
                      <p style={{ 
                        fontSize: '0.92rem', 
                        color: 'var(--text-muted)', 
                        marginTop: '0.4rem', 
                        marginBottom: 0,
                        lineHeight: '1.5'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <footer style={{ marginTop: '5rem', textAlign: 'center', backgroundColor: 'var(--bg-light)', padding: '3rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontFamily: "'Playfair Display', serif" }}>Agradecimientos</h3>
          <p style={{ fontStyle: 'italic', color: 'var(--text-dark)', lineHeight: '1.8' }}>
            "A nuestros padres, Eduardo y Alicia, que desde 1988 forjaron este sueño, que hasta hoy sus hijos intentamos mantener vivo día a día. Siéntate a la mesa, siéntete en tu casa, descorchemos un buen vino, y disfruta de nuestro precioso legado."
          </p>
        </footer>
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
