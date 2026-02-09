"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Banner, Button, Card, H1, Input, Muted } from "@/components/ui";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!token) return setMsg("Missing token in the URL.");
    if (password.length < 8) return setMsg("Password must be at least 8 characters.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMsg(data?.error || "Reset failed.");
        return;
      }

      setMsg("Password updated. Redirecting to sign in…");
      setTimeout(() => router.push("/sign-in"), 800);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: "grid", gap: 14, maxWidth: 520, margin: "48px auto 0" }}>
      <H1>Reset password</H1>
      <Muted>Create a new password for your account.</Muted>

      <Card>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <Input
            placeholder="New password (8+ characters)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </Button>

          {msg && (
            <Banner tone={msg.toLowerCase().includes("failed") || msg.toLowerCase().includes("invalid") ? "error" : "success"}>
              {msg}
            </Banner>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 14 }}>
            <a href="/sign-in">Back to sign in</a>
            <a href="/forgot-password">Request a new link</a>
          </div>
        </form>
      </Card>
    </main>
  );
}
