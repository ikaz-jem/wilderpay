import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

import dbConnect from "@/app/lib/db";
import Deposit from "@/app/models/depositSchema/depositSchema";
import withdrawSchema from "@/app/models/withdrawSchema/withdrawSchema";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json(
      { success: false, message: "Not Authorized" },
      { status: 400 }
    );
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const userId = session?.user?.id || searchParams.get("id");
  const depositType = searchParams.get("type"); // Get the filter from query
  const currencytType = searchParams.get("currency"); // Get the filter from query

  if (!userId) {
    return Response.json(
      { success: false, message: "Missing user ID" },
      { status: 400 }
    );
  }

  try {
    // Build dynamic filter

    const query = { user: userId };

    if (depositType == "withdrawals") {
      const withdrawals = await withdrawSchema.find(query).sort({ createdAt: -1 }); // Optional: sort by latest

      return Response.json({
        success: true,
        transactions: withdrawals,
      });
    }

    if (depositType) {
      query.depositType = depositType;
    }
    if (currencytType) {
      query.currency = currencytType;
    }

    const deposits = await Deposit.find(query).sort({ createdAt: -1 }); // Optional: sort by latest

    return Response.json({
      success: true,
      transactions: deposits,
    });
  } catch (error) {
    console.error("[ERROR] ", error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
