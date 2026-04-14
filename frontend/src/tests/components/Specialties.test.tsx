import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Specialties from '../../components/Specialties';
import { getPublicFrontendConfig } from '../../services/api';

vi.mock('../../services/useReveal', () => ({
  useReveal: () => ({ current: null })
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'es' }
  })
}));

vi.mock('../../services/api', () => ({
  getPublicFrontendConfig: vi.fn(),
}));

describe('Specialties Component', () => {
  it('renders the section title and specialties cards', async () => {
    vi.mocked(getPublicFrontendConfig).mockResolvedValue({
      specialties: {
        title: { es: 'Nuestras Especialidades' },
        items: [
          { id: 1, name: { es: 'Paella Marinera' }, description: { es: 'desc 1' }, image: '/img/Paella.png' },
          { id: 2, name: { es: 'Pulpo a la Gallega' }, description: { es: 'desc 2' }, image: '/img/Pulpo.png' },
          { id: 3, name: { es: 'Lubina al Horno' }, description: { es: 'desc 3' }, image: '/img/Lubina.png' },
        ]
      }
    });

    render(
      <BrowserRouter>
        <Specialties />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Nuestras Especialidades')).toBeInTheDocument();
      expect(screen.getByText('Paella Marinera')).toBeInTheDocument();
      expect(screen.getByText('Pulpo a la Gallega')).toBeInTheDocument();
      expect(screen.getByText('Lubina al Horno')).toBeInTheDocument();
    });
  });

  it('contains a link to the menu page', async () => {
    vi.mocked(getPublicFrontendConfig).mockResolvedValue({});
    render(
      <BrowserRouter>
        <Specialties />
      </BrowserRouter>
    );
    
    const link = await screen.findByRole('link', { name: /ver carta completa/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/carta');
  });
});
