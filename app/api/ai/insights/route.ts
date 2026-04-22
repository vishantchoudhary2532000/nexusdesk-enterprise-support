import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateInsights } from "../../../../lib/ai/aiClient";

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

    // Fetch messages for insights
    const { data: messagesData } = await supabase
      .from("ticket_messages")
      .select("message")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    const messages = messagesData?.map((m) => m.message) || [];

    // Generate insights securely on the server
    const insights = await generateInsights(messages, organizationId, orgInstructions);

    return NextResponse.json({ insights });
  } catch (err: any) {
    console.error("AI Insights API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
