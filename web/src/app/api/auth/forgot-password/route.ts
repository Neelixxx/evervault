import { prisma } from "@/lib/db";
import { generateResetToken } from "@/lib/tokens";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").toLowerCase().trim();

  // Always respond success to avoid leaking whether an email exists
  if (!email) return Response.json({ ok: true });

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (!user) return Response.json({ ok: true });

  const { token, tokenHash } = generateResetToken();

  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  // MVP: log the reset link in the server console.
  // Later: send via Resend email.
  console.log(`Password reset link: http://localhost:3000/reset-password?token=${token}`);

  return Response.json({ ok: true });
}
