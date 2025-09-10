// app/api/announcements/route.ts
import { NextResponse } from "next/server";
import Announcement from "@/app/models/announcementSchema/announcementSchema";
import dbConnect from "@/app/lib/db";

export async function GET(req) {
 

  const site = await req.headers.get("sec-fetch-site");
  if (site !=="same-origin") {
 return  Response.json({ success: false, message: "Forbiden 403" });  }

await dbConnect()
  const now = new Date();

const announcements = await Announcement.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ priority: -1, createdAt: -1 });


  // const announcements = [
  //   {
  //     id: "2025-maintenance-01",
  //     message: "🚨 Scheduled maintenance this Friday at 10 PM.",
  //     startDate: "2025-08-20T00:00:00Z",
  //     endDate: "2025-08-23T00:00:00Z",
  //   },
  // ];
  return Response.json(announcements);
}



// export async function POST() {

// await dbConnect()

// const announcements = [
//   {
//     id: "2025-maintenance-01",
//     message: "🚨 Scheduled maintenance this Friday at 10 PM.",
//     startDate: "2025-08-20T00:00:00Z",
//     endDate: "2025-08-23T00:00:00Z",
//     priority:"low"
//   },
// ];
// const newAnn = await Announcement.create({
//     id: "2025-maintenance-01",
//     message: "🚨 Scheduled maintenance this Friday at 10 PM.",
//     startDate: "2025-08-20T00:00:00Z",
//     endDate: "2025-08-23T00:00:00Z",
//   },)


//   return Response.json(announcements);
// }


