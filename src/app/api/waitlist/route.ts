import { NextRequest, NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toE164 = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const hasLeadingPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/[^\d+]/g, "");

  if (!digitsOnly) return null;

  if (hasLeadingPlus) {
    return `+${digitsOnly.replace(/^\+/, "")}`;
  }

  const justDigits = digitsOnly.replace(/\D/g, "");

  if (!justDigits) return null;

  if (justDigits.length === 10) {
    return `+1${justDigits}`;
  }

  return `+${justDigits}`;
};

export async function POST(request: NextRequest) {
  const listId = process.env.KLAVIYO_LIST_ID;
  const apiKey = process.env.KLAVIYO_API_KEY;

  if (!listId || !apiKey) {
    return NextResponse.json(
      { error: "Klaviyo is not configured. Please try again later." },
      { status: 500 }
    );
  }

  try {
    const {
      email,
      phoneNumber,
      smsOptIn,
    }: { email?: string; phoneNumber?: string; smsOptIn?: boolean } =
      await request.json();

    // ✅ Validate email
    if (!email || !emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // ✅ Normalize phone number
    let normalizedPhone: string | null = null;
    if (phoneNumber) {
      normalizedPhone = toE164(phoneNumber);
      if (!normalizedPhone) {
        return NextResponse.json(
          {
            error:
              "Please enter a valid phone number (include country code if outside the US).",
          },
          { status: 400 }
        );
      }
    }

    // 1️⃣ Create or update the profile (no subscriptions here)
    const profileResponse = await fetch("https://a.klaviyo.com/api/profiles/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        "Content-Type": "application/json",
        accept: "application/json",
        revision: "2023-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile",
          attributes: {
            email,
            phone_number: normalizedPhone,
            properties: {
              signup_source: "waitlist",
            },
          },
        },
      }),
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok) {
      console.error("Klaviyo profile creation failed:", profileData);
      return NextResponse.json(
        { error: "Failed to create profile in Klaviyo." },
        { status: 502 }
      );
    }

    const profileId = profileData.data.id;

    // 2️⃣ Add the profile to your list
    const listResponse = await fetch(
      `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`,
      {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          "Content-Type": "application/json",
          accept: "application/json",
          revision: "2023-10-15",
        },
        body: JSON.stringify({
          data: [{ type: "profile", id: profileId }],
        }),
      }
    );

    if (!listResponse.ok) {
      const errorData = await listResponse.json();
      console.error("Adding to list failed:", errorData);
      return NextResponse.json(
        { error: "Failed to add user to the waitlist." },
        { status: 502 }
      );
    }

    // 3️⃣ (Optional) Explicitly set email/SMS consent
    if (normalizedPhone && smsOptIn) {
      await fetch(`https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`, {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          "Content-Type": "application/json",
          accept: "application/json",
          revision: "2023-10-15",
        },
        body: JSON.stringify({
          data: {
            type: "profile-subscription-bulk-create-job",
            attributes: {
              subscriptions: [
                {
                  channels: ["sms"],
                  profiles: [{ id: profileId }],
                  consented: true,
                },
              ],
            },
          },
        }),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Klaviyo subscribe unexpected error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
