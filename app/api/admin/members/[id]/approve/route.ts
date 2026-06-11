import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    const { id } = await params;

    const approvedUser = await User.findByIdAndUpdate(
       id,
      {
        $set: {
            isActive: true,
            approvedBy: session.user.id,
            approvedAt: new Date()
        }
      },
      { new: true }
    ).select("-passwordHash");

    if (!approvedUser) {
        return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    return NextResponse.json(approvedUser);
  } catch (error: any) {
    console.error("Approve member error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
