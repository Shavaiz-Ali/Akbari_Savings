import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    const members = await User.find({ role: "member" }).select("-passwordHash").sort({ createdAt: -1 });

    return NextResponse.json(members);
  } catch (error: any) {
    console.error("GET members error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    const { fullName, email, password, monthlyTarget } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: "member",
      isActive: true,
      monthlyTarget: monthlyTarget || 0,
      createdBy: session.user.id,
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error("POST member error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
