import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { PedidoInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const sb = getSupabase();

  let query = sb
    .from("pedidos")
    .select("*, clientes(id, nome)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const result = search
    ? data.filter(
        (p: { produto: string; clientes?: { nome: string } | null }) =>
          p.produto.toLowerCase().includes(search.toLowerCase()) ||
          p.clientes?.nome?.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const body: PedidoInput = await request.json();
  const sb = getSupabase();

  const { data, error } = await sb
    .from("pedidos")
    .insert(body)
    .select("*, clientes(id, nome)")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
