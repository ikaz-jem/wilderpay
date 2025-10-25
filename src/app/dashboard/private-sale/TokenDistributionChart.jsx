'use client';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';
import Loading from '@/app/components/Loading';

const COLORS = [
  'url(#colorPresale)',
  'url(#colorPrivateSale)',
  'url(#colorMarketing)',
  'url(#colorStaking)',
  'url(#colorCEX)',
];

const TokenDistributionChart = ({ loading = false }) => {
  if (loading) return <Loading />;

  const data = [
    { name: 'Presale', value: 80 },
    { name: 'Private Sale', value: 5 },
    { name: 'Marketing & Dev', value: 5 },
    { name: 'Staking', value: 5 },
    { name: 'CEX Listing', value: 5 },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="w-full h-96 rounded-xl border border-accent/10 py-5 bg-card relative overflow-hidden backdrop-blur-xl">
                                <p className='mx-5 text-sm'>Total Supply : 1T $WPAY</p>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* --- Gradient Definitions --- */}
            <defs>
              <radialGradient id="colorPresale" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#312e81" stopOpacity={0.8} />
              </radialGradient>
              <radialGradient id="colorPrivateSale" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#a9b981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#064e3b" stopOpacity={0.8} />
              </radialGradient>
              <radialGradient id="colorMarketing" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#78350f" stopOpacity={0.8} />
              </radialGradient>
              <radialGradient id="colorStaking" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.8} />
              </radialGradient>
              <radialGradient id="colorCEX" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0f766e" stopOpacity={0.8} />
              </radialGradient>
            </defs>

            {/* --- Pie Section --- */}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              animationDuration={900}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              {/* Center Label */}
              <Label
                value="Token Distribution "
                position="center"
                fill="#fff"
                fontSize={14}
                fontWeight="600"
              />
            </Pie>

            {/* Tooltip & Legend */}
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: '1px solid #ffffff33',
                color: '#fff',
                backdropFilter: 'blur(8px)',
                fontSize: '0.8rem',
              }}
              labelStyle={{ color: '#fff', fontSize: '0.75rem' }}
              itemStyle={{ color: '#fff', fontSize: '0.75rem' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                color: '#fff',
                fontSize: '0.8rem',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
};

export default TokenDistributionChart;
