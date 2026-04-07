import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../services/useReveal';

const Hero: React.FC = () => {
  const revealRef = useReveal();

  return (
    <section className="hero" id="home" ref={revealRef}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="reveal">Sabor a Mar, Tradición en la Mesa</h1>
        <p className="hero-subtitle reveal">
          Disfruta de la mejor cocina mediterránea con un ambiente acogedor. 
          Pescados frescos, mariscos seleccionados y arroces tradicionales.
        </p>
        <div className="hero-ctas reveal">
          <Link to="/reservar" className="btn btn-primary">Reservar Ahora</Link>
          <Link to="/carta" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Ver Carta</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
