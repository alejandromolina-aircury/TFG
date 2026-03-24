// frontend/src/components/reservation/Step2User.tsx

import { useState } from 'react';
import { createReservation } from '../../services/api';
import type { ReservationConfirmation } from '../../types';

interface Props {
  bookingData: { date: string; time: string; pax: number };
  onNext: (confirmation: ReservationConfirmation) => void;
  onBack: () => void;
}

export default function Step2User({ bookingData, onNext, onBack }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): string => {
    if (!firstName.trim()) return 'El nombre es obligatorio.';
    if (!lastName.trim()) return 'Los apellidos son obligatorios.';
    if (!email.trim() || !email.includes('@')) return 'Introduce un email válido.';
    if (!phone.trim()) return 'El teléfono es obligatorio.';
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);
    try {
      const result = await createReservation({
        date: bookingData.date,
        time: bookingData.time,
        pax: bookingData.pax,
        specialRequests: specialRequests.trim() || undefined,
        customer: { firstName, lastName, email, phone },
      });
      onNext(result);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? 'Error al crear la reserva. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="form-title">Tus Datos</h2>
      <p className="form-subtitle">
        Reserva para <strong>{bookingData.pax} {bookingData.pax === 1 ? 'persona' : 'personas'}</strong> el{' '}
        <strong>{new Date(bookingData.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</strong> a las{' '}
        <strong>{bookingData.time}</strong>.
      </p>

      <div className="form-grid">
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label htmlFor="u-firstname">Nombre</label>
            <input
              id="u-firstname"
              type="text"
              placeholder="María"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="u-lastname">Apellidos</label>
            <input
              id="u-lastname"
              type="text"
              placeholder="García López"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="u-email">Email</label>
          <input
            id="u-email"
            type="email"
            placeholder="maria@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="u-phone">Teléfono</label>
          <input
            id="u-phone"
            type="tel"
            placeholder="+34 600 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="u-requests">Peticiones especiales</label>
          <textarea
            id="u-requests"
            placeholder="Alergias, silla para bebé, aniversario..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onBack}
            disabled={loading}
            style={{ flex: '0 0 auto', padding: '0.75rem 1.25rem' }}
          >
            ← Atrás
          </button>
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '⏳ Confirmando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
    </div>
  );
}
