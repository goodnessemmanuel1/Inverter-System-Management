import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Cpu, Grid, Triangle, Zap } from 'lucide-react';
import BatteryGauge from '../components/BatteryGauge';
import DeviceIcon from '../components/DeviceIcon';
import { useApp } from '../context/AppContext';

function StatCard({ label, value, unit, sub, color, icon: Icon, iconBg, glow }) {
  return (
    <div
      className="card"
      style={{
        padding: '22px',
        flex: 1,
        boxShadow: glow ? `0 4px 24px rgba(0,0,0,0.12), 0 0 30px ${glow}` : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span className="label">{label}</span>
        {Icon && (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: iconBg || 'var(--surface-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={15} color={color || 'var(--accent)'} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span className="value" style={{ fontSize: '32px', lineHeight: 1, color: color || 'var(--text-primary)' }}>{value}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', color: 'var(--text-muted)' }}>{unit}</span>
      </div>
      {sub && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>{sub}</p>}
    </div>
  );
}

function PowerSourceCard({ label, icon: Icon, active, color, available, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        padding: '18px',
        cursor: onClick ? 'pointer' : 'default',
        border: active ? `1px solid ${color}50` : '1px solid var(--border-subtle)',
        transition: 'all 0.3s',
        boxShadow: active ? `0 0 30px ${color}20` : undefined,
        opacity: !available && !active ? 0.45 : 1,
        textAlign: 'left',
      }}
      disabled={!onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: active ? `${color}20` : 'var(--surface-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: active ? `1px solid ${color}30` : 'none',
          }}
        >
          <Icon size={17} color={active ? color : 'var(--text-muted)'} />
        </div>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: active ? color : 'var(--surface-muted)',
            boxShadow: active ? `0 0 8px ${color}` : 'none',
          }}
          className={active ? 'flow-active' : ''}
        />
      </div>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '13px', fontWeight: 600, color: active ? color : 'var(--text-secondary)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono',monospace", color: 'var(--text-soft)' }}>
        {active ? 'ACTIVE' : available ? 'STANDBY' : 'OFFLINE'}
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const {
    batteryPct,
    totalLoad,
    chargingStatus,
    backupTimeMinutes,
    formatBackupTime,
    powerSource,
    gridAvailable,
    generatorAvailable,
    toggleGrid,
    toggleGenerator,
    devices,
    settings,
  } = useApp();

  const activeDevices = devices.filter((device) => device.isOn);
  const isOverload = totalLoad > settings.overloadThreshold;
  const isLowBattery = batteryPct < settings.lowBatteryThreshold;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {(isLowBattery || isOverload) && (
        <div
          className="fade-up"
          style={{
            background: isOverload ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${isOverload ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertTriangle size={16} color={isOverload ? '#ef4444' : '#f59e0b'} />
          <span style={{ fontSize: '13px', color: isOverload ? '#f87171' : '#f59e0b' }}>
            {isOverload
              ? `System overload: ${totalLoad}W active - exceeds ${settings.overloadThreshold}W limit`
              : `Battery low: ${Math.round(batteryPct)}% - connect to grid or start generator`}
          </span>
        </div>
      )}

      <div className="responsive-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard
          label="Total Load"
          value={totalLoad}
          unit="W"
          sub={`${activeDevices.length} device${activeDevices.length !== 1 ? 's' : ''} active`}
          icon={Activity}
          iconBg={isOverload ? 'rgba(239,68,68,0.18)' : 'rgba(18,128,245,0.12)'}
          color={isOverload ? '#f87171' : 'var(--text-primary)'}
          glow={isOverload ? 'rgba(239,68,68,0.08)' : undefined}
        />
        <StatCard
          label="Backup Time"
          value={formatBackupTime(backupTimeMinutes)}
          unit=""
          sub={powerSource === 'grid' ? 'Grid connected' : 'On battery power'}
          icon={Clock}
          iconBg="rgba(245,158,11,0.14)"
          color={backupTimeMinutes < 30 ? '#f87171' : backupTimeMinutes < 120 ? '#f59e0b' : '#22c55e'}
        />
        <StatCard
          label="Power Source"
          value={{ grid: 'Grid', inverter: 'Batt.', generator: 'Gen.' }[powerSource]}
          unit=""
          sub={{ grid: 'NEPA connected', inverter: 'Battery power', generator: 'Generator on' }[powerSource]}
          icon={Zap}
          iconBg="rgba(59,130,246,0.15)"
          color={{ grid: '#4ade80', inverter: '#3b82f6', generator: '#f59e0b' }[powerSource]}
        />
        <StatCard label="System Capacity" value="5" unit="kWh" sub="LiFePO4 battery bank" icon={Cpu} iconBg="rgba(34,197,94,0.14)" />
      </div>

      <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.8fr)', gap: '20px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="label" style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>Battery Status</div>
          <BatteryGauge size={190} />
          <div style={{ marginTop: '20px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>0%</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>100%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${batteryPct}%`,
                  background:
                    batteryPct < 20
                      ? 'linear-gradient(90deg,#b91c1c,#ef4444)'
                      : batteryPct < 50
                        ? 'linear-gradient(90deg,#b45309,#f59e0b)'
                        : 'linear-gradient(90deg,#1280f5,#22c55e)',
                  borderRadius: '3px',
                  transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '8px', flexWrap: 'wrap' }}>
            <span className="label">Power Sources</span>
            <span style={{ fontSize: '11px', color: 'var(--text-soft)', fontFamily: "'JetBrains Mono',monospace" }}>CLICK TO TOGGLE</span>
          </div>

          <div className="source-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <PowerSourceCard label="Grid (NEPA)" icon={Grid} active={powerSource === 'grid'} color="#22c55e" available={gridAvailable} onClick={toggleGrid} />
            <PowerSourceCard label="Inverter" icon={Zap} active={powerSource === 'inverter'} color="#3b82f6" available={batteryPct > 0} onClick={null} />
            <PowerSourceCard label="Generator" icon={Triangle} active={powerSource === 'generator'} color="#f59e0b" available={generatorAvailable} onClick={toggleGenerator} />
          </div>

          <div className="soft-panel" style={{ padding: '14px' }}>
            <div className="label" style={{ marginBottom: '10px' }}>Auto-Switch Logic</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[
                { text: 'Grid online -> charging battery', ok: gridAvailable },
                { text: 'Grid offline -> running on inverter', ok: !gridAvailable && batteryPct > 0 },
                { text: `Battery below ${settings.lowBatteryThreshold}% -> low battery alert`, ok: batteryPct > settings.lowBatteryThreshold },
                { text: 'Generator active -> emergency charging', ok: !generatorAvailable || powerSource === 'generator' },
              ].map((item) => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {item.ok ? <CheckCircle size={12} color="#22c55e" /> : <AlertTriangle size={12} color="#f59e0b" />}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="label">Active Devices</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: totalLoad > 0 ? '#3b82f6' : 'var(--text-soft)' }}>{totalLoad}W total</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {activeDevices.length === 0 && <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>No devices active</span>}
          {activeDevices.map((device) => (
            <div
              key={device.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--chip-bg)',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
              }}
            >
              <DeviceIcon name={device.icon} size={16} color="var(--accent)" />
              <span style={{ color: 'var(--text-primary)' }}>{device.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--accent)' }}>{device.watts}W</span>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
