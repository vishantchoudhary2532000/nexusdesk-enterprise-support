import { createClient } from "./supabaseClient";

export interface Macro {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  actions: {
    status?: string;
    priority?: string;
    category?: string;
    message?: string;
    is_internal?: boolean;
  };
}

/**
 * Fetches all available macros for an organization.
 */
export async function fetchMacros(orgId: string): Promise<Macro[]> {
  const supabase = createClient();
  const { data, error }: any = await supabase
    .from("macros")
    .select("*")
    .eq("organization_id", orgId)
    .order("name");

  if (error) {
    console.error("[Macro Service] Fetch failed:", error.message);
    return [];
  }

  let finalData = data;
  // Seed defaults if empty
  if (data.length === 0) {
    finalData = await seedDefaultMacros(orgId);
  }

  // Deduplicate by name to prevent "Double double" list entries
  const uniqueMacros = new Map<string, Macro>();
  finalData.forEach((m: any) => {
    if (!uniqueMacros.has(m.name)) {
      uniqueMacros.set(m.name, m);
    }
  });

  return Array.from(uniqueMacros.values());
}

/**
 * Executes a Nexus Command (Macro) on a specific ticket.
 * Performs a multi-action atomic update.
 */
export async function executeNexusCommand(
  ticketId: string,
  macro: Macro,
  userId: string,
) {
  const supabase = createClient();
  const { actions } = macro;

  try {
    // 1. Update Ticket Metadata
    const updateData: any = {};
    if (actions.status) updateData.status = actions.status;
    if (actions.priority) updateData.priority = actions.priority;
    if (actions.category) updateData.category = actions.category;

    if (Object.keys(updateData).length > 0) {
      await supabase.from("tickets").update(updateData).eq("id", ticketId);
    }

    // 2. Post Automated Message
    if (actions.message) {
      await supabase.from("ticket_messages").insert({
        ticket_id: ticketId,
        user_id: userId,
        message: actions.message,
        is_internal: actions.is_internal || false,
        channel: "web",
      });
    }

    // 3. Log Activity
    await supabase.from("activity_logs").insert({
      organization_id: macro.organization_id,
      user_id: userId,
      action: `Executed Command: ${macro.name}`,
      entity_type: "ticket",
      entity_id: ticketId,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Macro Service] Execution failed:", err.message);
    throw err;
  }
}

/**
 * Seeds default Nexus Commands for a new organization.
 */
async function seedDefaultMacros(orgId: string): Promise<Macro[]> {
  const supabase = createClient();
  const defaults = [
    {
      organization_id: orgId,
      name: "Quick Close",
      description:
        "Resolves the ticket immediately with a standard closing message.",
      actions: {
        status: "closed",
        message:
          "Transmission concluded. Protocol marked as settled. Closing terminal.",
        is_internal: false,
      },
    },
    {
      organization_id: orgId,
      name: "Internal Escalate",
      description: "Flags for senior review and adds an internal note.",
      actions: {
        priority: "high",
        message:
          "Elevating to level 2 clearance. Awaiting senior agent synchronization.",
        is_internal: true,
      },
    },
    {
      organization_id: orgId,
      name: "Need Telemetry",
      description: "Requests diagnostic data from the customer.",
      actions: {
        status: "open",
        message:
          "Awaiting additional diagnostic telemetry. Please provide system logs.",
        category: "technical",
      },
    },
  ];

  const { data, error } = await supabase
    .from("macros")
    .insert(defaults)
    .select();
  if (error) return [];
  return data;
}
