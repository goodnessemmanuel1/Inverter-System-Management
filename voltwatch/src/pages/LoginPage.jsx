import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate network
    const result = login(username, password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  const handleDemo = () => {
    setUsername('demo');
    setPassword('demo123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040d1e',
      backgroundImage: 'radial-gradient(ellipse at 30% 70%, rgba(18,128,245,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(11,104,225,0.08) 0%, transparent 45%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(18,128,245,1) 1px, transparent 1px), linear-gradient(90deg, rgba(18,128,245,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px' }} className="fade-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #1280f5, #0b68e1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(18,128,245,0.4)',
          }}>
            <Zap size={32} color="white" fill="white" />
          </div>
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: '28px', fontWeight: 800,
            background: 'linear-gradient(135deg,#55beff,#1280f5)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '6px',
          }}>VoltWatch</h1>
          <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '14px' }}>
            Smart Inverter Monitoring System
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <Shield size={16} color="rgba(87,175,255,0.6)" />
            <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(87,175,255,0.6)' }}>
              Secure Login
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Username</label>
              <input
                className="input-field"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.6)',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '12px 14px', marginBottom: '16px',
                fontSize: '13px', color: '#f87171',
              }}>
                {error}
              </div>
            )}

            <button className="btn-primary" type="submit" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                  </svg>
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={handleDemo}
              style={{
                background: 'none', border: '1px solid rgba(18,128,245,0.25)', borderRadius: '8px',
                color: 'rgba(87,175,255,0.8)', fontSize: '12px', padding: '8px 20px',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Use Demo Account
            </button>
          </div>

          <div style={{
            marginTop: '24px', padding: '14px', background: 'rgba(18,128,245,0.06)',
            border: '1px solid rgba(18,128,245,0.12)', borderRadius: '10px',
            fontSize: '12px', color: 'rgba(148,163,184,0.7)', lineHeight: 1.6,
          }}>
            <strong style={{ color: 'rgba(87,175,255,0.8)' }}>Admin:</strong> admin / volt2024<br />
            <strong style={{ color: 'rgba(87,175,255,0.8)' }}>Demo:</strong> demo / demo123
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'rgba(148,163,184,0.4)' }}>
          VoltWatch v1.0 · By Goodness Emmanuel
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
