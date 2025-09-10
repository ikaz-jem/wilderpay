import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST () {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json(
      { success: false, message: "Not Authorized" },
      { status: 400 }
    );
}
return Response.json('success')

}