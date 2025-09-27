'use client';
import {
  LineChart, Line, Tooltip, ResponsiveContainer, CartesianGrid,
  XAxis, YAxis, Legend, ReferenceLine
} from 'recharts';

import Loading from '@/app/components/Loading';
import { symbols } from '../../staticData'; // Your symbol mapping

const StakingBreakdownChart = ({ userData }) => {
  if (!userData) return <Loading />;

  const stakingArray = userData?.staking || [];
  const todayPercent = userData?.percentage?.today?.percentage;
  const yesterdayPercent = userData?.percentage?.yesterday?.percentage;

  // Format data with price conversion if available
  const chartData = stakingArray.map(stake => {
    const priceInfo = userData?.prices?.find(p => p.symbol === symbols[stake.currency]);
    const convertedAmount = priceInfo ? stake.amount * priceInfo.price : stake.amount;

    return {
      label: `${stake.currency.toUpperCase()}-${stake.duration}d`,
      amount: convertedAmount,
      rawAmount: stake.amount,
      currency: stake.currency.toUpperCase(),
      unlocked: !stake.isLocked,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center border border-accent/10 rounded bg-card text-xs">
        <p>
        No Investement data available 
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-72 rounded border border-accent/10 bg-card p-4 relative">
      <p className="text-xs text-center mb-2 font-semibold">Staking Breakdown</p>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 40, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--primary)', fontSize: '0.6rem' }}
          />

          {/* Left Y-axis for staking amount (converted) */}
          <YAxis
            yAxisId="left"
            tick={{ fill: 'var(--primary)', fontSize: '0.5rem' }}
            allowDecimals={true}
            domain={['auto', 'auto']}
            tickFormatter={(val) => `$${val.toLocaleString(undefined, {maximumFractionDigits:2})}`}
          />

          {/* Right Y-axis for percentages */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: 'var(--primary)', fontSize: '0.6rem' }}
            domain={[0, Math.max(todayPercent ?? 1, yesterdayPercent ?? 1, 1)]}
            tickFormatter={(tick) => `${tick}%`}
          />

          <Tooltip
            content={({ payload, label }) => {
              if (!payload || !payload.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-background text-xs p-2 rounded border border-white/20 backdrop-blur-md text-white max-w-xs">
                  <p className="font-semibold mb-1">{label}</p>
                  <p>Amount: {data.rawAmount} {data.currency}</p>
                  <p>Value: ${data.amount.toLocaleString(undefined, {maximumFractionDigits:2})}</p>
                  <p>Status: {data.unlocked ? 'Unlocked' : 'Locked'}</p>
                </div>
              );
            }}
          />

          <Legend verticalAlign="top" height={36} />

          {/* Reference lines for percentages */}
          {todayPercent != null && (
            <ReferenceLine
              y={todayPercent}
              yAxisId="right"
              stroke="#10b981"
              label={{ value: `Today Est. ${todayPercent}%`, position: 'right', fill: '#10b981', fontSize: 10 }}
              strokeDasharray="3 3"
            />
          )}
          {yesterdayPercent != null && (
            <ReferenceLine
              y={yesterdayPercent}
              yAxisId="right"
              stroke="#f59e0b"
              label={{ value: `Yesterday Est. ${yesterdayPercent}%`, position: 'right', fill: '#f59e0b', fontSize: 10 }}
              strokeDasharray="3 3"
            />
          )}

          {/* Line for amount */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="amount"
            stroke="var(--highlight)"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            name="Amount (USD)"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StakingBreakdownChart;
