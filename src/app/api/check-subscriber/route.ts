import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KIT_API_BASE = "https://api.kit.com/v4";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.KIT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { subscribed: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { subscribed: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed)) {
      return NextResponse.json(
        { subscribed: false, error: "Invalid email format." },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${KIT_API_BASE}/subscribers?email_address=${encodeURIComponent(trimmed)}`,
      {
        headers: {
          "X-Kit-Api-Key": apiKey,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ subscribed: false }, { status: 200 });
    }

    const data = await res.json();
    const isSubscribed =
      Array.isArray(data.subscribers) && data.subscribers.length > 0;

    return NextResponse.json({ subscribed: isSubscribed }, { status: 200 });
  } catch {
    return NextResponse.json(
      { subscribed: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
