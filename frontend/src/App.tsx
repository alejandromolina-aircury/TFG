// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ReservationPage from './pages/ReservationPage';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ReservasPage from './pages/admin/ReservasPage';
import MesasPage from './pages/admin/MesasPage';
import ConfiguracionPage from './pages/admin/ConfiguracionPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/reservar" replace />} />
        <Route path="/reservar" element={<ReservationPage />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected admin area */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="reservas" element={<ReservasPage />} />
          <Route path="mesas" element={<MesasPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
