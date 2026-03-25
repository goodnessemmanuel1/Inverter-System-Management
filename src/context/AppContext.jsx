import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { DEVICES, BATTERY_CAPACITY_WH, generateHistoricalData } from '../data/initialData';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

export const AppProvider = ({ children }) => {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vw_auth') === 'true';
  });
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('vw_user');
    return u ? JSON.parse(u) : null;
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const s = localStorage.getItem('vw_settings');
    return s ? JSON.parse(s) : {
      lowBatteryThreshold: 20,
      overloadThreshold: 2000,
      alertsEnabled: true,
      darkMode: true,
      notifications: { lowBattery: true, overload: true, sourceChange: true },
    };
  });

  // Devices
  const [devices, setDevices] = useState(DEVICES);

  // Power state
  const [batteryPct, setBatteryPct] = useState(78);
  const [powerSource, setPowerSource] = useState('grid'); // grid | inverter | generator
  const [gridAvailable, setGridAvailable] = useState(true);
  const [generatorAvailable, setGeneratorAvailable] = useState(false);
  const [chargingStatus, setChargingStatus] = useState('charging'); // charging | discharging | idle

  // Analytics
  const [historicalData, setHistoricalData] = useState(() => generateHistoricalData());

  // Alerts
  const [alerts, setAlerts] = useState([]);
  const alertIdRef = useRef(0);
  const shownAlertsRef = useRef(new Set());

  // Derived: total load
  const totalLoad = devices.filter(d => d.isOn).reduce((sum, d) => sum + d.watts, 0);

  // Backup time in minutes
  const backupTimeMinutes = totalLoad > 0
    ? Math.round((batteryPct / 100) * BATTERY_CAPACITY_WH / totalLoad * 60)
    : 9999;

  const formatBackupTime = (mins) => {
    if (mins >= 9999) return '∞';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // Login / logout
  const login = (username, password) => {
    const validUsers = [
      { username: 'admin', password: 'volt2024', name: 'Goodness Emmanuel', role: 'Home Admin' },
      { username: 'demo', password: 'demo123', name: 'Demo User', role: 'Viewer' },
    ];
    const found = validUsers.find(u => u.username === username && u.password === password);
    if (found) {
      const userData = { username: found.username, name: found.name, role: found.role };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('vw_auth', 'true');
      localStorage.setItem('vw_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Try admin / volt2024' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('vw_auth');
    localStorage.removeItem('vw_user');
  };

  // Toggle device
  const toggleDevice = useCallback((deviceId) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, isOn: !d.isOn } : d));
  }, []);

  // Toggle grid
  const toggleGrid = useCallback(() => {
    setGridAvailable(prev => {
      const next = !prev;
      if (!next) {
        setPowerSource('inverter');
        addAlert('warning', 'Grid (NEPA) power lost — switched to inverter battery');
      } else {
        setPowerSource('grid');
        addAlert('info', 'Grid (NEPA) power restored — switching back to grid');
      }
      return next;
    });
  }, []);

  // Toggle generator
  const toggleGenerator = useCallback(() => {
    setGeneratorAvailable(prev => {
      const next = !prev;
      if (next && !gridAvailable) {
        setPowerSource('generator');
        addAlert('success', 'Generator activated — charging battery');
      } else if (!next && powerSource === 'generator') {
        setPowerSource('inverter');
        addAlert('warning', 'Generator off — switched back to inverter');
      }
      return next;
    });
  }, [gridAvailable, powerSource]);

  // Add alert
  const addAlert = useCallback((type, message) => {
    if (!settings.alertsEnabled) return;
    const id = ++alertIdRef.current;
    setAlerts(prev => [{ id, type, message, timestamp: new Date() }, ...prev.slice(0, 9)]);
    // Auto-remove toast after 5s
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 6000);
  }, [settings.alertsEnabled]);

  // Dismiss alert
  const dismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  // Update settings
  const updateSettings = useCallback((key, value) => {
    setSettings(prev => {
      const next = typeof key === 'object' ? { ...prev, ...key } : { ...prev, [key]: value };
      localStorage.setItem('vw_settings', JSON.stringify(next));
      return next;
    });
  }, []);

  // Apply dark/light mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [settings.darkMode]);

  // ---- Main simulation loop ----
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryPct(prev => {
        let next = prev;
        const isCharging = powerSource === 'grid' || powerSource === 'generator';
        const chargeRate = powerSource === 'generator' ? 0.4 : 0.3; // % per tick
        const drainRate = totalLoad / BATTERY_CAPACITY_WH / 36; // realistic drain per 2s tick

        if (isCharging) {
          next = Math.min(100, prev + chargeRate - (drainRate * 0.3));
          setChargingStatus(next >= 99.5 ? 'idle' : 'charging');
        } else {
          // On inverter
          next = Math.max(0, prev - drainRate);
          setChargingStatus('discharging');
        }

        // Smart auto-switching logic
        if (next <= 0 && powerSource === 'inverter') {
          next = 0;
          if (generatorAvailable) {
            setPowerSource('generator');
            addAlert('warning', 'Battery depleted — emergency generator started');
          } else {
            addAlert('error', 'Battery depleted! No power source available.');
          }
        }

        return parseFloat(next.toFixed(2));
      });

      // Update historical data every tick
      setHistoricalData(prev => {
        const now = new Date();
        const newPoint = {
          time: now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
          load: totalLoad,
          solar: 0,
          battery: Math.round(batteryPct),
        };
        return [...prev.slice(-47), newPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [powerSource, totalLoad, generatorAvailable, addAlert]);

  // Alert checks
  useEffect(() => {
    if (!settings.alertsEnabled) return;
    const key = `low_${Math.floor(batteryPct / 5) * 5}`;
    if (batteryPct <= settings.lowBatteryThreshold && !shownAlertsRef.current.has(key)) {
      shownAlertsRef.current.add(key);
      if (settings.notifications?.lowBattery) {
        addAlert('warning', `Battery low: ${Math.round(batteryPct)}% — consider switching to grid or generator`);
      }
    }
    if (batteryPct > settings.lowBatteryThreshold + 5) {
      // Clear low battery keys to allow re-alerting
      shownAlertsRef.current = new Set([...shownAlertsRef.current].filter(k => !k.startsWith('low_')));
    }
  }, [batteryPct, settings]);

  useEffect(() => {
    if (!settings.alertsEnabled) return;
    if (totalLoad > settings.overloadThreshold && !shownAlertsRef.current.has('overload')) {
      shownAlertsRef.current.add('overload');
      if (settings.notifications?.overload) {
        addAlert('error', `System overload! ${totalLoad}W exceeds ${settings.overloadThreshold}W limit`);
      }
    } else if (totalLoad <= settings.overloadThreshold) {
      shownAlertsRef.current.delete('overload');
    }
  }, [totalLoad, settings]);

  const value = {
    // Auth
    isAuthenticated, user, login, logout,
    // Settings
    settings, updateSettings,
    // Power
    batteryPct, totalLoad, powerSource, gridAvailable, generatorAvailable,
    chargingStatus, backupTimeMinutes, formatBackupTime,
    toggleGrid, toggleGenerator,
    // Devices
    devices, toggleDevice,
    // Analytics
    historicalData,
    // Alerts
    alerts, addAlert, dismissAlert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
