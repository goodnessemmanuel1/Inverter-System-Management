import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';

const chartTheme = {
  text: 'var(--chart-text)',
  grid: 'var(--chart-grid)',
  tooltipBg: 'var(--card-bg)',
  tooltipBorder: 'var(--border-strong)',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: chartTheme.tooltipBg,
        border: `1px solid ${chartTheme.tooltipBorder}`,
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '12px',
        boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
      }}
    >
      <p style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono',monospace", marginBottom: '6px' }}>{label}</p>
      {payload.map((point) => (
        <div key={point.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: point.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{point.name}:</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--text-primary)', fontWeight: 600 }}>
            {point.value}
            {point.name.includes('Battery') ? '%' : 'W'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { historicalData, devices, totalLoad, settings } = useApp();
  const [chartView, setChartView] = useState('load');

  const deviceData = useMemo(
    () =>
      devices.map((device) => ({
        name: device.name.split(' ')[0],
        watts: device.watts,
        active: device.isOn,
      })),
    [devices],
  );

  const displayData = historicalData.slice(-24);
  const avgLoad = Math.round(displayData.reduce((sum, item) => sum + item.load, 0) / displayData.length);
  const maxLoad = Math.max(...displayData.map((item) => item.load));
  const minBattery = Math.min(...displayData.map((item) => item.battery));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Avg Load (24pts)', value: avgLoad, unit: 'W', color: '#3b82f6' },
          { label: 'Peak Load', value: maxLoad, unit: 'W', color: maxLoad > settings.overloadThreshold ? '#ef4444' : '#f59e0b' },
          { label: 'Min Battery', value: minBattery, unit: '%', color: minBattery < settings.lowBatteryThreshold ? '#ef4444' : '#22c55e' },
          { label: 'Current Load', value: totalLoad, unit: 'W', color: '#55beff' },
        ].map((item) => (
          <div key={item.label} className="card" style={{ padding: '18px' }}>
            <div className="label" style={{ marginBottom: '8px' }}>{item.label}</div>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: '24px', color: item.color }}>{item.value}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: 'var(--text-soft)', marginLeft: '3px' }}>{item.unit}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', gap: '8px', flexWrap: 'wrap' }}>
          <div>
            <div className="label" style={{ marginBottom: '4px' }}>Power Usage Over Time</div>
            <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>Last 24 data points (2s intervals)</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['load', 'battery'].map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view)}
                style={{
                  background: chartView === view ? 'var(--chip-bg)' : 'var(--surface-muted)',
                  border: chartView === view ? '1px solid var(--border-strong)' : '1px solid var(--border-subtle)',
                  color: chartView === view ? 'var(--accent)' : 'var(--text-muted)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono',monospace",
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                }}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={displayData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1280f5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1280f5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="battGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="time" tick={{ fill: chartTheme.text, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {chartView === 'load' && (
              <>
                <ReferenceLine y={settings.overloadThreshold} stroke="rgba(239,68,68,0.35)" strokeDasharray="4 4" label={{ value: 'Max', fill: '#ef4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="load" name="Load" stroke="#1280f5" strokeWidth={2} fill="url(#loadGrad)" dot={false} activeDot={{ r: 4, fill: '#1280f5' }} />
              </>
            )}
            {chartView === 'battery' && (
              <>
                <ReferenceLine y={settings.lowBatteryThreshold} stroke="rgba(245,158,11,0.45)" strokeDasharray="4 4" label={{ value: 'Low', fill: '#f59e0b', fontSize: 10 }} />
                <Area type="monotone" dataKey="battery" name="Battery" stroke="#22c55e" strokeWidth={2} fill="url(#battGrad)" dot={false} activeDot={{ r: 4, fill: '#22c55e' }} />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '22px' }}>
          <div className="label" style={{ marginBottom: '4px' }}>Device Power Consumption</div>
          <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>Rated wattage comparison</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={deviceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: chartTheme.text, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(18,128,245,0.05)' }} />
            <Bar dataKey="watts" name="Watts" radius={[6, 6, 0, 0]}>
              {deviceData.map((entry) => (
                <rect key={entry.name} fill={entry.active ? '#1280f5' : 'rgba(18,128,245,0.25)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#1280f5' }} />
            Active device
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(18,128,245,0.25)' }} />
            Inactive device
          </div>
        </div>
      </div>
    </div>
  );
}
