'use client';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import BorderEffect from '../BorderEffect/BorderEffect';
import Loading from '@/app/components/Loading';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#14b8a6'];

const AssetDistributionChart = ({ user }) => {
  const data = formatAssetData(user);

  if (!user) return <Loading />;

  if (user.totalValue == 0) {
    return (
      <div className='flex flex-col gap-3 w-full'>
        <div className="w-full h-96 rounded-xl border border-accent/10 py-5 relative overflow-hidden backdrop-blur-xl">
          {/* <BorderEffect /> */}
          <div className='flex items-center justify-center w-full h-full'>
            <p className='text-xs'>Your Wallet Is Empty! Start By Making A Deposit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 w-full'>
      <div className="w-full h-96 rounded-xl border border-accent/10 py-5 bg-card relative overflow-hidden backdrop-blur-xl">
        {/* <BorderEffect /> */}

        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#ffffff33" />
            <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--primary)', fontSize: '0.75rem' }} />
            
            <Tooltip
              formatter={(value, name) => [`$${value}`, name]}
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #ffffff44',
                color: '#fff',
                backdropFilter: 'blur(6px)',
                fontSize: '0.75rem',
              }}
              labelStyle={{ color: '#fff', fontSize: '0.75rem' }}
              itemStyle={{ color: '#fff', fontSize: '0.75rem' }}
            />

            <Radar
              name="Assets"
              dataKey="value"
              stroke={COLORS[0]}
              fill={COLORS[0]}
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function formatAssetData(user) {
  return user.balances
    ?.filter((b) => b.convertedAmount > 0)
    ?.map((b) => ({
      name: b.currency.toUpperCase(),
      value: parseFloat(Number(b.convertedAmount).toFixed(2)),
    }));
}

export default AssetDistributionChart;
