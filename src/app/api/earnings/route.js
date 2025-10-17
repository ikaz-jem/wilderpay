import dbConnect from "@/app/lib/db";
import EarningSchema from "@/app/models/EarningSchema/EarningSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { headers } from 'next/headers'


const balance = 5000000;





export async function POST(req, res) {
  const VALID_API_KEY = process.env.CRON_API_KEY;
  const apiKey = (await headers()).get('x-api-key'); // Read API key from header

  if (apiKey !== VALID_API_KEY) {
    return Response.json({ success: false, message: "Unauthorized" });
  }
  
  await dbConnect();
  
  // Generate a random percentage between 0.2 and 0.5
// const percentValue = (Math.random() * (0.3 - 0.2) + 0.2).toFixed(2); // Generates a random float between 0.2 and 0.6
const percentValue = parseFloat((Math.random() * (1 - 0.1) + 0.1).toFixed(2));

  // Calculate profits based on the random percentage
  const profits = (balance * parseFloat(percentValue)) / 100;

  // Get the start and end of the current day (today)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);  // Midnight today

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Just before midnight today

  // Find a record for today
  const existingEarning = await EarningSchema.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  if (existingEarning) {
    // If a record for today exists, update it with the new percentage and profits
    existingEarning.percentage = parseFloat(percentValue);
    existingEarning.profits = profits;
    
    await existingEarning.save();  // Save the updated record
    return Response.json({ success: true, message: "Earning record updated", data: existingEarning });
  } else {
    // If no record for today exists, create a new record
    const earning = await EarningSchema.create({
      profits: profits,
      percentage: parseFloat(percentValue),
    });

    return Response.json({ success: true, message: "Earning record created", data: earning });
  }
}
export async function GET(req, res) {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Access denied !" });


  await dbConnect();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  // Get the one record created today
  const today = await EarningSchema.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  // Yesterday's end
  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999);

  // Find the one record created yesterday
  const yesterday = await EarningSchema.findOne({
    createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
  });

  return Response.json({ percentage: { yesterday, today } });
}




export async function DELETE(req, res) {
   const VALID_API_KEY = process.env.CRON_API_KEY;
  const apiKey = await req.headers["x-api-key"]; // Read API key from header

  if (apiKey !== VALID_API_KEY) {
    return Response.json({ success: false, message: "Unauthorized" });
  }

  await dbConnect();

  // Calculate the date 3 days ago
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  threeDaysAgo.setHours(0, 0, 0, 0); // Set the time to the start of the day

  // Delete records older than 3 days
  const result = await EarningSchema.deleteMany({
    createdAt: { $lt: threeDaysAgo },
  });

  if (result.deletedCount > 0) {
    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} record(s) older than 3 days deleted.`,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "No records older than 3 days found to delete.",
    });
  }
}