// frontend/src/pages/admin/ReservasPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { getBookings, updateBookingStatus } from '../../services/api';
import type { Booking, BookingStatus } from '../../types';
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

const STATUS_BADGE_CLASS: Record<BookingStatus, string> = {
  PENDING: 'badge badge-pending',
  CONFIRMED: 'badge badge-confirmed',
  RECONFIRMED: 'badge badge-reconfirmed',
  SEATED: 'badge badge-seated',
  COMPLETED: 'badge badge-completed',
  CANCELLED: 'badge badge-cancelled',
  NO_SHOW: 'badge badge-no-show',
};

const ALL_STATUSES: BookingStatus[] = [
  'PENDING', 'CONFIRMED', 'RECONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW',
];

export default function ReservasPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | ''>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    getBookings({
      date: filterDate || undefined,
      status: filterStatus || undefined,
      limit: 100,
    })
      .then((res) => {
        // API may return data as array or { bookings } object
        if (Array.isArray(res)) {
          setBookings(res as unknown as Booking[]);
        } else {
          setBookings(res.bookings ?? []);
        }
      })
      .catch(() => setError('Error al cargar reservas.'))
      .finally(() => setLoading(false));
  }, [filterDate, filterStatus]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: newStatus } : b)
      );
    } catch {
      alert('No se pudo actualizar el estado. Inténtalo de nuevo.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Reservas</h1>
        <p>Gestión y seguimiento de todas las reservas</p>
      </div>

      <div className="section-card">
        <div className="section-card__header">
          <h2 className="section-card__title">Listado de reservas</h2>
          <div className="filters-bar">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              title="Filtrar por fecha"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as BookingStatus | '')}
            >
              <option value="">Todos los estados</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            {(filterDate || filterStatus) && (
              <button
                className="btn btn-ghost"
                style={{ background: 'var(--bg-light)', color: 'var(--text-muted)', border: '1.5px solid var(--border)', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                onClick={() => { setFilterDate(''); setFilterStatus(''); }}
              >
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="state-loading">
            <span className="spinner">⏳</span> Cargando reservas...
          </div>
        )}

        {error && <div className="state-error"><span>⚠️</span>{error}</div>}

        {!loading && !error && bookings.length === 0 && (
          <div className="state-empty">
            <span style={{ fontSize: '2rem' }}>🔍</span>
            No se encontraron reservas con los filtros actuales
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Comensales</th>
                  <th>Mesa</th>
                  <th>Origen</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const dt = new Date(b.date);
                  return (
                    <tr key={b.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {dt.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {dt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <div className="customer-name">
                          {b.customer.firstName} {b.customer.lastName}
                          {b.customer.isVip && ' ⭐'}
                        </div>
                        <div className="customer-email">{b.customer.email}</div>
                      </td>
                      <td>{b.pax}</td>
                      <td>{b.table?.name ?? '—'}</td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {b.source === 'WEB' ? '🌐 Web' : b.source === 'PHONE' ? '📞 Tel.' : b.source === 'WALK_IN' ? '🚶 Presencial' : '🖥️ Backoffice'}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`status-select ${STATUS_BADGE_CLASS[b.status]}`}
                          value={b.status}
                          disabled={updatingId === b.id}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                          title="Cambiar estado"
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
