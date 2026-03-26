import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../services/useReveal';

const specialties = [
  {
    id: 1,
    name: 'Paella Marinera',
    description: 'Nuestro arroz más famoso con marisco fresco del día.',
    image: '/img/Paella.png'
  },
  {
    id: 2,
    name: 'Pulpo a la Gallega',
    description: 'Tierno pulpo con pimentón de la vera y aceite de oliva virgen.',
    image: '/img/Pulpo.png'
  },
  {
    id: 3,
    name: 'Lubina al Horno',
    description: 'Pescado salvaje preparado con el toque tradicional del mesón.',
    image: '/img/Lubina.png'
  }
];

const Specialties: React.FC = () => {
  const revealRef = useReveal();

  return (
    <section className="specialties" id="menu" ref={revealRef}>
      <div className="section-header reveal">
        <h2>Nuestras Especialidades</h2>
      </div>
      <div className="specialties-grid">
        {specialties.map((item, index) => (
          // Las 3 cards deben revelarse al mismo tiempo.
          <div key={item.id} className="specialty-card reveal">
            <div className="card-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="card-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="section-footer reveal delay-3">
        <Link to="/carta" className="btn btn-primary">Ver Carta Completa</Link>
      </div>
    </section>
  );
};

export default Specialties;
