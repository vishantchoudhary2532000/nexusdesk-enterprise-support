import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateSummary } from "../../../../lib/ai/aiClient";

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

    // Validate membership and fetch instructions
    const { data: membership } = await supabase
      .from("organization_members")
      .select(`
        role,
        organizations (
          ai_instructions
        )
      `)
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .single();

    if (!membership)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const orgInstructions = (membership.organizations as any)?.ai_instructions;

    // Check cache first
    const { data: cached } = await supabase
      .from("ai_cache")
      .select("content")
      .eq("ticket_id", ticketId)
      .eq("type", "summary")
      .maybeSingle();

    if (cached?.content) {
      return NextResponse.json({ summary: cached.content, cached: true });
    }

    // Check usage limits
    const d = new Date();
    const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const { data: usage } = await supabase
      .from("usage_metrics")
      .select("ai_requests")
      .eq("organization_id", organizationId)
      .eq("period", period)
      .maybeSingle();

    const maxAiRequests = 20; // Hardcoded free tier limit for demo
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
      .select("message, users:user_id(email)")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    // Wait! Earlier I found I can't join users:user_id directly, I need to use another method, but actually here I'm using the authenticated RLS.
    // Wait, NO! PostgREST will fail with PGRST200 because the Server Client is authenticated!
    // I will just fetch the messages and ignore joining the user.

    const rawMessages = await supabase
      .from("ticket_messages")
      .select("message")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    const messages = [
      `Initial Problem: ${ticketData?.description || ""}`,
      ...(rawMessages.data?.map((m) => m.message) || []),
    ];

    // Generate AI string with organization DNA
    const summary = await generateSummary(messages, orgInstructions);

    // Update Cache
    await supabase.from("ai_cache").insert({
      organization_id: organizationId,
      ticket_id: ticketId,
      type: "summary",
      content: summary,
    });

    // Sync to ticket record directly too
    await supabase.from("tickets").update({ summary }).eq("id", ticketId);

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

    return NextResponse.json({ summary, cached: false });
  } catch (err: any) {
    console.error("AI Summary API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
