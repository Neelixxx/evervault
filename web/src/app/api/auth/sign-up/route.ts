import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createSessionToken } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");

  if (!email || password.length < 8) {
    return Response.json(
      { ok: false, error: "Email and password (8+ chars) required." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ ok: false, error: "Email already in use." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed },
    select: { id: true, email: true },
  });

const token = await createSessionToken({ userId: user.id });

const cookieStore = await cookies();
cookieStore.set("ev_session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});



  return Response.json({ ok: true, user });
}
