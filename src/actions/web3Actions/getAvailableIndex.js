"use server"
import IndexCounter from '@/app/models/IndexCounterSchema/IndexCounterSchema';


import dbConnect from '@/app/lib/db';
export async function getNextAvailableIndex() {
    await dbConnect()
  const counter = await IndexCounter.findOneAndUpdate(
    { name: 'walletIndex' },
    { $inc: { value: 1 } },
    { new: true, upsert: true } // creates the counter if not exists
  );
  return counter.value;
}