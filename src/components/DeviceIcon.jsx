import React from 'react';
import { Cpu, Fan, Laptop2, Lightbulb, Refrigerator, Snowflake, Tv } from 'lucide-react';

const iconMap = {
  fan: Fan,
  tv: Tv,
  refrigerator: Refrigerator,
  snowflake: Snowflake,
  lightbulb: Lightbulb,
  laptop: Laptop2,
};

export default function DeviceIcon({ name, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  const Icon = iconMap[name] || Cpu;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
