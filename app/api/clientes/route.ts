import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { TablesInsert } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? "";
  const clienteId = searchParams.get("cliente_id") ?? "";
  const sb = getSupabase();

  let query = sb
    .from("clientes")
    .select("*, pedidos(count)")
    .order("nome", { ascending: true });

  if (clienteId) query = query.eq("id", clienteId);
  else if (search) query = query.ilike("nome", `%${search}%`);

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as TablesInsert<"clientes">;
  const sb = getSupabase();

  const { data, error } = await sb
    .from("clientes")
    .insert(body)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
