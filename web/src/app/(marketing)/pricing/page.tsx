export default function PricingPage() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>Pricing</h1>
      <p style={{ marginTop: 12 }}>
        EverVault is a paid product. Start with a free trial (optional).
      </p>

      <ul style={{ marginTop: 16 }}>
        <li>✅ Vault messages</li>
        <li>✅ Secure storage</li>
        <li>✅ Dashboard</li>
        <li>✅ Subscription access</li>
      </ul>

      <div style={{ marginTop: 24 }}>
        <a href="/sign-up">Create account</a>
      </div>
    </main>
  );
}
