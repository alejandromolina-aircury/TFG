import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Sabor a Mar, Tradición en la Mesa</h1>
        <p className="hero-subtitle">
          Disfruta de la mejor cocina mediterránea con vistas inmejorables. 
          Pescados frescos, mariscos seleccionados y arroces tradicionales.
        </p>
        <div className="hero-ctas">
          <Link to="/reservar" className="btn btn-primary">Reservar Ahora</Link>
          <Link to="/carta" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Ver Carta</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
