"use client";

import { useEffect, useState } from "react";
import { Button, HeaderRow, Muted } from "@/components/ui";

export function AppHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json().catch(() => null);
      setEmail(data?.user?.email ?? null);
    })();
  }, []);

  async function signOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    window.location.href = "/sign-in";
  }

  return (
    <HeaderRow
      left={
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>EverVault</div>
          <Muted>Signed in as <b>{email ?? "…"}</b></Muted>
        </div>
      }
      right={<Button onClick={signOut}>Sign out</Button>}
    />
  );
}
