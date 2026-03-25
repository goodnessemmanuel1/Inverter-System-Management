import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BATTERY_CAPACITY_WH, DEVICES, generateHistoricalData } from '../data/initialData';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('vw_auth') === 'true');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vw_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('vw_settings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          lowBatteryThreshold: 20,
          overloadThreshold: 2000,
          alertsEnabled: true,
          darkMode: true,
          notifications: { lowBattery: true, overload: true, sourceChange: true },
        };
  });

  const [devices, setDevices] = useState(DEVICES);
  const [batteryPct, setBatteryPct] = useState(78);
  const [powerSource, setPowerSource] = useState('grid');
  const [gridAvailable, setGridAvailable] = useState(true);
  const [generatorAvailable, setGeneratorAvailable] = useState(false);
  const [chargingStatus, setChargingStatus] = useState('charging');
  const [historicalData, setHistoricalData] = useState(() => generateHistoricalData());
  const [alerts, setAlerts] = useState([]);

  const alertIdRef = useRef(0);
  const shownAlertsRef = useRef(new Set());
  const totalLoad = devices.filter((device) => device.isOn).reduce((sum, device) => sum + device.watts, 0);
  const backupTimeMinutes =
    totalLoad > 0 ? Math.round(((batteryPct / 100) * BATTERY_CAPACITY_WH * 60) / totalLoad) : 9999;

  const formatBackupTime = (mins) => {
    if (mins >= 9999) return 'Infinity';
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const login = (username, password) => {
    const validUsers = [
      { username: 'admin', password: 'volt2024', name: 'Goodness Emmanuel', role: 'Home Admin' },
      { username: 'demo', password: 'demo123', name: 'Demo User', role: 'Viewer' },
    ];
    const found = validUsers.find((candidate) => candidate.username === username && candidate.password === password);

    if (!found) {
      return { success: false, error: 'Invalid credentials. Try admin / volt2024' };
    }

    const userData = { username: found.username, name: found.name, role: found.role };
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('vw_auth', 'true');
    localStorage.setItem('vw_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('vw_auth');
    localStorage.removeItem('vw_user');
  }, []);

  const addAlert = useCallback(
    (type, message) => {
      if (!settings.alertsEnabled) return;
      const id = ++alertIdRef.current;
      setAlerts((prev) => [{ id, type, message, timestamp: new Date() }, ...prev.slice(0, 9)]);
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 6000);
    },
    [settings.alertsEnabled],
  );

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const updateSettings = useCallback((key, value) => {
    setSettings((prev) => {
      const next = typeof key === 'object' ? { ...prev, ...key } : { ...prev, [key]: value };
      localStorage.setItem('vw_settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleDevice = useCallback((deviceId) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, isOn: !device.isOn } : device)),
    );
  }, []);

  const toggleGrid = useCallback(() => {
    setGridAvailable((prev) => {
      const next = !prev;
      if (!next) {
        setPowerSource('inverter');
        addAlert('warning', 'Grid (NEPA) power lost - switched to inverter battery');
      } else {
        setPowerSource('grid');
        addAlert('info', 'Grid (NEPA) power restored - switching back to grid');
      }
      return next;
    });
  }, [addAlert]);

  const toggleGenerator = useCallback(() => {
    setGeneratorAvailable((prev) => {
      const next = !prev;
      if (next && !gridAvailable) {
        setPowerSource('generator');
        addAlert('success', 'Generator activated - charging battery');
      } else if (!next && powerSource === 'generator') {
        setPowerSource('inverter');
        addAlert('warning', 'Generator off - switched back to inverter');
      }
      return next;
    });
  }, [addAlert, gridAvailable, powerSource]);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light';
  }, [settings.darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryPct((prev) => {
        let next = prev;
        const isCharging = powerSource === 'grid' || powerSource === 'generator';
        const chargeRate = powerSource === 'generator' ? 0.4 : 0.3;
        const drainRate = totalLoad / BATTERY_CAPACITY_WH / 36;

        if (isCharging) {
          next = Math.min(100, prev + chargeRate - drainRate * 0.3);
          setChargingStatus(next >= 99.5 ? 'idle' : 'charging');
        } else {
          next = Math.max(0, prev - drainRate);
          setChargingStatus('discharging');
        }

        if (next <= 0 && powerSource === 'inverter') {
          next = 0;
          if (generatorAvailable) {
            setPowerSource('generator');
            addAlert('warning', 'Battery depleted - emergency generator started');
          } else {
            addAlert('error', 'Battery depleted! No power source available.');
          }
        }

        return Number.parseFloat(next.toFixed(2));
      });

      setHistoricalData((prev) => {
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
  }, [addAlert, batteryPct, generatorAvailable, powerSource, totalLoad]);

  useEffect(() => {
    if (!settings.alertsEnabled) return;

    const key = `low_${Math.floor(batteryPct / 5) * 5}`;
    if (batteryPct <= settings.lowBatteryThreshold && !shownAlertsRef.current.has(key)) {
      shownAlertsRef.current.add(key);
      if (settings.notifications?.lowBattery) {
        addAlert('warning', `Battery low: ${Math.round(batteryPct)}% - consider switching to grid or generator`);
      }
    }

    if (batteryPct > settings.lowBatteryThreshold + 5) {
      shownAlertsRef.current = new Set(
        [...shownAlertsRef.current].filter((entry) => !entry.startsWith('low_')),
      );
    }
  }, [addAlert, batteryPct, settings]);

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
  }, [addAlert, settings, totalLoad]);

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    settings,
    updateSettings,
    batteryPct,
    totalLoad,
    powerSource,
    gridAvailable,
    generatorAvailable,
    chargingStatus,
    backupTimeMinutes,
    formatBackupTime,
    toggleGrid,
    toggleGenerator,
    devices,
    toggleDevice,
    historicalData,
    alerts,
    addAlert,
    dismissAlert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
