// frontend/src/pages/admin/AdminLayout.tsx

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const navLinks = [
  { to: '/admin', label: 'Panel', icon: '📊', end: true },
  { to: '/admin/reservas', label: 'Reservas', icon: '📅', end: false },
  { to: '/admin/mesas', label: 'Mesas', icon: '🍽️', end: false },
  { to: '/admin/clientes', label: 'Clientes', icon: '👥', end: false },
  { to: '/admin/carta', label: 'Carta / Menú', icon: '📜', end: false },
  { to: '/admin/configuracion', label: 'Configuración', icon: '⚙️', end: false },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="admin-shell">
      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand__name">⚓ Mesón Marinero</div>
          <div className="sidebar-brand__tag">Panel de Gestión</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav__section-label">Menú</div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `sidebar-nav__link${isActive ? ' active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-nav__icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer__user">🔐 Administrador</div>
          <button className="sidebar-footer__logout" onClick={handleLogout}>
            ↩ Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-topbar__hamburger"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <span className="admin-topbar__title">Mesón Marinero</span>
          <span className="admin-topbar__date" style={{ textTransform: 'capitalize' }}>
            📅 {today}
          </span>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
