"use server";

import { createClient } from "@supabase/supabase-js";

// Use an untyped Supabase client for admin inserts that bypass RLS.
// The typed admin client resolves INSERT on providers to `never`
// because the RLS INSERT policy restricts to auth.uid() = id.
function createUntypedAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function createProviderProfile(data: {
  userId: string;
  email: string;
  internalName: string;
  clientAlias: string;
}) {
  const supabase = createUntypedAdminClient();

  const slug = data.clientAlias
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { error } = await supabase.from("providers").insert({
    id: data.userId,
    email: data.email,
    internal_name: data.internalName,
    client_alias: data.clientAlias,
    slug: `${slug}-${Date.now().toString(36)}`,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
