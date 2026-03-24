// frontend/src/pages/admin/MesasPage.tsx

import { useEffect, useState } from 'react';
import { getZones } from '../../services/api';
import './AdminPages.css';

interface TableItem {
  id: number;
  name: string;
  minCapacity: number;
  maxCapacity: number;
  isActive: boolean;
}

interface ZoneWithTables {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  tables: TableItem[];
}

export default function MesasPage() {
  const [zones, setZones] = useState<ZoneWithTables[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getZones()
      .then((data) => setZones(Array.isArray(data) ? data : []))
      .catch(() => setError('Error al cargar zonas y mesas.'))
      .finally(() => setLoading(false));
  }, []);

  const totalTables = zones.reduce((s, z) => s + z.tables.length, 0);
  const activeTables = zones.reduce((s, z) => s + z.tables.filter((t) => t.isActive).length, 0);

  return (
    <div>
      <div className="page-header">
        <h1>Mesas</h1>
        <p>Distribución por zonas y capacidades del restaurante</p>
      </div>

      {loading && <div className="state-loading"><span className="spinner">⏳</span> Cargando mesas...</div>}
      {error && <div className="state-error"><span>⚠️</span>{error}</div>}

      {!loading && !error && (
        <>
          {/* Summary widgets */}
          <div className="widgets-grid" style={{ marginBottom: '1.75rem' }}>
            <div className="widget-card accent-primary">
              <div className="widget-card__icon">🏢</div>
              <div className="widget-card__label">Zonas</div>
              <div className="widget-card__value">{zones.filter(z => z.isActive).length}</div>
              <div className="widget-card__sub">zonas activas</div>
            </div>
            <div className="widget-card accent-decor">
              <div className="widget-card__icon">🍽️</div>
              <div className="widget-card__label">Mesas totales</div>
              <div className="widget-card__value">{totalTables}</div>
              <div className="widget-card__sub">{activeTables} activas</div>
            </div>
          </div>

          {/* Zone cards */}
          {zones.length === 0 ? (
            <div className="state-empty">
              <span style={{ fontSize: '2rem' }}>🏠</span>
              No hay zonas configuradas. Añade zonas y mesas desde la base de datos.
            </div>
          ) : (
            <div className="zones-grid">
              {zones.map((zone) => (
                <div key={zone.id} className="zone-card">
                  <div className="zone-card__header">
                    <span className="zone-card__name">
                      🏢 {zone.name}
                      {!zone.isActive && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', opacity: 0.6 }}>(Inactiva)</span>}
                    </span>
                    <span className="zone-card__count">{zone.tables.length} mesas</span>
                  </div>
                  {zone.description && (
                    <div style={{ padding: '0.6rem 1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                      {zone.description}
                    </div>
                  )}
                  <ul className="zone-card__tables">
                    {zone.tables.length === 0 ? (
                      <li className="zone-table-row" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Sin mesas configuradas
                      </li>
                    ) : (
                      zone.tables.map((table) => (
                        <li key={table.id} className="zone-table-row">
                          <div>
                            <span className="zone-table-row__name">{table.name}</span>
                            {!table.isActive && (
                              <span style={{ marginLeft: '0.4rem', fontSize: '0.72rem', color: 'var(--accent-action)' }}>Inactiva</span>
                            )}
                          </div>
                          <span className="zone-table-row__cap">
                            👤 {table.minCapacity}–{table.maxCapacity} personas
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
