// frontend/src/pages/admin/ConfiguracionPage.tsx

import './AdminPages.css';

const CONFIG_SECTIONS = [
  {
    title: '🍽️ Información del Restaurante',
    rows: [
      { label: 'Nombre', value: 'Mesón Marinero' },
      { label: 'Dirección', value: 'Calle del Puerto, 12 — Alicante' },
      { label: 'Teléfono', value: '965 00 00 00' },
      { label: 'Email de contacto', value: 'info@mesonmarinero.es' },
    ],
  },
  {
    title: '📅 Horario de apertura',
    rows: [
      { label: 'Días', value: 'Martes a Domingo' },
      { label: 'Turno comidas', value: '13:30 – 16:00' },
      { label: 'Turno cenas', value: '20:30 – 23:00' },
      { label: 'Intervalo de turnos', value: '30 minutos' },
    ],
  },
  {
    title: '🪑 Capacidad',
    rows: [
      { label: 'Aforo máximo', value: '80 comensales' },
      { label: 'Mesas activas', value: 'Ver sección Mesas' },
      { label: 'Duración media reserva', value: '90–120 min' },
    ],
  },
  {
    title: '🔧 Sistema',
    rows: [
      { label: 'Versión API', value: '2.0.0' },
      { label: 'Entorno', value: import.meta.env.MODE },
      { label: 'Zona horaria', value: 'Europe/Madrid (CET/CEST)' },
    ],
  },
];

export default function ConfiguracionPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Configuración</h1>
        <p>Datos generales del restaurante y parámetros del sistema</p>
      </div>

      <div
        style={{
          background: 'rgba(245, 176, 65, 0.1)',
          border: '1px solid rgba(245, 176, 65, 0.4)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem',
          color: '#7d5a00',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
        <span>
          Esta sección muestra la configuración actual del sistema. Para modificar parámetros de turnos y cierres, accede directamente a la API del backoffice.
        </span>
      </div>

      <div className="config-grid">
        {CONFIG_SECTIONS.map((section) => (
          <div className="config-section" key={section.title}>
            <h3>{section.title}</h3>
            {section.rows.map((row) => (
              <div className="config-row" key={row.label}>
                <span className="config-row__label">{row.label}</span>
                <span className="config-row__value">{row.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
