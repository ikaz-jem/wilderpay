'use client';

import ButtonPrimary from '@/app/components/ButtonPrimary';
import React, { useEffect, useState } from 'react';

export default function SaleCountdown({ start: startTime = 1764180736, end: endTime=1766768986 }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('before');



 

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);

      if (!startTime || !endTime) return;

      if (now < Number(startTime)) {
        setTimeLeft(Number(startTime) - now);
        setStatus('before');
      } else if (now >= Number(startTime) && now < Number(endTime)) {
        setTimeLeft(Number(endTime) - now);
        setStatus('ongoing');
      } else {
        setTimeLeft(0);
        setStatus('ended');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d.toString().padStart(2, '0')}d : ${h
      .toString()
      .padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s
        .toString()
        .padStart(2, '0')}s`;
  };

  return (
    <div className='text-center '>
      {status === 'before' && <p className='text-lg font-semibold'>🚀 Contest starts in: {formatTime(timeLeft)}</p>}
      {status === 'ongoing' && <p className='text-lg font-semibold'>  <p className='text-lg font-semibold capitalize !text-green-500'> Contest Is Live 🔥🚀 </p>
        {status === 'ongoing' && <p className='text-lg font-semibold'>{formatTime(timeLeft)}</p>}
        {status === 'ended' && <p className='text-lg font-semibold'>❌ Contest has ended</p>}
        </p>}


    </div>
  );
}
