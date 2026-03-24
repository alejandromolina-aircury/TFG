import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
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
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 900, color: 'white' }}>Nuestra Historia</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>Tradición, mar y pasión desde 1990.</p>
        </div>
      </header>
      <main className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Tres décadas frente al mar</h2>
          <p>
            El Mesón Marinero abrió sus puertas por primera vez en el verano de 1990. Lo que comenzó como un pequeño rincón para pescadores locales, pronto se convirtió en un referente de la gastronomía alicantina gracias a la dedicación de la familia Rodríguez.
          </p>
          <p>
            Nuestra cocina se basa en un pilar fundamental: el respeto absoluto por el producto. Cada mañana, seleccionamos personalmente los mejores pescados y mariscos de la lonja para asegurar que solo lo más fresco llegue a su mesa.
          </p>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Nuestros Valores</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--accent-decor)' }}>
              <strong>Producto de proximidad:</strong> Trabajamos exclusivamente con proveedores locales y lonjas de la zona.
            </li>
            <li style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--accent-decor)' }}>
              <strong>Recetas tradicionales:</strong> Mantener vivos los sabores de siempre es nuestra razón de ser.
            </li>
            <li style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--accent-decor)' }}>
              <strong>Servicio cercano:</strong> Para nosotros, cada cliente es parte de la familia del Mesón.
            </li>
          </ul>
        </section>

        <section style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius)' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Venga a visitarnos</h2>
          <p>Estamos en el corazón del puerto de Alicante. Le esperamos con la mesa puesta.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
