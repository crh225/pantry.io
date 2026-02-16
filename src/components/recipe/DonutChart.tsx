import React, { memo } from 'react';

interface Props { percent: number; size?: number; }

const getMatchColor = (percent: number): string => {
  if (percent >= 75) return '#4CAF50'; // green
  if (percent >= 50) return '#FFC107'; // yellow
  return 'rgba(255,255,255,0.5)'; // light white/gray for low match
};

export const DonutChart = memo<Props>(({ percent, size = 44 }) => {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const center = size / 2;
  const strokeColor = getMatchColor(percent);

  return (
    <div className="donut-overlay">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={r} fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.2)"
          strokeWidth="3" />
        <circle cx={center} cy={center} r={r} fill="none" stroke={strokeColor} strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`} />
        <text x={center} y={center} textAnchor="middle" dy="0.35em"
          fill="white" fontSize="10" fontWeight="700">
          {percent}
        </text>
      </svg>
    </div>
  );
});

DonutChart.displayName = 'DonutChart';
