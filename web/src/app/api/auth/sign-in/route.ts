import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return Response.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  


  if (!user) {
    return Response.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);

  


  if (!match) {
    return Response.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createSessionToken({ userId: user.id });

  const cookieStore = await cookies();
  cookieStore.set("ev_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ ok: true });
}
