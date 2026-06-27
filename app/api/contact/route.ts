import { NextResponse } from "next/server";
import { Resend } from "resend";
import { content } from "@/lib/content";

export const runtime = "nodejs";

interface Payload {
  name?: string;
  email?: string;
  type?: string;
  brief?: string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const type = (body.type ?? "").trim();
  const brief = (body.brief ?? "").trim();

  if (!name || !email || !isEmail(email)) {
    return NextResponse.json({ error: "Please add your name and a valid email." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet (no secret in this environment). Fail clearly rather
    // than pretending it sent. Set RESEND_API_KEY (+ optional CONTACT_FROM) to enable.
    return NextResponse.json(
      { error: "Email isn't configured yet. Reach out at " + content.contact.email + " directly." },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM ?? "Aethel Labs <onboarding@resend.dev>",
      to: [content.contact.email],
      replyTo: email,
      subject: `New project enquiry — ${type || "general"} — ${name}`,
      text: [
        `Name:  ${name}`,
        `Email: ${email}`,
        `Need:  ${type || "(unspecified)"}`,
        "",
        brief || "(no brief)",
      ].join("\n"),
    });
    if (error) {
      return NextResponse.json({ error: "Could not send right now. Try again, or email directly." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send right now. Try again, or email directly." }, { status: 502 });
  }
}
