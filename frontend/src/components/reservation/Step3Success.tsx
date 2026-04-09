import { useTranslation } from 'react-i18next';
import type { ReservationConfirmation } from '../../types';

interface Props {
  confirmation: ReservationConfirmation;
  onRestart: () => void;
}

export default function Step3Success({ confirmation, onRestart }: Props) {
  const { t, i18n } = useTranslation();
  const { booking, customer, table } = confirmation;

  const formattedDate = new Date(booking.date).toLocaleDateString(i18n.language || 'es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(booking.date).toLocaleTimeString(i18n.language || 'es', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="success-panel">
      <div className="success-icon">🎉</div>

      <div>
        <h2 className="success-title">{t('reservation.step3Title')}</h2>
        <p className="success-subtitle">
          {customer.isReturningCustomer
            ? t('reservation.step3SubtitleReturning', { name: customer.name.split(' ')[0] })
            : t('reservation.step3SubtitleNew', { name: customer.name.split(' ')[0], email: customer.email })}
        </p>
      </div>

      <div className="success-details-card">
        <div className="success-details-row">
          <span className="icon">📅</span>
          <span className="label">{t('reservation.dateLabel')}</span>
          <span className="value" style={{ textTransform: 'capitalize' }}>{formattedDate}</span>
        </div>
        <div className="success-details-row">
          <span className="icon">🕐</span>
          <span className="label">{t('reservation.timeLabel')}</span>
          <span className="value">{formattedTime}</span>
        </div>
        <div className="success-details-row">
          <span className="icon">👥</span>
          <span className="label">{t('reservation.paxLabel')}</span>
          <span className="value">{booking.pax} {booking.pax === 1 ? t('reservation.person') : t('reservation.persons')}</span>
        </div>
        <div className="success-details-row">
          <span className="icon">🍽️</span>
          <span className="label">{t('reservation.tableLabel')}</span>
          <span className="value">{table.name}{table.zone ? ` — ${table.zone}` : ''}</span>
        </div>
        {table.note && (
          <div className="success-details-row">
            <span className="icon">ℹ️</span>
            <span className="label">{t('reservation.noteLabel')}</span>
            <span className="value">{table.note}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: '#854d0e', margin: 0, fontWeight: 500 }}>
          {t('reservation.modifyOrCancel')} <strong>+34 912 345 678</strong>
        </p>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', marginTop: '1rem' }}>
        {t('reservation.emailSent')} <strong>{customer.email}</strong>.
      </p>

      <button type="button" className="btn btn-outline w-full" onClick={onRestart}>
        {t('reservation.backHomeBtn')}
      </button>
    </div>
  );
}
