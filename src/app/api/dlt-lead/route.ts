import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KIT_API_BASE = "https://api.kit.com/v4";
const DLT_TAG_NAME = "dlt-law-lead";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.KIT_API_KEY;
    if (!apiKey) {
      console.error("[dlt-lead] KIT_API_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, company, message, source } = body;

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

    // Step 1: Create subscriber with custom fields
    const subRes = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({
        email_address: trimmed,
        first_name: name || undefined,
        fields: {
          company: company || "",
          dlt_message: message || "",
          lead_source: source || "sec-cftc-guidance-page",
          referrer: "dudu.bitcoin",
        },
      }),
    });

    if (!subRes.ok) {
      const errorData = await subRes.json().catch(() => null);

      if (subRes.status === 401) {
        console.error("[dlt-lead] Kit API auth failed — check KIT_API_KEY");
        return NextResponse.json(
          { success: false, error: "Server configuration error." },
          { status: 500 }
        );
      }

      if (subRes.status === 422) {
        const msg = errorData?.errors?.[0] ?? "Invalid email address.";
        return NextResponse.json(
          { success: false, error: msg },
          { status: 400 }
        );
      }

      console.error("[dlt-lead] Kit API error:", subRes.status, errorData);
      return NextResponse.json(
        { success: false, error: "Submission failed. Please try again." },
        { status: 502 }
      );
    }

    const subData = await subRes.json();
    const subscriberId = subData?.subscriber?.id;

    // Step 2: Find or create the dlt-law-lead tag
    if (subscriberId) {
      // List tags to find our tag ID
      const tagsRes = await fetch(`${KIT_API_BASE}/tags?per_page=100`, {
        headers: { "X-Kit-Api-Key": apiKey },
      });

      let tagId: string | null = null;

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        const existing = tagsData?.tags?.find(
          (t: { name: string }) => t.name === DLT_TAG_NAME
        );
        tagId = existing?.id || null;
      }

      // Create tag if it doesn't exist
      if (!tagId) {
        const createTagRes = await fetch(`${KIT_API_BASE}/tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Kit-Api-Key": apiKey,
          },
          body: JSON.stringify({ name: DLT_TAG_NAME }),
        });

        if (createTagRes.ok) {
          const newTag = await createTagRes.json();
          tagId = newTag?.tag?.id || null;
        }
      }

      // Tag the subscriber
      if (tagId) {
        await fetch(`${KIT_API_BASE}/tags/${tagId}/subscribers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Kit-Api-Key": apiKey,
          },
          body: JSON.stringify({ email_address: trimmed }),
        });
      }
    }

    return NextResponse.json(
      { success: true, message: "Lead submitted successfully!" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
