"use client"

import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

const RADIAN = Math.PI / 180;

const MIN = 0.2;
const MAX = 1;

function scaleToChartRange(value) {
  return ((value - MIN) / (MAX - MIN)) * 100;
}

const renderNeedle = ({ value, cx, cy, iR, oR, color }) => {
  const angle = 180 * (1 - value / 100);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * angle);
  const cos = Math.cos(-RADIAN * angle);
  const r = 3;
  const x0 = cx;
  const y0 = cy;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key="needle-base" cx={x0} cy={y0} r={r} fill={color} />,
    <path
      key="needle"
      d={`M${xba},${yba} L${xbb},${ybb} L${xp},${yp} Z`}
      fill={color}
    />
  ];
};

export default function TodayYesterdayMeter({ today=0.6, yesterday }) {
  const scaledToday = scaleToChartRange(today);

  const chartData = [
    { name: 'Low', value: 25, color: '#f87171' },
    { name: 'Medium', value: 25, color: '#facc15' },
    { name: 'High', value: 50, color: '#4ade80' },
  ];

  const cx = 60;
  const cy = 70;
  const iR = 25;
  const oR = 40;

  return (
    <div style={{ width: 120, textAlign: 'center', fontFamily: 'sans-serif', fontSize: 10 }}>
      <PieChart width={120} height={90}>
        <Pie
          data={chartData}
          startAngle={180}
          endAngle={0}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {renderNeedle({ value: scaledToday, cx, cy, iR, oR, color: '#2563eb' })}
      </PieChart>
      <div style={{ marginTop:1, lineHeight: 1 }}>
        <p><span>Today:</span> {(today).toFixed(2)}%</p>
      </div>
    </div>
  );
}
