import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';

function AppRoutes() {
  const { isAuthenticated } = useApp();
  const [activePage, setActivePage] = useState('dashboard');

  if (!isAuthenticated) return <LoginPage />;

  const pages = {
    dashboard: <DashboardPage />,
    devices: <DevicesPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <div className="fade-up" key={activePage}>
        {pages[activePage]}
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
