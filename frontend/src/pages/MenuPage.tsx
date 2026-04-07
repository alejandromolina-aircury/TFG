import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MenuPage: React.FC = () => {
  const sections = [
    {
      title: 'ENTRANTES FRÍOS',
      items: [
        { name: 'Carpaccio de ventresca de atún rojo', price: '20€' },
        { name: 'Hueva de mújol en semi salazón con almendra marcona', price: '11€' },
        { name: 'Anchoa de Lolin', price: '3€' },
        { name: 'Nuestra marinera', price: '4.5 / 6€' },
        { name: 'Ensaladilla de pulpo', price: '10 / 17€' },
        { name: 'Sardina ahumada', price: '5€' },
        { name: 'Ensalada de ventresca de bonito', price: '20€' },
        { name: 'Ensalada de sardina ahumada', price: '19.5€' },
        { name: 'Cecina de Astorga', price: '10 / 17€' },
        { name: 'Embutidos de Guadalest Casa Gloria', price: '8 / 12€' },
        { name: 'Tabla de quesos', price: '10 / 16€' }
      ]
    },
    {
      title: 'ENTRANTES CALIENTES',
      items: [
        { name: 'Croquetas caseras', price: '3€' },
        { name: 'Sepionet plancha', price: '12 / 20€' },
        { name: 'Puntilla encebollada / Chipirón plancha', price: '21 / 11€ unidad' },
        { name: 'Chipirón encebollado', price: '11€ unidad' },
        { name: 'Almejas a la marinera', price: '21€' },
        { name: 'Mejillones al vapor', price: '12€' },
        { name: 'Mejillones picantones', price: '12€' },
        { name: 'Pulpo dos cocciones', price: '22€' }
      ]
    },
    {
      title: 'LOS MÁS ESPECIALES',
      items: [
        { name: 'Quisquilla 100gr.', price: '17€' },
        { name: 'Gamba roja 1ª', price: 'S. Mercado' },
        { name: 'Salpicón de langosta', price: 'S. Mercado' }
      ]
    },
    {
      title: 'PARA DAR LA LATA',
      items: [
        { name: 'Caviar Tanit King Gold Lata 10 gr.', price: '30€' },
        { name: 'Navajas al natural Real Conservera Española', price: '22€' },
        { name: 'Mejillones en escabeche con papas', price: '16€' },
        { name: 'Sardinillas en aceite Real Conservera Española', price: '22€' }
      ]
    },
    {
      title: 'INDIVIDUALES',
      items: [
        { name: 'Merluza rebozada', price: '24€' },
        { name: 'Ventresca de atún rojo', price: '30€' },
        { name: 'Solomillo de ternera', price: '25€' }
      ]
    },
    {
      title: 'SEGUNDOS COMPARTIR (Precio por persona)',
      items: [
        { name: 'Rodaballo a la castreña', price: '30€' },
        { name: 'Cogote de merluza', price: '24€' },
        { name: 'Lubina a la espalda', price: '29€' },
        { name: 'Cherna al horno', price: '29€' },
        { name: 'Dentón a la espalda', price: '30€' },
        { name: 'Urta a la espalda', price: '29€' },
        { name: 'Besugo a la espalda', price: '35€' },
        { name: 'Cabracho al horno', price: '30€' },
        { name: 'Corvina a la espalda', price: '25€' },
        { name: 'Chuleta de vaca (Precio pieza)', price: '42€/kilo' }
      ]
    },
    {
      title: 'Acompañamientos y Extras',
      items: [
        { name: 'Pan de pueblo', price: '1€ P.P.' },
        { name: 'Salsas extra', price: '1€' },
        { name: 'Aceitunas', price: '1€' },
        { name: 'Almendras fritas', price: '2.5€' },
        { name: 'Aceite Verdeliss', price: '1.5€ P.P.' }
      ]
    }
  ];

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
        {sections.map((section, idx) => (
          <div key={idx} className="menu-section" style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary)', borderBottom: '2px solid var(--accent-decor)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {section.title}
            </h2>
            <div className="menu-items">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px dashed var(--border)', paddingBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: 'var(--accent-action)', fontWeight: 700 }}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <footer style={{ marginTop: '5rem', textAlign: 'center', backgroundColor: 'var(--bg-light)', padding: '3rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Agradecimientos</h3>
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
