# ⚡ VoltWatch – Smart Inverter Monitoring Dashboard

> A production-grade smart home energy monitoring dashboard that simulates real-time inverter, battery, and device management — built with React, Tailwind CSS, and Recharts.

---

## 📖 Description

VoltWatch is a smart home energy monitoring dashboard designed for everyday household users with inverter/battery backup systems. Inspired by modern energy products like Tesla Powerwall, it provides a clean, minimal dark-blue interface to track battery levels, manage home devices, monitor power source switching, and analyze energy consumption over time — all in real-time simulation.

Built with the Nigerian market context in mind (NEPA/grid power instability), VoltWatch gives homeowners full visibility and control over their home energy setup.

---

## ✨ Features

- **Real-Time Battery Simulation** — Animated circular gauge; drains/charges based on active load and power source
- **Smart Power Switching** — Grid → Inverter → Generator auto-failover logic
- **Device Control** — Toggle appliances ON/OFF; load updates in real time
- **Energy Analytics** — Area charts (load over time, battery trend) + Bar chart (device comparison)
- **Smart Alerts** — Toast notifications for low battery, overload, and source changes
- **Authentication** — Simulated login with session persistence
- **Settings** — Configurable thresholds, alert toggles, dark/light mode

---

## 🛠 Tech Stack

- **React 18** + Vite
- **Tailwind CSS 3**
- **Context API** (state management)
- **Recharts** (analytics charts)
- **Lucide React** (icons)

---

## 🚀 Installation

```bash
# Clone the project
git clone https://github.com/yourusername/voltwatch.git
cd voltwatch

# Install dependencies
npm install

# Start dev server
npm run dev
# Visit: http://localhost:5173
```

### Login Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | volt2024  |
| Demo  | demo     | demo123   |

---

## 🧠 System Logic

- **Battery drain**: `total_load / 5000Wh / 36` per 2s tick
- **Backup time**: `(battery% / 100) × 5000Wh / load × 60 mins`
- **Auto-switch**: Grid ON → charge; Grid OFF → inverter; Battery 0% → generator fallback

---

## 📁 Structure

```
src/
├── context/AppContext.jsx      # Global state + simulation engine
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── DevicesPage.jsx
│   ├── AnalyticsPage.jsx
│   └── SettingsPage.jsx
├── components/
│   ├── Layout.jsx
│   ├── BatteryGauge.jsx
│   └── ToastContainer.jsx
└── data/initialData.js
```

---

## 🔮 Future Improvements

- IoT integration (Arduino / ESP32 via MQTT)
- Real inverter connectivity (Felicity, Victron, Luminous)
- Mobile app version (React Native)
- Energy cost tracking in NGN
- Solar panel monitoring (PV input)
- PDF/CSV report export

---

## 👨‍💻 Author

**Goodness Emmanuel** — Front-End Developer

*VoltWatch — Know your power. Control your home.*
