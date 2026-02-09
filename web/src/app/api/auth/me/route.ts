import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ev_session")?.value;

  if (!token) return Response.json({ ok: true, user: null });

  try {
    const payload = await verifySessionToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, createdAt: true },
    });
    return Response.json({ ok: true, user });
  } catch {
    return Response.json({ ok: true, user: null });
  }
}
