import React, { useState } from 'react';
import { BarChart2, Bell, Cpu, LayoutDashboard, LogOut, Menu, Settings, X, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ToastContainer from './ToastContainer';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'devices', label: 'Devices', icon: Cpu },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Layout({ activePage, onNavigate, children }) {
  const { alerts, batteryPct, chargingStatus, logout, powerSource, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const statusColor = {
    grid: '#22c55e',
    inverter: '#3b82f6',
    generator: '#f59e0b',
  }[powerSource];

  const sourceLabel = {
    grid: 'Grid',
    inverter: 'Inverter',
    generator: 'Generator',
  }[powerSource];

  const renderNavButton = ({ id, label, icon: Icon }) => (
    <button
      key={id}
      onClick={() => {
        onNavigate(id);
        setMobileMenuOpen(false);
      }}
      className={`nav-link ${activePage === id ? 'active' : ''}`}
      style={{ width: '100%', border: activePage === id ? undefined : 'none', marginBottom: '4px', textAlign: 'left', background: 'none' }}
    >
      <Icon size={17} />
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--page-bg)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
      <aside
        className="hidden-mobile"
        style={{
          width: '240px',
          flexShrink: 0,
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg,#1280f5,#0b68e1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(18,128,245,0.35)',
              }}
            >
              <Zap size={18} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>VoltWatch</div>
              <div style={{ fontSize: '10px', color: 'var(--text-soft)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.05em' }}>ENERGY MONITOR</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="soft-panel" style={{ padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono',monospace", color: 'var(--label-color)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Power Source</span>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} className="flow-active" />
            </div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '14px', fontWeight: 600, color: statusColor }}>{sourceLabel}</div>
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Battery</span>
                <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono',monospace", color: batteryPct < 20 ? '#ef4444' : batteryPct < 50 ? '#f59e0b' : '#22c55e' }}>
                  {Math.round(batteryPct)}%
                </span>
              </div>
              <div style={{ height: '4px', background: 'var(--surface-muted)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${batteryPct}%`,
                    background: batteryPct < 20 ? '#ef4444' : batteryPct < 50 ? '#f59e0b' : 'linear-gradient(90deg,#1280f5,#22c55e)',
                    borderRadius: '2px',
                    transition: 'width 1s',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>{navItems.map(renderNavButton)}</nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                flexShrink: 0,
                background: 'linear-gradient(135deg,#1280f5,#0b68e1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                color: 'white',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'rgba(248,113,113,0.92)',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--header-bg)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px', display: 'none' }}
              className="show-mobile"
            >
              <Menu size={22} />
            </button>
            <div className="show-mobile" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'none' }}>
              VoltWatch
            </div>
            <div className="hidden-mobile">
              <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {navItems.find((item) => item.id === activePage)?.label}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {alerts.length > 0 && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#f87171',
                }}
              >
                <Bell size={13} />
                {alerts.length}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono',monospace",
                color:
                  chargingStatus === 'charging'
                    ? '#22c55e'
                    : chargingStatus === 'discharging'
                      ? '#f59e0b'
                      : 'var(--text-muted)',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background:
                    chargingStatus === 'charging'
                      ? '#22c55e'
                      : chargingStatus === 'discharging'
                        ? '#f59e0b'
                        : 'var(--text-soft)',
                  ...(chargingStatus !== 'idle' ? { animation: 'batteryPulse 1.5s ease-in-out infinite' } : {}),
                }}
              />
              {chargingStatus.charAt(0).toUpperCase() + chargingStatus.slice(1)}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '28px 24px', overflow: 'auto' }}>{children}</main>
      </div>

      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileMenuOpen(false)} />
          <div
            style={{
              position: 'relative',
              width: '260px',
              background: 'var(--sidebar-bg)',
              borderRight: '1px solid var(--border-strong)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>VoltWatch</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            {navItems.map(renderNavButton)}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#f87171',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
