// frontend/src/components/Specialties.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Specialties from './Specialties';

// Mock de useReveal hook
vi.mock('../services/useReveal', () => ({
  useReveal: () => ({ current: null })
}));

describe('Specialties Component', () => {
  it('renders the section title', () => {
    render(
      <BrowserRouter>
        < Specialties />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Nuestras Especialidades')).toBeInTheDocument();
  });

  it('renders all specialties cards', () => {
    render(
      <BrowserRouter>
        <Specialties />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Paella Marinera')).toBeInTheDocument();
    expect(screen.getByText('Pulpo a la Gallega')).toBeInTheDocument();
    expect(screen.getByText('Lubina al Horno')).toBeInTheDocument();
  });

  it('contains a link to the menu page', () => {
    render(
      <BrowserRouter>
        <Specialties />
      </BrowserRouter>
    );
    
    const link = screen.getByRole('link', { name: /ver carta completa/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/carta');
  });
});
