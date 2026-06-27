"use client";
import { useState } from "react";
import { Input, Select, Textarea, Button, Card } from "@/components/ui";

const NEEDS = ["Brand Identity", "Landing Page", "Website", "Content Engine", "Not sure yet"];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", type: NEEDS[0], brief: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Phase 5 wires this to /api/contact (Resend). For now it confirms locally.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Card padding="lg">
      {submitted ? (
        <div style={{ minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ember-500)" strokeWidth="2">
              <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 style={{ marginTop: "var(--space-5)", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, letterSpacing: "-0.02em" }}>Sent. Talk soon.</h3>
          <p style={{ marginTop: "var(--space-2)", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
            Thanks, {form.name || "friend"} — I&apos;ll reply within a day.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <Input label="Name" placeholder="Your name" value={form.name} onChange={set("name")} id="c-name" required />
            <Input label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} id="c-email" required />
          </div>
          <Select label="What do you need?" options={NEEDS} value={form.type} onChange={set("type")} id="c-type" />
          <Textarea label="Tell me about it" rows={4} placeholder="A new brand, a site that's overdue, a feed that's gone quiet…" value={form.brief} onChange={set("brief")} id="c-brief" />
          <div style={{ marginTop: "var(--space-1)" }}>
            <Button variant="primary" size="lg" type="submit">Start a project</Button>
          </div>
        </form>
      )}
    </Card>
  );
}
