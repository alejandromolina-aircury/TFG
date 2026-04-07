import React, { useEffect, useState } from 'react';
import { 
  getAdminMenu, 
  createMenuCategory, 
  updateMenuCategory, 
  deleteMenuCategory, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  reorderMenuCategories
} from '../../services/api';
import './AdminPages.css';

// DnD Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: string;
  isActive: boolean;
  displayOrder: number;
}

interface MenuCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  items: MenuItem[];
}
// Sub-component for Sortable Category Card
function SortableCategoryCard({ 
  category, 
  onEditCategory, 
  onEditItem, 
  onAddItem 
}: { 
  category: MenuCategory; 
  onEditCategory: (c: MenuCategory) => void;
  onEditItem: (item: MenuItem, catId: number) => void;
  onAddItem: (catId: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.3 : 1,
    border: isDragging ? '2px dashed var(--primary)' : undefined,
    pointerEvents: isDragging ? 'none' as 'none' : 'auto' as 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="zone-card">
      <div 
        className="zone-card__header" 
        {...attributes} 
        {...listeners} 
        style={{ cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span className="zone-card__name">
          <span style={{ marginRight: '0.75rem', opacity: 0.5 }}>⠿</span>
          📂 {category.name}
          {!category.isActive && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', opacity: 0.6, fontStyle: 'italic' }}>(Inactiva)</span>}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evitar disparar el drag
            onEditCategory(category);
          }}
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}
        >
          Editar
        </button>
      </div>
      <ul className="zone-card__tables">
        {category.items.length === 0 ? (
          <li className="zone-table-row" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Sin platos configurados
          </li>
        ) : (
          category.items.map((item) => (
            <li key={item.id} className="zone-table-row" style={{ opacity: item.isActive ? 1 : 0.6 }}>
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <span className="zone-table-row__name">{item.name}</span>
                {!item.isActive && (
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.72rem', color: 'var(--accent-action)' }}>Inactivo</span>
                )}
                {item.description && <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.7, color: 'var(--text-muted)' }}>{item.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
                <span className="zone-table-row__cap" style={{ fontWeight: 'bold', color: 'var(--accent-action)', minWidth: '60px', textAlign: 'right' }}>
                  {item.price}
                </span>
                <button
                  onClick={() => onEditItem(item, category.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                >
                  Editar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <div style={{ padding: '0.7rem', borderTop: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg-light)' }}>
        <button
          onClick={() => onAddItem(category.id)}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Añadir Plato
        </button>
      </div>
    </div>
  );
}

export default function CartaPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags when clicking buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const loadMenu = () => {
    setLoading(true);
    getAdminMenu()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setError('Error al cargar la carta.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
    setOverId(event.active.id as number);
  };

  const handleDragOver = (event: any) => {
    if (event.over) {
      setOverId(event.over.id);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      setCategories(newOrder);

      try {
        await reorderMenuCategories(newOrder.map(c => c.id));
      } catch (err) {
        alert('Error al guardar el nuevo orden');
        loadMenu(); // Rollback
      }
    }
  };

  const currentOverIndex = overId ? categories.findIndex(c => c.id === overId) : -1;

  const totalItems = categories.reduce((s, c) => s + c.items.length, 0);
  const activeItems = categories.reduce((s, c) => s + c.items.filter((i) => i.isActive).length, 0);

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      isActive: formData.get('isActive') === 'on',
      displayOrder: Number(formData.get('displayOrder')) || 0,
    };

    try {
      if (editingCategory) {
        await updateMenuCategory(editingCategory.id, payload);
      } else {
        await createMenuCategory(payload);
      }
      setIsCategoryModalOpen(false);
      loadMenu();
    } catch (err) {
      alert('Error al guardar categoría');
    }
  };

  const handleDeleteCategory = async () => {
    if (!editingCategory) return;
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${editingCategory.name}"? Se borrarán todos sus platos.`)) return;
    
    try {
      await deleteMenuCategory(editingCategory.id);
      setIsCategoryModalOpen(false);
      loadMenu();
    } catch (err) {
      alert('Error al eliminar categoría.');
    }
  };

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      isActive: formData.get('isActive') === 'on',
      displayOrder: Number(formData.get('displayOrder')) || 0,
      categoryId: activeCategoryId
    };

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
      } else {
        await createMenuItem(payload);
      }
      setIsItemModalOpen(false);
      loadMenu();
    } catch (err) {
      alert('Error al guardar plato');
    }
  };

  const handleDeleteItem = async () => {
    if (!editingItem) return;
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el plato "${editingItem.name}"?`)) return;
    
    try {
      await deleteMenuItem(editingItem.id);
      setIsItemModalOpen(false);
      loadMenu();
    } catch (err) {
      alert('Error al eliminar plato');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Gestión de Carta</h1>
          <p>Administra las categorías y platos de tu menú</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsCategoryModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Nueva Categoría
        </button>
      </div>

      {loading && <div className="state-loading"><span className="spinner">⏳</span> Cargando carta...</div>}
      {error && <div className="state-error"><span>⚠️</span>{error}</div>}

      {!loading && !error && (
        <>
          <div className="widgets-grid" style={{ marginBottom: '1.75rem' }}>
            <div className="widget-card accent-primary">
              <div className="widget-card__icon">📂</div>
              <div className="widget-card__label">Categorías</div>
              <div className="widget-card__value">{categories.length}</div>
              <div className="widget-card__sub">{categories.filter(c => c.isActive).length} activas</div>
            </div>
            <div className="widget-card accent-decor">
              <div className="widget-card__icon">🍽️</div>
              <div className="widget-card__label">Platos totales</div>
              <div className="widget-card__value">{totalItems}</div>
              <div className="widget-card__sub">{activeItems} activos</div>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="state-empty">
              <span style={{ fontSize: '2rem' }}>📜</span>
              No hay categorías en la carta. Añade categorías y platos para empezar.
            </div>
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={categories.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="zones-grid">
                  {categories.map((category) => (
                    <SortableCategoryCard 
                      key={category.id}
                      category={category}
                      onEditCategory={setEditingCategory}
                      onEditItem={(item, catId) => {
                        setEditingItem(item);
                        setActiveCategoryId(catId);
                        setIsItemModalOpen(true);
                      }}
                      onAddItem={(catId) => {
                        setEditingItem(null);
                        setActiveCategoryId(catId);
                        setIsItemModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={null}>
                {activeId ? (
                  <div style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    pointerEvents: 'none',
                    border: '2px solid white',
                    transform: 'scale(1.05)',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ fontSize: '1.4rem' }}>📍</span>
                    Moviendo a posición #{currentOverIndex + 1}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button className="admin-modal__close" onClick={() => setIsCategoryModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSaveCategory}>
              <div className="admin-modal__body">
                <div className="admin-modal__form-group">
                  <label>Nombre</label>
                  <input type="text" name="name" required defaultValue={editingCategory?.name || ''} placeholder="Ej: Entrantes Fríos" />
                </div>
                <div className="admin-modal__form-group">
                  <label>Descripción</label>
                  <textarea name="description" rows={2} defaultValue={editingCategory?.description || ''}></textarea>
                </div>
                <div className="admin-modal__form-group">
                  <label>Orden de visualización</label>
                  <input type="number" name="displayOrder" defaultValue={editingCategory?.displayOrder || 0} />
                </div>
                <div className="admin-modal__form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="isActive" id="catIsActive" defaultChecked={editingCategory ? editingCategory.isActive : true} />
                  <label htmlFor="catIsActive">Categoría Activa</label>
                </div>
              </div>
              <div className="admin-modal__footer">
                {editingCategory && (
                  <button type="button" onClick={handleDeleteCategory} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: 'auto' }}>
                    Borrar
                  </button>
                )}
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2>{editingItem ? 'Editar Plato' : 'Nuevo Plato'}</h2>
              <button className="admin-modal__close" onClick={() => setIsItemModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSaveItem}>
              <div className="admin-modal__body">
                <div className="admin-modal__form-group">
                  <label>Nombre del plato</label>
                  <input type="text" name="name" required defaultValue={editingItem?.name || ''} placeholder="Ej: Croquetas caseras" />
                </div>
                <div className="admin-modal__form-group">
                  <label>Descripción</label>
                  <textarea name="description" rows={2} defaultValue={editingItem?.description || ''} placeholder="Ingredientes, alérgenos..."></textarea>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-modal__form-group">
                    <label>Precio</label>
                    <input type="text" name="price" required defaultValue={editingItem?.price || ''} placeholder="Ej: 12€ o S.M." />
                  </div>
                  <div className="admin-modal__form-group">
                    <label>Orden</label>
                    <input type="number" name="displayOrder" defaultValue={editingItem?.displayOrder || 0} />
                  </div>
                </div>
                <div className="admin-modal__form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                  <input type="checkbox" name="isActive" id="itemIsActive" defaultChecked={editingItem ? editingItem.isActive : true} />
                  <label htmlFor="itemIsActive">Plato Activo</label>
                </div>
              </div>
              <div className="admin-modal__footer">
                {editingItem && (
                  <button type="button" onClick={handleDeleteItem} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: 'auto' }}>
                    Borrar
                  </button>
                )}
                <button type="button" onClick={() => setIsItemModalOpen(false)} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
