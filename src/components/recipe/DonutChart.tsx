import React, { memo } from 'react';

interface Props { percent: number; size?: number; }

export const DonutChart = memo<Props>(({ percent, size = 44 }) => {
  const r = Math.max(8, (size / 2) - 6);
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const center = size / 2;
  const fontSize = Math.max(10, Math.round(size * 0.2));
  const color = percent >= 75 ? '#22c55e' : percent >= 50 ? '#eab308' : 'white';

  return (
    <div className="donut-overlay">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={r} fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.2)"
          strokeWidth="3" />
        <circle cx={center} cy={center} r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`} />
        <text x={center} y={center} textAnchor="middle" dy="0.35em"
          fill="white" fontSize={fontSize} fontWeight="700">
          {percent}
        </text>
      </svg>
    </div>
  );
});

DonutChart.displayName = 'DonutChart';
