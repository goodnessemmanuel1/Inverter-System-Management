import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Activity } from 'lucide-react';

export default function DevicesPage() {
  const { devices, toggleDevice, totalLoad, settings } = useApp();
  const isOverload = totalLoad > settings.overloadThreshold;

  const rooms = [...new Set(devices.map(d => d.room))];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Active Devices', value: devices.filter(d => d.isOn).length, total: devices.length, unit: `of ${devices.length}`, color: '#3b82f6' },
          { label: 'Total Load', value: totalLoad, unit: 'W', color: isOverload ? '#ef4444' : '#22c55e' },
          { label: 'Load Limit', value: settings.overloadThreshold, unit: 'W', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px' }}>
            <div className="label" style={{ marginBottom: '8px' }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: 'rgba(148,163,184,0.5)' }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="label">Power Consumption</span>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: '13px',
            color: isOverload ? '#f87171' : '#4ade80',
          }}>
            {totalLoad}W / {settings.overloadThreshold}W
          </span>
        </div>
        <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, (totalLoad / settings.overloadThreshold) * 100)}%`,
            background: isOverload
              ? 'linear-gradient(90deg,#dc2626,#ef4444)'
              : totalLoad / settings.overloadThreshold > 0.7
              ? 'linear-gradient(90deg,#d97706,#f59e0b)'
              : 'linear-gradient(90deg,#1280f5,#22c55e)',
            borderRadius: '5px',
            transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: isOverload ? '0 0 12px rgba(239,68,68,0.4)' : '0 0 12px rgba(18,128,245,0.3)',
          }} />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(148,163,184,0.4)' }}>
          {Math.round((totalLoad / settings.overloadThreshold) * 100)}% of capacity used
        </div>
      </div>

      {/* Devices by room */}
      {rooms.map(room => (
        <div key={room} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(18,128,245,0.1)' }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'rgba(87,175,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 10px' }}>
              {room}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(18,128,245,0.1)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
            {devices.filter(d => d.room === room).map(device => (
              <DeviceCard key={device.id} device={device} onToggle={toggleDevice} totalLoad={totalLoad} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DeviceCard({ device, onToggle, totalLoad }) {
  const pctOfTotal = totalLoad > 0 ? Math.round((device.watts / totalLoad) * 100) : 0;

  return (
    <div
      className={`device-card ${device.isOn ? 'active' : ''}`}
      onClick={() => onToggle(device.id)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>{device.icon}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>{device.name}</div>
            <div className="label" style={{ marginBottom: 0 }}>{device.room}</div>
          </div>
        </div>

        {/* Toggle */}
        <div
          className={`toggle ${device.isOn ? 'on' : ''}`}
          onClick={e => { e.stopPropagation(); onToggle(device.id); }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{
            fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: '20px',
            color: device.isOn ? '#3b82f6' : 'rgba(148,163,184,0.3)',
            transition: 'color 0.3s',
          }}>
            {device.watts}
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', fontWeight: 400, marginLeft: '3px', color: device.isOn ? 'rgba(87,175,255,0.6)' : 'rgba(148,163,184,0.3)' }}>W</span>
          </div>
          {device.isOn && totalLoad > 0 && (
            <div style={{ fontSize: '11px', color: 'rgba(148,163,184,0.4)', marginTop: '2px' }}>
              {pctOfTotal}% of load
            </div>
          )}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '11px', fontFamily: "'JetBrains Mono',monospace",
          color: device.isOn ? '#22c55e' : 'rgba(148,163,184,0.3)',
          transition: 'color 0.3s',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: device.isOn ? '#22c55e' : 'rgba(148,163,184,0.2)',
            boxShadow: device.isOn ? '0 0 8px rgba(34,197,94,0.7)' : 'none',
            transition: 'all 0.3s',
          }} />
          {device.isOn ? 'ON' : 'OFF'}
        </div>
      </div>

      {device.isOn && (
        <div style={{ marginTop: '12px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pctOfTotal}%`,
            background: 'linear-gradient(90deg,#1280f5,#55beff)',
            borderRadius: '2px',
            transition: 'width 0.8s',
          }} />
        </div>
      )}
    </div>
  );
}
