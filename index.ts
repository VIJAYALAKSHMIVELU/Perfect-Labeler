// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2eWFnZWZkY2xpbXJpendnaWlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA0MzAwMSwiZXhwIjoyMDgzNjE5MDAxfQ.WsdDtSIq-EB75y59jPS6bRZKtmgaHVY6NpOgOLU998k")!
  );

  /* ---------------- AUTH ---------------- */
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Missing Authorization header", { status: 401 });
  }

  const jwt = authHeader.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabase.auth.getUser(jwt);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  /* ------------ TENANT LOOKUP ------------ */
  const { data: tenant, error: tenantError } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (tenantError || !tenant) {
    return new Response("Tenant not found", { status: 403 });
  }

  const tenant_id = tenant.tenant_id;

  /* ---------------- ROUTING ---------------- */
  const url = new URL(req.url);
  const design_id = url.searchParams.get("id");

  try {
    /* -------- INSERT -------- */
    if (req.method === "POST") {
      const body = await req.json();

      const { data, error } = await supabase
        .from("receipt_designs")
        .insert({
          tenant_id,
          name: body.name,
          width: body.width,
          height: body.height,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), { status: 201 });
    }

    /* -------- SELECT ALL -------- */
    if (req.method === "GET" && !design_id) {
      const { data, error } = await supabase
        .from("receipt_designs")
        .select("*")
        .eq("tenant_id", tenant_id);

      if (error) throw error;

      return new Response(JSON.stringify(data), { status: 200 });
    }

    /* -------- SELECT ONE -------- */
    if (req.method === "GET" && design_id) {
      const { data, error } = await supabase
        .from("receipt_designs")
        .select("*")
        .eq("id", design_id)
        .eq("tenant_id", tenant_id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), { status: 200 });
    }

    /* -------- UPDATE -------- */
    if (req.method === "PATCH" && design_id) {
      const body = await req.json();

      const { data, error } = await supabase
        .from("receipt_designs")
        .update({
          name: body.name,
          width: body.width,
          height: body.height,
        })
        .eq("id", design_id)
        .eq("tenant_id", tenant_id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), { status: 200 });
    }

    /* -------- DELETE -------- */
    if (req.method === "DELETE" && design_id) {
      const { error } = await supabase
        .from("receipt_designs")
        .delete()
        .eq("id", design_id)
        .eq("tenant_id", tenant_id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ message: "Deleted successfully" }),
        { status: 200 }
      );
    }

    return new Response("Method Not Allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 400 });
  }
});
