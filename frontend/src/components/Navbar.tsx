import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

interface NavbarProps {
  showLinks?: boolean;
  isReservation?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showLinks = true, isReservation = false }) => {
  const [scrolled, setScrolled] = useState<boolean>(isReservation);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`sticky-navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo-container" onClick={closeMobileMenu}>
            <span className="logo-text">⚓ Mesón Marinero</span>
            <span className="logo-subtext">Alicante, Mediterráneo</span>
          </Link>
        </div>
        
        {showLinks && (
          <>
            <nav className="navbar-center desktop-only">
              <ul className="nav-links">
                <li>
                  <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                    Inicio
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/carta" className={({ isActive }) => isActive ? 'active' : ''}>
                    Carta
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/historia" className={({ isActive }) => isActive ? 'active' : ''}>
                    Nuestra Historia
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Hamburger Button */}
            {!isReservation && (
              <button 
                className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            )}
          </>
        )}

        {isReservation && <div className="navbar-divider desktop-only" />}
        
        <div className="navbar-right">
          {isReservation ? (
            <div className="phone-info">
              Reservas · <a href="tel:965000000">965 00 00 00</a>
            </div>
          ) : (
            <>
              <Link to="/reservar" className="btn btn-primary btn-navbar-res desktop-only">Reservar una Mesa</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showLinks && (
        <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}>
          <nav className="mobile-nav">
            <ul className="mobile-nav-links">
              <li>
                <NavLink to="/" end onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink to="/carta" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                  Carta
                </NavLink>
              </li>
              <li>
                <NavLink to="/historia" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                  Nuestra Historia
                </NavLink>
              </li>
              <li style={{ marginTop: '2rem' }}>
                <Link to="/reservar" className="btn btn-primary" onClick={closeMobileMenu} style={{ width: '100%' }}>
                  Reservar una Mesa
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
