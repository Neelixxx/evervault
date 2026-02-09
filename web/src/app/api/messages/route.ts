import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

async function requireUserId() {
 const cookieStore = await cookies();
const token = cookieStore.get("ev_session")?.value;

  if (!token) return null;
  try {
    const payload = await verifySessionToken(token);
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const messages = await prisma.vaultMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return Response.json({ ok: true, messages });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const text = String(body.body ?? "").trim();

  if (!title || !text) {
    return Response.json(
      { ok: false, error: "Title and body are required." },
      { status: 400 }
    );
  }

  const message = await prisma.vaultMessage.create({
    data: { title, body: text, userId },
  });

  return Response.json({ ok: true, message });
}

