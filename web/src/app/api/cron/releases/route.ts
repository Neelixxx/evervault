import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  // ✅ Secure the endpoint (Vercel will send this automatically if you set CRON_SECRET)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();

  // Find due releases
  const due = await prisma.release.findMany({
    where: {
      status: "SCHEDULED",
      deliverAt: { lte: now },
    },
    orderBy: { deliverAt: "asc" },
    take: 25, // batch size (keep it small)
    include: {
      message: { select: { id: true, title: true, body: true } },
      user: { select: { id: true, email: true } },
    },
  });

  let delivered = 0;
  let skipped = 0;

  for (const r of due) {
    // Idempotency: only deliver if still scheduled at the moment we update it
    const updated = await prisma.release.updateMany({
      where: { id: r.id, status: "SCHEDULED" },
      data: { status: "DELIVERED", deliveredAt: new Date() },
    });

    if (updated.count === 0) {
      skipped++;
      continue;
    }

    delivered++;

    // ✅ MVP "delivery" = log it (next step: send email with Resend)
    console.log("=== EVERVAULT RELEASE DELIVERED ===");
    console.log("To:", r.user.email);
    console.log("Title:", r.message.title);
    console.log("Body:", r.message.body);
    console.log("ReleaseId:", r.id);
  }

  return Response.json({
    ok: true,
    checked: due.length,
    delivered,
    skipped,
    at: now.toISOString(),
  });
}
