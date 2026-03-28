import React from 'react';
import { useApp } from '../context/AppContext';

export default function BatteryGauge({ size = 180 }) {
  const { batteryPct, chargingStatus } = useApp();
  const pct = Math.round(batteryPct);

  const radius = size * 0.38;
  const center = size / 2;
  const strokeWidth = size * 0.055;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const fillLength = arcLength * (pct / 100);
  const gapLength = circumference - arcLength;
  const color = pct < 20 ? '#ef4444' : pct < 50 ? '#f59e0b' : '#1280f5';
  const glowColor = pct < 20 ? 'rgba(239,68,68,0.4)' : pct < 50 ? 'rgba(245,158,11,0.4)' : 'rgba(18,128,245,0.4)';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
        <defs>
          <linearGradient id="battGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={pct < 20 ? '#ef4444' : pct < 50 ? '#f59e0b' : '#1280f5'} />
            <stop offset="100%" stopColor={pct < 20 ? '#f87171' : pct < 50 ? '#fbbf24' : '#55beff'} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--surface-muted)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeLinecap="round"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#battGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${fillLength} ${circumference - fillLength}`}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          className={chargingStatus !== 'idle' ? 'battery-pulse' : ''}
        />
      </svg>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: "'Orbitron',sans-serif",
            fontWeight: 800,
            color,
            fontSize: `${size * 0.18}px`,
            lineHeight: 1,
            textShadow: `0 0 20px ${glowColor}`,
            transition: 'color 0.5s',
          }}
        >
          {pct}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: `${size * 0.07}px`, color: 'var(--label-color)', letterSpacing: '0.08em', marginTop: '2px' }}>%</div>
        <div
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: `${size * 0.058}px`,
            color: chargingStatus === 'charging' ? '#22c55e' : chargingStatus === 'discharging' ? '#f59e0b' : 'var(--text-soft)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginTop: `${size * 0.04}px`,
          }}
        >
          {chargingStatus}
        </div>
      </div>
    </div>
  );
}
