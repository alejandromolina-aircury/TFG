// frontend/src/components/reservation/Step3Success.tsx

import type { ReservationConfirmation } from '../../types';

interface Props {
  confirmation: ReservationConfirmation;
  onRestart: () => void;
}

export default function Step3Success({ confirmation, onRestart }: Props) {
  const { booking, customer, table } = confirmation;

  const formattedDate = new Date(booking.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(booking.date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="success-panel">
      <div className="success-icon">🎉</div>

      <div>
        <h2 className="success-title">¡Reserva Confirmada!</h2>
        <p className="success-subtitle">
          {customer.isReturningCustomer
            ? `¡Bienvenido de vuelta, ${customer.name.split(' ')[0]}! Te esperamos.`
            : `Gracias, ${customer.name.split(' ')[0]}. Hemos enviado los detalles a ${customer.email}.`}
        </p>
      </div>

      <div className="success-details-card">
        <div className="success-details-row">
          <span className="icon">📅</span>
          <span className="label">Fecha</span>
          <span className="value" style={{ textTransform: 'capitalize' }}>{formattedDate}</span>
        </div>
        <div className="success-details-row">
          <span className="icon">🕐</span>
          <span className="label">Hora</span>
          <span className="value">{formattedTime}</span>
        </div>
        <div className="success-details-row">
          <span className="icon">👥</span>
          <span className="label">Comensales</span>
          <span className="value">{booking.pax} {booking.pax === 1 ? 'persona' : 'personas'}</span>
        </div>
        <div className="success-details-row">
          <span className="icon">🍽️</span>
          <span className="label">Mesa</span>
          <span className="value">{table.name}{table.zone ? ` — ${table.zone}` : ''}</span>
        </div>
        {table.note && (
          <div className="success-details-row">
            <span className="icon">ℹ️</span>
            <span className="label">Nota</span>
            <span className="value">{table.note}</span>
          </div>
        )}
      </div>

      <div className="confirmation-code">
        <div className="confirmation-code__label">Código de reserva</div>
        <div className="confirmation-code__value">{booking.confirmationCode}</div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px' }}>
        Guarda este código por si necesitas modificar o cancelar tu reserva. También te hemos enviado un email a <strong>{customer.email}</strong>.
      </p>

      <button type="button" className="btn btn-outline w-full" onClick={onRestart}>
        Hacer otra reserva
      </button>
    </div>
  );
}
