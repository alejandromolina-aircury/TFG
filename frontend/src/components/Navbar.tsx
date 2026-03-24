import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface NavbarProps {
  showLinks?: boolean;
  isReservation?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showLinks = true, isReservation = false }) => {
  return (
    <header className="sticky-navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo-container">
            <span className="logo-text">⚓ Mesón Marinero</span>
            <span className="logo-subtext">Alicante, Mediterráneo</span>
          </Link>
        </div>
        
        {showLinks && (
          <nav className="navbar-center">
            <ul className="nav-links">
              <li>
                <NavLink 
                  to="/" 
                  end 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/carta" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Carta
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/historia" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Nuestra Historia
                </NavLink>
              </li>
            </ul>
          </nav>
        )}

        {isReservation && <div className="navbar-divider" />}
        
        <div className="navbar-right">
          {isReservation ? (
            <div className="phone-info">
              Reservas · <a href="tel:965000000">965 00 00 00</a>
            </div>
          ) : (
            <>
              <Link to="/reservar" className="btn btn-primary btn-navbar-res">Reservar una Mesa</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
