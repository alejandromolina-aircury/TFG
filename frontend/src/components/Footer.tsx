import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>Dirección</h4>
          <p>Calle del Mar, 123</p>
          <p>28001, Madrid, España</p>
          <div className="map-placeholder mt-2">
            <div className="placeholder-image" style={{ height: '150px', fontSize: '1rem' }}>Mapa de Google</div>
          </div>
        </div>
        
        <div className="footer-column">
          <h4>Contacto</h4>
          <p>Tel: +34 912 345 678</p>
          <p>Email: info@mesonmarinero.com</p>
        </div>
        
        <div className="footer-column">
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href="#" className="social-icon">Instagram</a>
            <a href="#" className="social-icon">Facebook</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; 2024 Mesón Marinero. Todos los derechos reservados.</p>
          <div className="legal-links">
            <a href="#">Política de Privacidad</a>
            <a href="#">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
