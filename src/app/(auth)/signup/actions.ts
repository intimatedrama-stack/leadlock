"use server";

import { createClient } from "@supabase/supabase-js";

function createAuthClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function createProviderProfile(data: {
  userId: string;
  email: string;
  internalName: string;
  clientAlias: string;
  accessToken: string;
}) {
  const authClient = createAuthClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser(data.accessToken);

  if (authError || !user || user.id !== data.userId || user.email !== data.email) {
    return { error: "You must be signed in to create a provider profile." };
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const slug = data.clientAlias
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { error } = await adminClient.from("providers").insert({
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
