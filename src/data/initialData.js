export const DEVICES = [
  { id: 'fan', name: 'Ceiling Fan', icon: '🌀', watts: 75, room: 'Living Room', isOn: true },
  { id: 'tv', name: 'Smart TV', icon: '📺', watts: 120, room: 'Living Room', isOn: true },
  { id: 'fridge', name: 'Refrigerator', icon: '🧊', watts: 200, room: 'Kitchen', isOn: true },
  { id: 'ac', name: 'Air Conditioner', icon: '❄️', watts: 1500, room: 'Bedroom', isOn: false },
  { id: 'light1', name: 'LED Lights', icon: '💡', watts: 40, room: 'Living Room', isOn: true },
  { id: 'laptop', name: 'Laptop / Router', icon: '💻', watts: 90, room: 'Study', isOn: false },
];

export const BATTERY_CAPACITY_WH = 5000; // 5kWh inverter

export const POWER_SOURCES = ['grid', 'inverter', 'generator'];

export const generateHistoricalData = () => {
  const data = [];
  const now = Date.now();
  const baseLoad = 395; // fan + tv + fridge + lights
  for (let i = 47; i >= 0; i--) {
    const time = new Date(now - i * 30 * 60 * 1000);
    const hour = time.getHours();
    // Peak hours: 6-9am, 6-11pm
    const isPeak = (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 23);
    const variance = (Math.sin(i * 0.3) * 80) + (isPeak ? 180 : 0);
    const load = Math.max(100, Math.min(2200, baseLoad + variance + (i % 7) * 15));
    const solarPct = (hour >= 7 && hour <= 18) ? Math.sin(((hour - 7) / 11) * Math.PI) : 0;
    data.push({
      time: time.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      load: Math.round(load),
      solar: Math.round(solarPct * 400),
      battery: Math.round(65 + Math.sin(i * 0.15) * 20),
    });
  }
  return data;
};

export const ALERTS_CONFIG = {
  lowBatteryThreshold: 20,
  overloadThreshold: 2000,
};
