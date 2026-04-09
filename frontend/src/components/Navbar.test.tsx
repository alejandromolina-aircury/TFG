// frontend/src/components/Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders correctly with default props', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('⚓ Mesón Marinero')).toBeInTheDocument();
    
    // Debería haber 2 links a "Carta" (Desktop y Mobile)
    const cartaLinks = screen.getAllByRole('link', { name: /carta/i });
    expect(cartaLinks.length).toBe(2);
  });

  it('hides nav links when showLinks is false', () => {
    render(
      <BrowserRouter>
        <Navbar showLinks={false} />
      </BrowserRouter>
    );
    
    expect(screen.queryByText('Inicio')).not.toBeInTheDocument();
  });

  it('shows phone info when isReservation is true', () => {
    render(
      <BrowserRouter>
        <Navbar isReservation={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/965 00 00 00/i)).toBeInTheDocument();
    expect(screen.queryByText('Reservar una Mesa')).not.toBeInTheDocument();
  });
});
