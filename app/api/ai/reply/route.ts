import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateReply } from "../../../../lib/ai/aiClient";

export async function POST(request: Request) {
  try {
    const { ticketId, organizationId } = await request.json();
    if (!ticketId || !organizationId)
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete(name);
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Validate membership
    const { data: membership } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .single();

    if (!membership)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Check usage limits
    const d = new Date();
    const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const { data: usage } = await supabase
      .from("usage_metrics")
      .select("ai_requests")
      .eq("organization_id", organizationId)
      .eq("period", period)
      .maybeSingle();

    const maxAiRequests = 20;
    const currentRequests = usage?.ai_requests || 0;

    if (currentRequests >= maxAiRequests) {
      return NextResponse.json(
        {
          error:
            "Daily AI request limit reached for this organization (20/day).",
        },
        { status: 429 },
      );
    }

    // Fetch ticket context
    const { data: ticketData } = await supabase
      .from("tickets")
      .select("description")
      .eq("id", ticketId)
      .single();

    const { data: messagesData } = await supabase
      .from("ticket_messages")
      .select("message")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    const messages = [
      `Initial Problem: ${ticketData?.description || ""}`,
      ...(messagesData?.map((m) => m.message) || []),
    ];

    // Generate AI string
    const reply = await generateReply(messages);

    // Update Usage Tracker
    if (usage) {
      await supabase
        .from("usage_metrics")
        .update({ ai_requests: currentRequests + 1 })
        .eq("organization_id", organizationId)
        .eq("period", period);
    } else {
      await supabase
        .from("usage_metrics")
        .insert({ organization_id: organizationId, period, ai_requests: 1 });
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("AI Reply API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
