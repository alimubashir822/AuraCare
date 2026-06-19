import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("user-session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decodedSession = JSON.parse(
      Buffer.from(sessionCookie, "base64").toString("utf-8")
    );

    return NextResponse.json({
      authenticated: true,
      user: decodedSession,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Fetch user and include profile details based on role
    const user = await db.user.findUnique({
      where: { email },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Accept simple demo verification
    // (For a developer portfolio, we support mock credentials or matching hash)
    if (password !== "password" && user.passwordHash !== "demo_hash_password_123") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Determine associated ID based on role
    let profileId = null;
    if (user.role === "PATIENT") {
      profileId = user.patient?.id || null;
    } else if (user.role === "DOCTOR") {
      profileId = user.doctor?.id || null;
    }

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profileId,
    };

    const sessionString = Buffer.from(JSON.stringify(sessionData)).toString("base64");

    const response = NextResponse.json({
      success: true,
      user: sessionData,
    });

    // Set secure HTTP-only cookie
    response.headers.append(
      "Set-Cookie",
      `user-session=${sessionString}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}` // 7 days
    );

    return response;
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  // Clear cookie
  response.headers.append(
    "Set-Cookie",
    `user-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
  return response;
}
