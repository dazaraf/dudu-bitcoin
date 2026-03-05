import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const KIT_API_BASE = "https://api.kit.com/v4";
const KIT_FORM_ID = "9127940";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.KIT_API_KEY;
    if (!apiKey) {
      console.error("[subscribe] KIT_API_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const trimmed = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmed)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Step 1: Create subscriber via Kit v4 API
    const subRes = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({ email_address: trimmed }),
    });

    if (!subRes.ok) {
      const errorData = await subRes.json().catch(() => null);

      if (subRes.status === 401) {
        console.error("[subscribe] Kit API auth failed — check KIT_API_KEY");
        return NextResponse.json(
          { success: false, error: "Server configuration error." },
          { status: 500 }
        );
      }

      if (subRes.status === 422) {
        const message = errorData?.errors?.[0] ?? "Invalid email address.";
        return NextResponse.json(
          { success: false, error: message },
          { status: 400 }
        );
      }

      console.error("[subscribe] Kit API error:", subRes.status, errorData);
      return NextResponse.json(
        { success: false, error: "Subscription failed. Please try again." },
        { status: 502 }
      );
    }

    // Step 2: Add subscriber to form (triggers automations)
    const formRes = await fetch(
      `${KIT_API_BASE}/forms/${KIT_FORM_ID}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kit-Api-Key": apiKey,
        },
        body: JSON.stringify({ email_address: trimmed }),
      }
    );

    if (!formRes.ok) {
      const formError = await formRes.json().catch(() => null);
      console.error("[subscribe] Failed to add to form:", formRes.status, formError);
      // Non-fatal: subscriber was still created
    }

    return NextResponse.json(
      { success: true, message: "Subscribed successfully!" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
