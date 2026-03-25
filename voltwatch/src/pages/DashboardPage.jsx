import React from 'react';
import { useApp } from '../context/AppContext';
import BatteryGauge from '../components/BatteryGauge';
import { Zap, Activity, Clock, Power, Grid, Cpu, Triangle, AlertTriangle, CheckCircle } from 'lucide-react';

function StatCard({ label, value, unit, sub, color, icon: Icon, iconColor, glow }) {
  return (
    <div className="card" style={{
      padding: '22px', flex: 1,
      boxShadow: glow ? `0 4px 24px rgba(0,0,0,0.5), 0 0 30px ${glow}` : undefined,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span className="label">{label}</span>
        {Icon && (
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: `${iconColor || 'rgba(18,128,245,0.15)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={15} color={iconColor ? 'white' : 'rgba(87,175,255,0.7)'} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span className="value" style={{ fontSize: '32px', lineHeight: 1, color: color || 'white' }}>{value}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', color: 'rgba(148,163,184,0.5)' }}>{unit}</span>
      </div>
      {sub && <p style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)', marginTop: '6px' }}>{sub}</p>}
    </div>
  );
}

function PowerSourceCard({ source, label, icon: Icon, active, color, available, onClick }) {
  return (
    <div
      onClick={onClick}
      className={active ? 'card' : 'card'}
      style={{
        padding: '18px', cursor: 'pointer',
        border: active
          ? `1px solid ${color}50`
          : '1px solid rgba(18,128,245,0.1)',
        transition: 'all 0.3s',
        boxShadow: active ? `0 0 30px ${color}20` : undefined,
        opacity: !available && !active ? 0.45 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: active ? `${color}20` : 'rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: active ? `1px solid ${color}30` : 'none',
        }}>
          <Icon size={17} color={active ? color : 'rgba(148,163,184,0.5)'} />
        </div>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: active ? color : 'rgba(255,255,255,0.1)',
          boxShadow: active ? `0 0 8px ${color}` : 'none',
        }} className={active ? 'flow-active' : ''} />
      </div>
      <div style={{
        fontFamily: "'Orbitron',sans-serif", fontSize: '13px', fontWeight: 600,
        color: active ? color : 'rgba(148,163,184,0.7)', marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono',monospace", color: 'rgba(148,163,184,0.4)' }}>
        {active ? 'ACTIVE' : available ? 'STANDBY' : 'OFFLINE'}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    batteryPct, totalLoad, chargingStatus, backupTimeMinutes, formatBackupTime,
    powerSource, gridAvailable, generatorAvailable, toggleGrid, toggleGenerator,
    devices, alerts, settings,
  } = useApp();

  const activeDevices = devices.filter(d => d.isOn);
  const isOverload = totalLoad > settings.overloadThreshold;
  const isLowBattery = batteryPct < settings.lowBatteryThreshold;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Alert banner */}
      {(isLowBattery || isOverload) && (
        <div style={{
          background: isOverload ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${isOverload ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
          borderRadius: '12px', padding: '12px 16px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }} className="fade-up">
          <AlertTriangle size={16} color={isOverload ? '#ef4444' : '#f59e0b'} />
          <span style={{ fontSize: '13px', color: isOverload ? '#f87171' : '#fbbf24' }}>
            {isOverload
              ? `⚠️ System overload: ${totalLoad}W active — exceeds ${settings.overloadThreshold}W limit`
              : `🔋 Battery low: ${Math.round(batteryPct)}% — connect to grid or start generator`
            }
          </span>
        </div>
      )}

      {/* Top grid — stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard
          label="Total Load"
          value={totalLoad}
          unit="W"
          sub={`${activeDevices.length} device${activeDevices.length !== 1 ? 's' : ''} active`}
          icon={Activity}
          iconColor={isOverload ? 'rgba(239,68,68,0.25)' : 'rgba(18,128,245,0.15)'}
          color={isOverload ? '#f87171' : 'white'}
          glow={isOverload ? 'rgba(239,68,68,0.1)' : undefined}
        />
        <StatCard
          label="Backup Time"
          value={formatBackupTime(backupTimeMinutes)}
          unit=""
          sub={powerSource === 'grid' ? 'Grid connected' : 'On battery power'}
          icon={Clock}
          color={backupTimeMinutes < 30 ? '#f87171' : backupTimeMinutes < 120 ? '#fbbf24' : '#4ade80'}
        />
        <StatCard
          label="Power Source"
          value={{ grid: 'Grid', inverter: 'Batt.', generator: 'Gen.' }[powerSource]}
          unit=""
          sub={{ grid: 'NEPA connected', inverter: 'Battery power', generator: 'Generator on' }[powerSource]}
          icon={Zap}
          color={{ grid: '#4ade80', inverter: '#3b82f6', generator: '#f59e0b' }[powerSource]}
        />
        <StatCard
          label="System Capacity"
          value="5"
          unit="kWh"
          sub="LiFePO4 battery bank"
          icon={Cpu}
        />
      </div>

      {/* Main row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.8fr)', gap: '20px', marginBottom: '20px' }}>
        {/* Battery */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="label" style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>Battery Status</div>
          <BatteryGauge size={190} />
          <div style={{ marginTop: '20px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)' }}>0%</span>
              <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)' }}>100%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${batteryPct}%`,
                background: batteryPct < 20
                  ? 'linear-gradient(90deg,#b91c1c,#ef4444)'
                  : batteryPct < 50
                  ? 'linear-gradient(90deg,#b45309,#f59e0b)'
                  : 'linear-gradient(90deg,#1280f5,#22c55e)',
                borderRadius: '3px',
                transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>
          </div>
        </div>

        {/* Power sources */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span className="label">Power Sources</span>
            <span style={{ fontSize: '11px', color: 'rgba(148,163,184,0.4)', fontFamily: "'JetBrains Mono',monospace" }}>
              CLICK TO TOGGLE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <PowerSourceCard
              source="grid" label="Grid (NEPA)"
              icon={Grid}
              active={powerSource === 'grid'}
              color="#22c55e"
              available={gridAvailable}
              onClick={toggleGrid}
            />
            <PowerSourceCard
              source="inverter" label="Inverter"
              icon={Zap}
              active={powerSource === 'inverter'}
              color="#3b82f6"
              available={batteryPct > 0}
              onClick={null}
            />
            <PowerSourceCard
              source="generator" label="Generator"
              icon={Triangle}
              active={powerSource === 'generator'}
              color="#f59e0b"
              available={generatorAvailable}
              onClick={toggleGenerator}
            />
          </div>

          {/* System logic info */}
          <div style={{
            background: 'rgba(18,128,245,0.04)', border: '1px solid rgba(18,128,245,0.1)',
            borderRadius: '10px', padding: '14px',
          }}>
            <div className="label" style={{ marginBottom: '10px' }}>Auto-Switch Logic</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[
                { check: gridAvailable, text: 'Grid online → charging battery', ok: gridAvailable },
                { check: !gridAvailable && batteryPct > 0, text: 'Grid offline → running on inverter', ok: !gridAvailable && batteryPct > 0 },
                { check: batteryPct <= settings.lowBatteryThreshold, text: `Battery below ${settings.lowBatteryThreshold}% → low battery alert`, ok: batteryPct > settings.lowBatteryThreshold },
                { check: generatorAvailable, text: 'Generator active → emergency charging', ok: !generatorAvailable || powerSource === 'generator' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(148,163,184,0.7)' }}>
                  {item.ok
                    ? <CheckCircle size={12} color="#22c55e" />
                    : <AlertTriangle size={12} color="#f59e0b" />
                  }
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active devices quick view */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="label">Active Devices</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: totalLoad > 0 ? '#3b82f6' : 'rgba(148,163,184,0.4)' }}>
            {totalLoad}W total
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {activeDevices.length === 0 && (
            <span style={{ fontSize: '13px', color: 'rgba(148,163,184,0.4)' }}>No devices active</span>
          )}
          {activeDevices.map(d => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(18,128,245,0.08)', border: '1px solid rgba(18,128,245,0.2)',
              borderRadius: '8px', padding: '6px 12px', fontSize: '13px',
            }}>
              <span>{d.icon}</span>
              <span style={{ color: 'white' }}>{d.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'rgba(87,175,255,0.6)' }}>
                {d.watts}W
              </span>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
