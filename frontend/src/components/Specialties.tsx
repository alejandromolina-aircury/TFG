import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../services/useReveal';
import { useConfig } from '../context/ConfigContext';

const defaultSpecialties = [
  {
    id: 1,
    name: { es: 'Paella Marinera', en: 'Seafood Paella', fr: 'Paella aux fruits de mer' },
    description: { es: 'Nuestro arroz más famoso con marisco fresco del día.', en: 'Our most famous rice with fresh seafood.', fr: 'Notre riz le plus célèbre avec des fruits de mer du jour.' },
    image: '/img/Paella.png'
  },
  {
    id: 2,
    name: { es: 'Pulpo a la Gallega', en: 'Galician style Octopus', fr: 'Poulpe à la galicienne' },
    description: { es: 'Tierno pulpo con pimentón de la vera y aceite de oliva virgen.', en: 'Tender octopus with paprika and extra virgin olive oil.', fr: 'Poulpe tendre au paprika et à l\'huile d\'olive extra vierge.' },
    image: '/img/Pulpo.png'
  },
  {
    id: 3,
    name: { es: 'Lubina al Horno', en: 'Baked Sea Bass', fr: 'Bar au four' },
    description: { es: 'Pescado salvaje preparado con el toque tradicional del mesón.', en: 'Wild fish prepared with our traditional touch.', fr: 'Poisson sauvage préparé avec notre touche traditionnelle.' },
    image: '/img/Lubina.png'
  }
];

const defaultTitle = {
  es: 'Nuestras Especialidades',
  en: 'Our Specialties',
  fr: 'Nos Spécialités'
};

const Specialties: React.FC = () => {
  const revealRef = useReveal();
  const { i18n } = useTranslation();
  const { config } = useConfig();
  const specialtiesConfig = config.specialties;

  const currentLang = i18n.language?.split('-')[0] || 'es';
  
  const title = specialtiesConfig?.title?.[currentLang] || defaultTitle[currentLang as keyof typeof defaultTitle] || defaultTitle.es;
  const items = specialtiesConfig?.items || defaultSpecialties;

  return (
    <section className="specialties" id="menu" ref={revealRef}>
      <div className="section-header reveal">
        <h2>{title}</h2>
      </div>
      <div className="specialties-grid">
        {items.map((item: any) => (
          <div key={item.id} className="specialty-card reveal">
            <div className="card-image">
              <img src={item.image} alt={item.name[currentLang] || item.name.es} />
            </div>
            <div className="card-content">
              <h3>{item.name[currentLang] || item.name.es}</h3>
              <p>{item.description[currentLang] || item.description.es}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="section-footer reveal delay-3">
        <Link to="/carta" className="btn btn-primary">
          {currentLang === 'en' ? 'View Full Menu' : currentLang === 'fr' ? 'Voir Menu Complet' : 'Ver Carta Completa'}
        </Link>
      </div>
    </section>
  );
};

export default Specialties;
