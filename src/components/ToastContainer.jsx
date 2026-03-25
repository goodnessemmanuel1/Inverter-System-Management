import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const icons = {
  warning: <AlertTriangle size={15} color="#f59e0b" />,
  error: <XCircle size={15} color="#ef4444" />,
  success: <CheckCircle size={15} color="#22c55e" />,
  info: <Info size={15} color="#3b82f6" />,
};

const colors = {
  warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24' },
  error: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: '#f87171' },
  success: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', text: '#4ade80' },
  info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa' },
};

function Toast({ alert, onDismiss }) {
  const [leaving, setLeaving] = useState(false);
  const c = colors[alert.type] || colors.info;

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(alert.id), 300);
  };

  return (
    <div
      className={leaving ? 'toast-out' : 'toast-in'}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        background: c.bg, border: `1px solid ${c.border}`, borderRadius: '12px',
        padding: '12px 14px', marginBottom: '8px', maxWidth: '360px',
        boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ marginTop: '1px', flexShrink: 0 }}>{icons[alert.type]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: c.text, textTransform: 'capitalize', marginBottom: '2px' }}>
          {alert.type}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {alert.message}
        </div>
      </div>
      <button
        onClick={dismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', padding: '2px', flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { alerts, dismissAlert } = useApp();
  const visible = alerts.slice(0, 3);

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
    }}>
      {visible.map(alert => (
        <Toast key={alert.id} alert={alert} onDismiss={dismissAlert} />
      ))}
    </div>
  );
}
