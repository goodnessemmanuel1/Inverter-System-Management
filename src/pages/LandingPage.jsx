import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, BatteryCharging, Cpu, ShieldCheck, SunMedium, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const highlights = [
  {
    icon: Activity,
    title: 'Track live load',
    text: 'See active devices, battery reserve, and source changes from one control surface.',
  },
  {
    icon: BatteryCharging,
    title: 'Catch low battery early',
    text: 'Monitor thresholds, get alerts, and react before downtime hits your home or shop.',
  },
  {
    icon: Cpu,
    title: 'Manage connected devices',
    text: 'Toggle appliances, compare wattage, and spot overload risk before it becomes a problem.',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f4f7fb 0%, #eef4ff 46%, #fff7eb 100%)',
        color: '#10233f',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(18,128,245,0.18), transparent 26%), radial-gradient(circle at 80% 18%, rgba(245,158,11,0.18), transparent 22%), linear-gradient(rgba(16,35,63,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,35,63,0.04) 1px, transparent 1px)',
          backgroundSize: 'auto, auto, 42px 42px, 42px 42px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 56px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '56px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1280f5, #0b68e1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 14px 28px rgba(18,128,245,0.24)',
              }}
            >
              <Zap size={22} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '18px', fontWeight: 800 }}>VoltWatch</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(16,35,63,0.56)' }}>
                INVERTER SYSTEM MANAGEMENT
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                color: '#10233f',
                fontWeight: 600,
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1px solid rgba(16,35,63,0.12)',
                background: 'rgba(255,255,255,0.72)',
              }}
            >
              Sign in
            </Link>
            <button
              onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/login')}
              style={{
                border: 'none',
                borderRadius: '999px',
                padding: '12px 18px',
                background: 'linear-gradient(135deg, #1280f5, #0b68e1)',
                color: 'white',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 14px 28px rgba(18,128,245,0.28)',
              }}
            >
              Open dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <section className="landing-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)', gap: '28px', alignItems: 'center', marginBottom: '42px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(16,35,63,0.08)',
                marginBottom: '18px',
                color: '#0b68e1',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <SunMedium size={14} />
              Built for homes, offices, and shops
            </div>

            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(2.6rem, 7vw, 4.8rem)', lineHeight: 1.02, margin: '0 0 16px' }}>
              Watch every watt before power problems watch you.
            </h1>
            <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(16,35,63,0.72)', maxWidth: '620px', marginBottom: '26px' }}>
              VoltWatch gives your inverter setup a clear operating picture: battery level, live load, active appliances, and fast switching between grid, inverter, and generator.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '22px' }}>
              <button onClick={() => navigate('/login')} className="landing-primary-btn">
                Start monitoring
                <ArrowRight size={16} />
              </button>
              <a
                href="#features"
                style={{
                  textDecoration: 'none',
                  color: '#10233f',
                  fontWeight: 700,
                  padding: '12px 18px',
                  borderRadius: '999px',
                  border: '1px solid rgba(16,35,63,0.12)',
                  background: 'rgba(255,255,255,0.72)',
                }}
              >
                Explore features
              </a>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                'Live power state simulation',
                'Clean analytics and device views',
                'Theme-aware control panel',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(16,35,63,0.72)', fontSize: '14px' }}>
                  <ShieldCheck size={16} color="#16a34a" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(16,35,63,0.08)',
              borderRadius: '28px',
              padding: '22px',
              boxShadow: '0 20px 45px rgba(16,35,63,0.12)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: '#10233f', color: 'white', borderRadius: '22px', padding: '18px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(191,219,254,0.72)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  Primary Status
                </div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '44px', marginBottom: '8px' }}>78%</div>
                <div style={{ color: 'rgba(255,255,255,0.74)', marginBottom: '14px' }}>Battery reserve healthy</div>
                <div style={{ height: '10px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #22c55e)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gap: '14px' }}>
                {[
                  ['Source', 'Grid'],
                  ['Load', '435W'],
                  ['Devices', '4 active'],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: '#edf4ff', borderRadius: '18px', padding: '16px', border: '1px solid rgba(18,128,245,0.12)' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(16,35,63,0.56)', marginBottom: '8px' }}>{label}</div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '18px' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #fff7eb, #fff)', borderRadius: '22px', padding: '18px', border: '1px solid rgba(245,158,11,0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(16,35,63,0.56)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Alert Strategy
                </span>
                <span style={{ color: '#b45309', fontWeight: 700, fontSize: '13px' }}>Low battery at 20%</span>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  'Grid outage triggers inverter handoff',
                  'Generator can take over during depletion',
                  'Overload warnings surface before the limit is crossed',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(16,35,63,0.78)', fontSize: '14px' }}>
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          {highlights.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(16,35,63,0.08)',
                borderRadius: '22px',
                padding: '22px',
                boxShadow: '0 16px 30px rgba(16,35,63,0.08)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(18,128,245,0.12), rgba(11,104,225,0.22))',
                  marginBottom: '16px',
                }}
              >
                <Icon size={22} color="#0b68e1" />
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{title}</div>
              <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(16,35,63,0.68)' }}>{text}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
