import React from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import AnalyticsPage from './pages/AnalyticsPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';

function AppShell() {
  const { page = 'dashboard' } = useParams();
  const navigate = useNavigate();
  const activePage = ['dashboard', 'devices', 'analytics', 'settings'].includes(page) ? page : 'dashboard';

  const pages = {
    dashboard: <DashboardPage />,
    devices: <DevicesPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  };

  return (
    <Layout activePage={activePage} onNavigate={(nextPage) => navigate(`/app/${nextPage}`)}>
      <div className="fade-up" key={activePage}>
        {pages[activePage]}
      </div>
    </Layout>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <LoginPage />} />
      <Route path="/app" element={isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/app/:page" element={isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
