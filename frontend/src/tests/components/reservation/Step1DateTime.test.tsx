import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Step1DateTime from '../../../components/reservation/Step1DateTime';
import * as api from '../../../services/api';

// Mock de los servicios de API
vi.mock('../../../services/api', () => ({
  getAvailableTimes: vi.fn(),
  getPublicConfig: vi.fn(),
}));

describe('Step1DateTime Component', () => {
  const onNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (api.getPublicConfig as any).mockResolvedValue({ maxPax: 12 });
  });

  it('renders correctly', async () => {
    render(<Step1DateTime onNext={onNext} />);
    expect(screen.getByText('Haz tu Reserva')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha')).toBeInTheDocument();
  });

  it('loads and displays time slots after selecting a date', async () => {
    const mockSlots = [
      { time: '13:00', available: true },
      { time: '13:30', available: true },
      { time: '14:00', available: false },
    ];
    (api.getAvailableTimes as any).mockResolvedValue(mockSlots);

    render(<Step1DateTime onNext={onNext} />);
    
    const dateInput = screen.getByLabelText('Fecha');
    fireEvent.change(dateInput, { target: { value: '2026-05-01' } });

    // Debería mostrar los slots disponibles
    await waitFor(() => {
      expect(screen.getByText('13:00')).toBeInTheDocument();
      expect(screen.getByText('13:30')).toBeInTheDocument();
      expect(screen.queryByText('14:00')).not.toBeInTheDocument(); // No disponible
    });
  });

  it('updates slots when pax (guests) changes', async () => {
    render(<Step1DateTime onNext={onNext} />);
    
    const dateInput = screen.getByLabelText('Fecha');
    fireEvent.change(dateInput, { target: { value: '2026-05-01' } });

    const paxSelect = screen.getByLabelText('Comensales');
    fireEvent.change(paxSelect, { target: { value: '4' } });

    await waitFor(() => {
      expect(api.getAvailableTimes).toHaveBeenCalledWith('2026-05-01', 4);
    });
  });

  it('calls onNext when form is submitted with valid data', async () => {
    (api.getAvailableTimes as any).mockResolvedValue([{ time: '13:00', available: true }]);
    
    render(<Step1DateTime onNext={onNext} />);
    
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2026-05-01' } });
    
    await waitFor(() => screen.getByText('13:00'));
    fireEvent.click(screen.getByText('13:00'));
    
    fireEvent.click(screen.getByText('Siguiente →'));
    
    expect(onNext).toHaveBeenCalledWith({
      date: '2026-05-01',
      time: '13:00',
      pax: 2
    });
  });
});
