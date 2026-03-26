import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../services/useReveal';

const AboutUs: React.FC = () => {
  const revealRef = useReveal();

  return (
    <section className="about-us" id="story" ref={revealRef}>
      <div className="about-container">
        <div className="about-content reveal">
          <h2>Sobre Nosotros</h2>
          <p>
            Con más de 30 años de tradición, el Mesón Marinero nació de la pasión por el mar 
            y la cocina auténtica. Nuestra historia es la de una familia dedicada a ofrecer 
            lo mejor de nuestras costas en cada plato, manteniendo vivas las recetas de antaño.
          </p>
          <Link to="/historia" className="btn btn-outline">Nuestra Historia</Link>
        </div>
        <div className="about-image reveal delay-1">
          <img src="/img/AboutUs.png" alt="Interior del Restaurante" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
