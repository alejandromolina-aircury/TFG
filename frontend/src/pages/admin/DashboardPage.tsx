// frontend/src/pages/admin/DashboardPage.tsx

import { useEffect, useState } from 'react';
import { getDashboard } from '../../services/api';
import type { DashboardData, BookingStatus } from '../../types';
import './AdminPages.css';

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  RECONFIRMED: 'Reconfirmada',
  SEATED: 'En mesa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No presentado',
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: '#F5B041',
  CONFIRMED: '#27ae60',
  RECONFIRMED: '#2980b9',
  SEATED: '#1A365D',
  COMPLETED: '#7f8c8d',
  CANCELLED: '#D9534F',
  NO_SHOW: '#2c3e50',
};

const STATUS_BADGE_CLASS: Record<BookingStatus, string> = {
  PENDING: 'badge badge-pending',
  CONFIRMED: 'badge badge-confirmed',
  RECONFIRMED: 'badge badge-reconfirmed',
  SEATED: 'badge badge-seated',
  COMPLETED: 'badge badge-completed',
  CANCELLED: 'badge badge-cancelled',
  NO_SHOW: 'badge badge-no-show',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError('No se pudo cargar el panel. Verifica la conexión con el servidor.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="state-loading">
      <span className="spinner">⏳</span>
      Cargando panel...
    </div>
  );

  if (error) return (
    <div className="state-error">
      <span style={{ fontSize: '2rem' }}>⚠️</span>
      {error}
    </div>
  );

  if (!data) return null;

  const { summary, statusCounts, bookings } = data;

  return (
    <div>
      <div className="page-header">
        <h1>Panel de Control</h1>
        <p>Resumen del día para Mesón Marinero</p>
      </div>

      {/* Widgets */}
      <div className="widgets-grid">
        <div className="widget-card accent-decor">
          <div className="widget-card__icon">📅</div>
          <div className="widget-card__label">Reservas hoy</div>
          <div className="widget-card__value">{summary.totalBookings}</div>
          <div className="widget-card__sub">{summary.activeBookings} activas</div>
        </div>

        <div className="widget-card accent-primary">
          <div className="widget-card__icon">👥</div>
          <div className="widget-card__label">Comensales previstos</div>
          <div className="widget-card__value">{summary.totalPaxExpected}</div>
          <div className="widget-card__sub">personas esperadas hoy</div>
        </div>

        <div className="widget-card accent-green">
          <div className="widget-card__icon">🍽️</div>
          <div className="widget-card__label">Capacidad actual</div>
          <div className="widget-card__value">{summary.occupancyRate}%</div>
          <div className="widget-card__sub">{summary.activeBookings} / {summary.totalTables} mesas</div>
          <div className="occupancy-bar">
            <div className="occupancy-bar__fill" style={{ width: `${summary.occupancyRate}%` }} />
          </div>
        </div>

        <div className="widget-card accent-action">
          <div className="widget-card__icon">📆</div>
          <div className="widget-card__label">Próximos 7 días</div>
          <div className="widget-card__value">{summary.upcomingNext7Days}</div>
          <div className="widget-card__sub">reservas pendientes</div>
        </div>
      </div>

      {/* Status breakdown */}
      {Object.keys(statusCounts).length > 0 && (
        <div className="section-card" style={{ marginBottom: '1.5rem' }}>
          <div className="section-card__header">
            <h2 className="section-card__title">Estado de reservas de hoy</h2>
          </div>
          <div className="section-card__body">
            <div className="status-pills">
              {(Object.entries(statusCounts) as [BookingStatus, number][]).map(([status, count]) => (
                <div className="status-pill" key={status}>
                  <div className="dot" style={{ background: STATUS_COLORS[status] }} />
                  <span>{STATUS_LABELS[status]}: <strong>{count}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Today's bookings table */}
      <div className="section-card">
        <div className="section-card__header">
          <h2 className="section-card__title">Reservas de hoy</h2>
          <a href="/admin/reservas" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            Ver todas →
          </a>
        </div>
        {bookings.length === 0 ? (
          <div className="state-empty">
            <span style={{ fontSize: '2rem' }}>🌊</span>
            No hay reservas para hoy
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Comensales</th>
                  <th>Mesa</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 10).map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700 }}>
                      {new Date(b.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <div className="customer-name">{b.customer.firstName} {b.customer.lastName}</div>
                      <div className="customer-email">{b.customer.email}</div>
                    </td>
                    <td>{b.pax} 👤</td>
                    <td>{b.table?.name ?? '—'}</td>
                    <td>
                      <span className={STATUS_BADGE_CLASS[b.status]}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
