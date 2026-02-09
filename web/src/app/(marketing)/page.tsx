export default function HomePage() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, fontWeight: 700 }}>EverVault</h1>
      <p style={{ marginTop: 12, fontSize: 18 }}>
        Secure messages and digital legacy notes, released when it matters.
      </p>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <a href="/sign-up">Get started</a>
        <a href="/pricing">Pricing</a>
        <a href="/dashboard">Dashboard</a>
      </div>
    </main>
  );
}
