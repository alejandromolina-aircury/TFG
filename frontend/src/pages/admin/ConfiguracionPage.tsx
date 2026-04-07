// frontend/src/pages/admin/ConfiguracionPage.tsx

import { useState, useEffect } from 'react';
import './AdminPages.css';
import { getShifts, updateShift, getSystemConfig, updateSystemConfig } from '../../services/api';

export default function ConfiguracionPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [systemConfig, setSystemConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  const [editingShift, setEditingShift] = useState<any | null>(null);
  const [editingConfig, setEditingConfig] = useState<boolean>(false);
  const [configForm, setConfigForm] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [shiftsData, configData] = await Promise.all([
        getShifts(),
        getSystemConfig()
      ]);
      setShifts(shiftsData);
      setSystemConfig(configData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditShiftClick = (shift: any) => {
    setEditingShift({ ...shift });
  };

  const handleSaveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;
    try {
      await updateShift(editingShift.id, {
        startTime: editingShift.startTime,
        endTime: editingShift.endTime,
        slotInterval: parseInt(editingShift.slotInterval),
        isActive: editingShift.isActive,
      });
      setEditingShift(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el turno');
    }
  };

  const handleEditConfigClick = () => {
    setConfigForm({
      restaurant_name: systemConfig.restaurant_name || 'Mesón Marinero',
      restaurant_address: systemConfig.restaurant_address || 'Calle del Puerto, 12 — Alicante',
      restaurant_phone: systemConfig.restaurant_phone || '965 00 00 00',
      restaurant_email: systemConfig.restaurant_email || 'info@mesonmarinero.es',
    });
    setEditingConfig(true);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSystemConfig(configForm);
      setEditingConfig(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error al actualizar la configuración');
    }
  };

  const STATIC_SECTIONS = [
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

  return (
    <div>
      <div className="page-header">
        <h1>Configuración</h1>
        <p>Datos generales del restaurante y parámetros del sistema</p>
      </div>

      <div className="config-grid">
        
        {/* Restaurante Config */}
        <div className="config-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, border: 'none', padding: 0 }}>🍽️ Información del Restaurante</h3>
            </div>
            
            {loading ? (
                <div className="state-loading"><span className="spinner">⌛</span></div>
            ) : (
                <>
                    <div className="config-row">
                        <span className="config-row__label">Nombre</span>
                        <span className="config-row__value">{systemConfig.restaurant_name || 'Mesón Marinero'}</span>
                    </div>
                    <div className="config-row">
                        <span className="config-row__label">Dirección</span>
                        <span className="config-row__value">{systemConfig.restaurant_address || 'Calle del Puerto, 12 — Alicante'}</span>
                    </div>
                    <div className="config-row">
                        <span className="config-row__label">Teléfono</span>
                        <span className="config-row__value">{systemConfig.restaurant_phone || '965 00 00 00'}</span>
                    </div>
                    <div className="config-row">
                        <span className="config-row__label">Email de contacto</span>
                        <span className="config-row__value">{systemConfig.restaurant_email || 'info@mesonmarinero.es'}</span>
                    </div>
                    
                    <button 
                        onClick={handleEditConfigClick} 
                        style={{ marginTop: '1rem', width: '100%', cursor: 'pointer', padding: '0.6rem 0.75rem', background: 'var(--bg-light)', color: 'var(--primary)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                        ✏️ Editar Información
                    </button>
                </>
            )}
        </div>


        {/* Turnos */}
        <div className="config-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, border: 'none', padding: 0 }}>📅 Horario de apertura (Turnos)</h3>
            </div>
            
            {loading ? (
                <div className="state-loading"><span className="spinner">⌛</span></div>
            ) : shifts.length === 0 ? (
                <div className="state-empty">No hay turnos configurados.</div>
            ) : (
                shifts.map((shift) => (
                    <div className="config-row" key={shift.id} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <div className="config-row__label">{shift.name} {shift.isActive ? '' : '(Inactivo)'}</div>
                            <div className="config-row__value" style={{ marginTop: '0.25rem' }}>{shift.startTime} – {shift.endTime} (Intervalo: {shift.slotInterval} min)</div>
                        </div>
                        <button 
                          onClick={() => handleEditShiftClick(shift)} 
                          style={{ cursor: 'pointer', padding: '0.4rem 0.75rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            Editar
                        </button>
                    </div>
                ))
            )}
        </div>

        {/* Static Sections */}
        {STATIC_SECTIONS.map((section) => (
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

      {/* Modal Shift */}
      {editingShift && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2>Editar {editingShift.name}</h2>
              <button className="admin-modal__close" type="button" onClick={() => setEditingShift(null)}>×</button>
            </div>
            <div className="admin-modal__body">
              <form id="shift-form" onSubmit={handleSaveShift} className="admin-modal__form-group" style={{ gap: '1.25rem' }}>
                <div className="admin-modal__form-group">
                  <label>Hora Inicio (HH:MM)</label>
                  <input
                    type="time"
                    required
                    value={editingShift.startTime}
                    onChange={(e) => setEditingShift({...editingShift, startTime: e.target.value})}
                  />
                </div>
                <div className="admin-modal__form-group">
                  <label>Hora Fin (HH:MM)</label>
                  <input
                    type="time"
                    required
                    value={editingShift.endTime}
                    onChange={(e) => setEditingShift({...editingShift, endTime: e.target.value})}
                  />
                </div>
                <div className="admin-modal__form-group">
                  <label>Intervalo de reservas (minutos)</label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={editingShift.slotInterval}
                    onChange={(e) => setEditingShift({...editingShift, slotInterval: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={editingShift.isActive}
                    onChange={(e) => setEditingShift({...editingShift, isActive: e.target.checked})}
                    id="isActiveCheck"
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="isActiveCheck" style={{ margin: 0, cursor: 'pointer' }}>Turno activo (Permitir reservas)</label>
                </div>
              </form>
            </div>
            <div className="admin-modal__footer">
              <button
                type="button"
                onClick={() => setEditingShift(null)}
                style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="shift-form"
                style={{ padding: '0.5rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Config */}
      {editingConfig && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2>Editar Información</h2>
              <button className="admin-modal__close" type="button" onClick={() => setEditingConfig(false)}>×</button>
            </div>
            <div className="admin-modal__body">
              <form id="config-form" onSubmit={handleSaveConfig} className="admin-modal__form-group" style={{ gap: '1.25rem' }}>
                <div className="admin-modal__form-group">
                  <label>Nombre del Restaurante</label>
                  <input
                    type="text"
                    required
                    value={configForm.restaurant_name}
                    onChange={(e) => setConfigForm({...configForm, restaurant_name: e.target.value})}
                  />
                </div>
                <div className="admin-modal__form-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    required
                    value={configForm.restaurant_address}
                    onChange={(e) => setConfigForm({...configForm, restaurant_address: e.target.value})}
                  />
                </div>
                <div className="admin-modal__form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    required
                    value={configForm.restaurant_phone}
                    onChange={(e) => setConfigForm({...configForm, restaurant_phone: e.target.value})}
                  />
                </div>
                <div className="admin-modal__form-group">
                  <label>Email de contacto</label>
                  <input
                    type="email"
                    required
                    value={configForm.restaurant_email}
                    onChange={(e) => setConfigForm({...configForm, restaurant_email: e.target.value})}
                  />
                </div>
              </form>
            </div>
            <div className="admin-modal__footer">
              <button
                type="button"
                onClick={() => setEditingConfig(false)}
                style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="config-form"
                style={{ padding: '0.5rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
