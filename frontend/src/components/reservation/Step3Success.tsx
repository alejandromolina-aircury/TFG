
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

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: '#854d0e', margin: 0, fontWeight: 500 }}>
          Si necesitas modificar o cancelar tu reserva, por favor llámanos al local: <strong>+34 912 345 678</strong>
        </p>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', marginTop: '1rem' }}>
        Te hemos enviado los detalles de tu reserva al email <strong>{customer.email}</strong>.
      </p>

      <button type="button" className="btn btn-outline w-full" onClick={onRestart}>
        Volver al inicio
      </button>
    </div>
  );
}
