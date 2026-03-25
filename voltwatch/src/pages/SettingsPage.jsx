import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Battery, Zap, Moon, Sun, Shield, Info } from 'lucide-react';

function SettingRow({ icon: Icon, iconColor, title, description, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 0', borderBottom: '1px solid rgba(18,128,245,0.08)',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
          background: iconColor || 'rgba(18,128,245,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color="white" opacity={0.8} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>{title}</div>
          {description && <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)', lineHeight: 1.4 }}>{description}</div>}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      className={`toggle ${value ? 'on' : ''}`}
      onClick={() => onChange(!value)}
      style={{ cursor: 'pointer' }}
    />
  );
}

function SliderInput({ value, onChange, min, max, step, unit, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          WebkitAppearance: 'none', width: '120px', height: '4px',
          borderRadius: '2px', outline: 'none', cursor: 'pointer',
          background: `linear-gradient(to right, ${color || '#1280f5'} 0%, ${color || '#1280f5'} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
      <span style={{
        fontFamily: "'JetBrains Mono',monospace", fontSize: '13px',
        color: color || '#55beff', minWidth: '52px', textAlign: 'right',
      }}>
        {value}{unit}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, user } = useApp();

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Profile card */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#1280f5,#0b68e1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', fontWeight: 700, color: 'white', flexShrink: 0,
        }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '16px', fontWeight: 700, color: 'white' }}>{user?.name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)', marginTop: '2px' }}>{user?.role} · {user?.username}</div>
        </div>
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#4ade80',
          fontFamily: "'JetBrains Mono',monospace",
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
          ONLINE
        </div>
      </div>

      {/* Appearance */}
      <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div className="label" style={{ marginBottom: '4px' }}>Appearance</div>
        <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.4)', marginBottom: '4px' }}>Display preferences</div>
        <SettingRow
          icon={settings.darkMode ? Moon : Sun}
          iconColor="rgba(99,102,241,0.2)"
          title="Dark Mode"
          description="Toggle between dark and light interface theme"
        >
          <Toggle value={settings.darkMode} onChange={v => updateSettings('darkMode', v)} />
        </SettingRow>
      </div>

      {/* Battery settings */}
      <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div className="label" style={{ marginBottom: '4px' }}>Battery & Power</div>
        <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.4)', marginBottom: '4px' }}>Thresholds and limits</div>

        <SettingRow
          icon={Battery}
          iconColor="rgba(245,158,11,0.2)"
          title="Low Battery Warning"
          description={`Alert when battery drops below threshold`}
        >
          <SliderInput
            value={settings.lowBatteryThreshold}
            onChange={v => updateSettings('lowBatteryThreshold', v)}
            min={5} max={50} step={5} unit="%" color="#f59e0b"
          />
        </SettingRow>

        <SettingRow
          icon={Zap}
          iconColor="rgba(239,68,68,0.2)"
          title="Overload Warning"
          description="Alert when total load exceeds limit"
        >
          <SliderInput
            value={settings.overloadThreshold}
            onChange={v => updateSettings('overloadThreshold', v)}
            min={500} max={3000} step={100} unit="W" color="#ef4444"
          />
        </SettingRow>
      </div>

      {/* Alerts */}
      <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div className="label" style={{ marginBottom: '4px' }}>Notifications</div>
        <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.4)', marginBottom: '4px' }}>Alert preferences</div>

        <SettingRow
          icon={Bell}
          iconColor="rgba(18,128,245,0.2)"
          title="All Alerts"
          description="Master toggle for all system notifications"
        >
          <Toggle value={settings.alertsEnabled} onChange={v => updateSettings('alertsEnabled', v)} />
        </SettingRow>

        <SettingRow
          icon={Battery}
          iconColor="rgba(245,158,11,0.15)"
          title="Low Battery Alerts"
          description="Notify when battery level is critical"
        >
          <Toggle
            value={settings.notifications?.lowBattery}
            onChange={v => updateSettings('notifications', { ...settings.notifications, lowBattery: v })}
          />
        </SettingRow>

        <SettingRow
          icon={Zap}
          iconColor="rgba(239,68,68,0.15)"
          title="Overload Alerts"
          description="Notify when system load is too high"
        >
          <Toggle
            value={settings.notifications?.overload}
            onChange={v => updateSettings('notifications', { ...settings.notifications, overload: v })}
          />
        </SettingRow>

        <SettingRow
          icon={Shield}
          iconColor="rgba(34,197,94,0.15)"
          title="Source Change Alerts"
          description="Notify on power source switches"
        >
          <Toggle
            value={settings.notifications?.sourceChange}
            onChange={v => updateSettings('notifications', { ...settings.notifications, sourceChange: v })}
          />
        </SettingRow>
      </div>

      {/* System info */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="label" style={{ marginBottom: '16px' }}>System Information</div>
        {[
          { label: 'Application', value: 'VoltWatch v1.0.0' },
          { label: 'Battery Capacity', value: '5 kWh (LiFePO4)' },
          { label: 'Inverter Rating', value: '3000W / 24V' },
          { label: 'Developer', value: 'Goodness Emmanuel' },
          { label: 'Build', value: 'Production · React + Vite' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0',
            borderBottom: i < 4 ? '1px solid rgba(18,128,245,0.06)' : 'none',
          }}>
            <span style={{ fontSize: '13px', color: 'rgba(148,163,184,0.5)' }}>{item.label}</span>
            <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono',monospace", color: 'rgba(203,213,225,0.7)' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
