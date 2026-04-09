
import { useState, useEffect } from 'react';
import {
  getCustomerById,
  updateCustomer,
  addCustomerNote,
  toggleCustomerVip,
  toggleCustomerBlacklist,
} from '../../services/api';
import type { Customer } from '../../types';

interface CustomerDetailsModalProps {
  customerId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function CustomerDetailsModal({
  customerId,
  onClose,
  onUpdate,
}: CustomerDetailsModalProps) {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getCustomerById(customerId);
        setEditingCustomer(details);
      } catch (err) {
        console.error('Error fetching customer details:', err);
        setError('Error al cargar los detalles del cliente');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [customerId]);

  const handleSaveCustomer = async () => {
    if (!editingCustomer) return;

    setIsSaving(true);
    try {
      const updateData = {
        allergens: editingCustomer.allergens,
        tags: editingCustomer.tags,
        preferences: editingCustomer.preferences,
        birthday: editingCustomer.birthday,
      };

      await updateCustomer(editingCustomer.id, updateData);
      if (onUpdate) onUpdate();
      
      // Close modal after success
      onClose();
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message: string } } })?.response?.data
          ?.message || 'Error saving customer';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!editingCustomer || !newNote.trim()) return;

    setIsAddingNote(true);
    try {
      await addCustomerNote(editingCustomer.id, newNote);
      setNewNote('');
      // Refresh customer details to show new note
      const details = await getCustomerById(editingCustomer.id);
      setEditingCustomer(details);
      if (onUpdate) onUpdate();
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message: string } } })?.response?.data
          ?.message || 'Error adding note';
      setError(errorMessage);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleToggleVip = async () => {
    if (!editingCustomer) return;

    setIsSaving(true);
    try {
      const newVipStatus = !editingCustomer.isVip;
      await toggleCustomerVip(editingCustomer.id, newVipStatus);

      setEditingCustomer({
        ...editingCustomer,
        isVip: newVipStatus,
        tags: newVipStatus
          ? [...(editingCustomer.tags || []), 'VIP'].filter(
              (t, i, a) => a.indexOf(t) === i
            )
          : (editingCustomer.tags || []).filter((t) => t !== 'VIP'),
      });
      if (onUpdate) onUpdate();
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message: string } } })?.response?.data
          ?.message || 'Error toggling VIP status';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleBlacklist = async () => {
    if (!editingCustomer) return;

    const newBlacklistStatus = !editingCustomer.isBlacklisted;
    let reason = '';

    if (newBlacklistStatus) {
      reason = prompt('Ingresa la razón para añadir a la lista negra:') || '';
      if (!reason.trim()) return;
    }

    setIsSaving(true);
    try {
      await toggleCustomerBlacklist(
        editingCustomer.id,
        newBlacklistStatus,
        reason || undefined
      );

      setEditingCustomer({
        ...editingCustomer,
        isBlacklisted: newBlacklistStatus,
        blacklistReason: newBlacklistStatus ? reason : undefined,
        tags: newBlacklistStatus
          ? [...(editingCustomer.tags || []), 'BLACKLIST'].filter(
              (t, i, a) => a.indexOf(t) === i
            )
          : (editingCustomer.tags || []).filter((t) => t !== 'BLACKLIST'),
      });
      if (onUpdate) onUpdate();
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message: string } } })?.response?.data
          ?.message || 'Error toggling blacklist status';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditingField = (
    field: keyof Customer,
    value: string | number | boolean | string[] | null | undefined
  ) => {
    if (editingCustomer) {
      setEditingCustomer({
        ...editingCustomer,
        [field]: value,
      });
    }
  };

  const toggleTag = (tag: string) => {
    if (!editingCustomer) return;

    const newTags = editingCustomer.tags?.includes(tag)
      ? editingCustomer.tags.filter((t) => t !== tag)
      : [...(editingCustomer.tags || []), tag];

    updateEditingField('tags', newTags);
  };

  if (isLoading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body">Cargando detalles del cliente...</div>
        </div>
      </div>
    );
  }

  if (error && !editingCustomer) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Error</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">{error}</div>
        </div>
      </div>
    );
  }

  if (!editingCustomer) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {editingCustomer.firstName} {editingCustomer.lastName}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="customers-error">❌ {error}</div>}

          {/* Datos de Contacto */}
          <div className="modal-section">
            <h3>📋 Datos de Contacto</h3>
            <div className="modal-grid">
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  disabled
                  className="form-input form-input--disabled"
                />
              </div>
              <div>
                <label>Teléfono:</label>
                <input
                  type="tel"
                  value={editingCustomer.phone || ''}
                  disabled
                  className="form-input form-input--disabled"
                />
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="modal-section">
            <h3>📊 Estadísticas</h3>
            <div className="modal-grid">
              <div>
                <label>Visitas Totales:</label>
                <input
                  type="number"
                  value={editingCustomer.totalVisits}
                  disabled
                  className="form-input form-input--disabled"
                />
              </div>
              <div>
                <label>No-shows:</label>
                <input
                  type="number"
                  value={editingCustomer.totalNoShows}
                  disabled
                  className="form-input form-input--disabled"
                />
              </div>
            </div>
          </div>

          {/* Alergias */}
          <div className="modal-section">
            <h3>🚨 Alergias</h3>
            <textarea
              value={editingCustomer.allergens?.join(', ') || ''}
              onChange={(e) => {
                const val = e.target.value;
                const allergensArr = val.split(',').map(a => a.trim()).filter(a => a !== '');
                updateEditingField('allergens', allergensArr);
              }}
              placeholder="Ej: Gluten, Lactosa, Marisco..."
              className="form-textarea"
              rows={2}
            />
            <p className="form-help-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
               Separa las alergias con comas si hay varias.
            </p>
          </div>

          {/* Preferencias */}
          <div className="modal-section">
            <h3>📝 Preferencias y Notas</h3>
            <textarea
              value={editingCustomer.preferences || ''}
              onChange={(e) =>
                updateEditingField('preferences', e.target.value)
              }
              placeholder="Ingresa las preferencias o notas sobre el cliente..."
              className="form-textarea"
              rows={4}
            />
          </div>

          {/* Cumpleaños */}
          <div className="modal-section">
            <h3>🎂 Cumpleaños</h3>
            <input
              type="date"
              value={editingCustomer.birthday?.split('T')[0] || ''}
              onChange={(e) =>
                updateEditingField('birthday', e.target.value || null)
              }
              className="form-input"
            />
          </div>

          {/* VIP & Blacklist Toggle */}
          <div className="modal-section">
            <h3>⚡ Estado del Cliente</h3>
            <div className="status-toggles">
              <button
                className={`status-toggle ${
                  editingCustomer.isVip ? 'status-toggle--active' : ''
                }`}
                onClick={handleToggleVip}
                disabled={isSaving}
              >
                <span className="status-toggle__icon">⭐</span>
                <span className="status-toggle__label">
                  {editingCustomer.isVip ? 'Es VIP' : 'Marcar como VIP'}
                </span>
              </button>

              <button
                className={`status-toggle ${
                  editingCustomer.isBlacklisted
                    ? 'status-toggle--blacklist'
                    : ''
                }`}
                onClick={handleToggleBlacklist}
                disabled={isSaving}
              >
                <span className="status-toggle__icon">🚫</span>
                <span className="status-toggle__label">
                  {editingCustomer.isBlacklisted
                    ? 'En Blacklist'
                    : 'Añadir a Blacklist'}
                </span>
              </button>
            </div>

            {editingCustomer.isBlacklisted && editingCustomer.blacklistReason && (
              <div className="blacklist-reason">
                <strong>Razón:</strong> {editingCustomer.blacklistReason}
              </div>
            )}
          </div>

          {/* Etiquetas */}
          <div className="modal-section">
            <h3>🏷️ Etiquetas Personalizadas</h3>
            <div className="tags-list">
              {['Cumpleaños', 'Evento Especial', 'Referencia'].map(
                (tag) => (
                  <label key={tag} className="tag-checkbox">
                    <input
                      type="checkbox"
                      checked={
                        editingCustomer.tags?.includes(tag) || false
                      }
                    onChange={() => {
                        if (tag === 'VIP' || tag === 'BLACKLIST') {
                          return;
                        }
                        toggleTag(tag);
                      }}
                    />
                    <span>{tag}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Notas del Staff */}
          <div className="modal-section">
            <h3>💬 Notas del Staff</h3>
            <div className="notes-form">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Añade una nueva nota sobre el cliente..."
                className="form-textarea"
                rows={2}
              />
              <button
                className="btn btn--primary btn--small"
                onClick={handleAddNote}
                disabled={isAddingNote || !newNote.trim()}
              >
                {isAddingNote ? 'Añadiendo...' : 'Añadir Nota'}
              </button>
            </div>

            {editingCustomer.notes &&
              editingCustomer.notes.length > 0 && (
                <div className="notes-list">
                  {editingCustomer.notes.map(
                    (note: { id: string; note: string; createdBy: string; createdAt: string }) => (
                    <div key={note.id} className="note-item">
                      <div className="note-header">
                        <strong>{note.createdBy}</strong>
                        <span className="note-date">
                          {new Date(note.createdAt).toLocaleDateString(
                            'es-ES'
                          )}
                        </span>
                      </div>
                      <p className="note-content">{note.note}</p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn--secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSaveCustomer}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
