import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const placeHolder = [
  { date: 'May 1', balance: 1000 },
  { date: 'May 2', balance: 1200 },
  { date: 'May 3', balance: 1250 },
  { date: 'May 4', balance: 1350 },
  { date: 'May 5', balance: 1320 },
  { date: 'May 6', balance: 1400 },
  { date: 'May 7', balance: 1550 },
  { date: 'May 8', balance: 1550 },
  { date: 'May 9', balance: 1550 },
];

const BalanceChart = ({data = placeHolder ,className , showLegend , showDays}) => (
  <div className={`w-full  h-96 rounded-lg border border-primary/10  ${className} `}> {/* no bg or shadow */}
    {/* <h2 className="text-xl font-semibold m-4 !text-neutral">Balance </h2> */}
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor="var(--primary)" stopOpacity={0.8} />
            <stop offset="90%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* semi-transparent grid */}
{showDays &&        <XAxis dataKey="date" stroke="#ffffffaa"  className='text-xs'/>}        {/* <YAxis stroke="#ffffffaa" /> */}
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid #ffffff44',
            color: '#fff',
            backdropFilter: 'blur(6px)',
          }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#4f46e5"
          fillOpacity={1}
          fill="url(#colorBalance)"
        />
        {showLegend && <Legend wrapperStyle={{ color: '#fff' }} />}
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default BalanceChart;
