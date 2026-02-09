"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Banner, Button, Card, H1, Input, Muted } from "@/components/ui";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!email.includes("@")) return setMsg("Please enter a valid email.");
    if (!password) return setMsg("Please enter your password.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMsg(data?.error || "Invalid email or password.");
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: "grid", gap: 14, maxWidth: 520, margin: "48px auto 0" }}>
      <H1>Sign in</H1>
      <Muted>Welcome back to EverVault.</Muted>

      <Card>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          {msg && <Banner tone="error">{msg}</Banner>}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 14 }}>
            <a href="/forgot-password">Forgot password?</a>
            <a href="/sign-up">Create account</a>
          </div>
        </form>
      </Card>
    </main>
  );
}
