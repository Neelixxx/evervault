"use client";

import { useEffect, useState } from "react";
import { Banner, Button, Card, H1, Input, Textarea, Divider } from "@/components/ui";
import { BodyText} from "@/components/ui";

type Msg = { id: string; title: string; body: string; createdAt: string };

export default function DashboardPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Please add a title.");
    if (!body.trim()) return setError("Please write a message.");

    setSaving(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) return setError(data?.error || "Failed to save message");

      setTitle("");
      setBody("");
      await loadMessages();
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <H1>Dashboard</H1>

      <Card>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>New Vault Message</div>
        <form onSubmit={create} style={{ display: "grid", gap: 10 }}>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={saving} />
          <Textarea
            placeholder="Write your message..."
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={saving}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <div style={{ fontSize: 13, opacity: 0.75 }}>
              Your message is private and tied to your account.
            </div>
          </div>
          {error && <Banner tone="error">{error}</Banner>}
        </form>
      </Card>

      <Divider />

      <div style={{ fontWeight: 800 }}>Saved messages</div>

      {loading ? (
        <div style={{ opacity: 0.75 }}>Loading…</div>
      ) : messages.length === 0 ? (
        <Banner tone="info">No messages yet. Write your first vault message above.</Banner>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {messages.map((m) => (
            <Card key={m.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 800 }}>{m.title}</div>
                <div style={{ fontSize: 12, opacity: 0.65 }}>
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
              <BodyText>
                <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div> 
            </BodyText>
          
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
