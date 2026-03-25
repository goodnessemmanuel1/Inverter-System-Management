import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Area, AreaChart, ReferenceLine,
} from 'recharts';

const chartTheme = {
  background: 'transparent',
  text: 'rgba(148,163,184,0.7)',
  grid: 'rgba(18,128,245,0.08)',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(7,20,40,0.95)', border: '1px solid rgba(18,128,245,0.25)',
      borderRadius: '10px', padding: '10px 14px', fontSize: '12px',
    }}>
      <p style={{ color: 'rgba(87,175,255,0.6)', fontFamily: "'JetBrains Mono',monospace", marginBottom: '6px' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: p.color }} />
          <span style={{ color: 'rgba(203,213,225,0.8)' }}>{p.name}:</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'white', fontWeight: 600 }}>
            {p.value}{p.name.includes('Battery') ? '%' : 'W'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { historicalData, devices, totalLoad, settings } = useApp();
  const [chartView, setChartView] = useState('load');

  // Device consumption bar data
  const deviceData = devices.map(d => ({
    name: d.name.split(' ')[0],
    watts: d.watts,
    active: d.isOn,
    pct: Math.round((d.watts / devices.reduce((s, x) => s + x.watts, 0)) * 100),
  }));

  // Show last 24 points
  const displayData = historicalData.slice(-24);

  const avgLoad = Math.round(displayData.reduce((s, d) => s + d.load, 0) / displayData.length);
  const maxLoad = Math.max(...displayData.map(d => d.load));
  const minBattery = Math.min(...displayData.map(d => d.battery));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Avg Load (24pts)', value: avgLoad, unit: 'W', color: '#3b82f6' },
          { label: 'Peak Load', value: maxLoad, unit: 'W', color: maxLoad > settings.overloadThreshold ? '#ef4444' : '#f59e0b' },
          { label: 'Min Battery', value: minBattery, unit: '%', color: minBattery < settings.lowBatteryThreshold ? '#ef4444' : '#22c55e' },
          { label: 'Current Load', value: totalLoad, unit: 'W', color: '#55beff' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '18px' }}>
            <div className="label" style={{ marginBottom: '8px' }}>{s.label}</div>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: '24px', color: s.color }}>{s.value}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: 'rgba(148,163,184,0.4)', marginLeft: '3px' }}>{s.unit}</span>
          </div>
        ))}
      </div>

      {/* Main chart — Load over time */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div>
            <div className="label" style={{ marginBottom: '4px' }}>Power Usage Over Time</div>
            <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.4)' }}>Last 24 data points (2s intervals)</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['load', 'battery'].map(v => (
              <button
                key={v}
                onClick={() => setChartView(v)}
                style={{
                  background: chartView === v ? 'rgba(18,128,245,0.2)' : 'rgba(255,255,255,0.04)',
                  border: chartView === v ? '1px solid rgba(18,128,245,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: chartView === v ? '#55beff' : 'rgba(148,163,184,0.5)',
                  borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px',
                  fontFamily: "'JetBrains Mono',monospace", textTransform: 'capitalize', transition: 'all 0.2s',
                }}
              >
                {v}
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
                <ReferenceLine y={settings.overloadThreshold} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" label={{ value: 'Max', fill: 'rgba(239,68,68,0.5)', fontSize: 10 }} />
                <Area type="monotone" dataKey="load" name="Load" stroke="#1280f5" strokeWidth={2} fill="url(#loadGrad)" dot={false} activeDot={{ r: 4, fill: '#1280f5' }} />
              </>
            )}
            {chartView === 'battery' && (
              <>
                <ReferenceLine y={settings.lowBatteryThreshold} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 4" label={{ value: 'Low', fill: 'rgba(245,158,11,0.5)', fontSize: 10 }} />
                <Area type="monotone" dataKey="battery" name="Battery" stroke="#22c55e" strokeWidth={2} fill="url(#battGrad)" dot={false} activeDot={{ r: 4, fill: '#22c55e' }} />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Device consumption bar chart */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '22px' }}>
          <div className="label" style={{ marginBottom: '4px' }}>Device Power Consumption</div>
          <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.4)' }}>Rated wattage comparison</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={deviceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: chartTheme.text, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(18,128,245,0.05)' }} />
            <Bar dataKey="watts" name="Watts" radius={[6, 6, 0, 0]}
              fill="#1280f5"
              label={false}
            >
              {deviceData.map((entry, index) => (
                <rect key={index} fill={entry.active ? '#1280f5' : 'rgba(18,128,245,0.25)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(148,163,184,0.6)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#1280f5' }} />
            Active device
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(148,163,184,0.6)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(18,128,245,0.25)' }} />
            Inactive device
          </div>
        </div>
      </div>
    </div>
  );
}
