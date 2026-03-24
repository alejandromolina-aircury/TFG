import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  return (
    <section className="about-us" id="story">
      <div className="about-container">
        <div className="about-content">
          <h2>Sobre Nosotros</h2>
          <p>
            Con más de 30 años de tradición, el Mesón Marinero nació de la pasión por el mar 
            y la cocina auténtica. Nuestra historia es la de una familia dedicada a ofrecer 
            lo mejor de nuestras costas en cada plato, manteniendo vivas las recetas de antaño.
          </p>
          <Link to="/historia" className="btn btn-outline">Nuestra Historia</Link>
        </div>
        <div className="about-image">
          <img src="/img/AboutUs.png" alt="Interior del Restaurante" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
