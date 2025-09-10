// components/CompoundingCalculator.tsx
'use client';

import { useState, useMemo } from 'react';
import BalanceChart from '../charts/BalanceChart';


const CompoundCalculator = () => {
  const [initial, setInitial] = useState(1500);
  const [days, setDays] = useState(60);
  const [rate, setRate] = useState(2); // daily rate in %

  const data = useMemo(() => {
    const points = [];
    let balance = initial;
    for (let i = 0; i <= days; i++) {
      points.push({
        date: `Day ${i}`,
        balance: Number(balance.toFixed(2)),
      });
      balance *= 1 + rate / 100;
    }
    return points;
  }, [initial, days, rate]);

  return (
    <div className="w-full space-y-6 px-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral mb-1">Initial Amount ($)</label>
          <input
            type="number"
            value={initial}
            onChange={(e) => setInitial(Number(e.target.value))}
            className="w-full rounded-lg border border-primary/20 bg-transparent px-4 py-2 text-neutral"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral mb-1">Days</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full rounded-lg border border-primary/20 bg-transparent px-4 py-2 text-neutral"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral mb-1">Daily Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full rounded-lg border border-primary/20 bg-transparent px-4 py-2 text-neutral"
          />
        </div>
      </div>

      <BalanceChart data={data} />
    </div>
  );
};

export default CompoundCalculator;
