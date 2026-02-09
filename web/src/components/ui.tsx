import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>{children}</div>;
}

export function HeaderRow({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div>{left}</div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,.12)",
        borderRadius: 14,
        padding: 16,
        background: "white",
        boxShadow: "0 1px 8px rgba(0,0,0,.04)",
      }}
    >
      {children}
    </div>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{children}</h1>;
}

export function Muted({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 14, opacity: 0.75 }}>{children}</div>;
}

export function Divider() {
  return <div style={{ height: 1, background: "rgba(0,0,0,.08)", margin: "16px 0" }} />;
}

export function Banner({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "success" | "info" }) {
  const bg =
    tone === "error" ? "rgba(220, 38, 38, .10)" : tone === "success" ? "rgba(34,197,94,.10)" : "rgba(59,130,246,.10)";
  const fg = tone === "error" ? "rgb(185, 28, 28)" : tone === "success" ? "rgb(21,128,61)" : "rgb(29,78,216)";
  return (
    <div style={{ background: bg, color: fg, padding: 12, borderRadius: 12, border: `1px solid ${fg}33` }}>
      {children}
    </div>
  );
}

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { style, disabled, ...rest } = props;
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,.16)",
        background: disabled ? "rgba(0,0,0,.04)" : "rgba(0,0,0,.02)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
        ...style,
      }}
    />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { style, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,.16)",
        outline: "none",
        width: "100%",
        ...style,
      }}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { style, ...rest } = props;
  return (
    <textarea
      {...rest}
      style={{
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,.16)",
        outline: "none",
        width: "100%",
        resize: "vertical",
        ...style,
      }}
    />
  );
  }

  export function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: "#111",
        fontSize: 15,
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
}

