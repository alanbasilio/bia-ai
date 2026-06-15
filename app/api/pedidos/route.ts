import type { TablesInsert } from "@/lib/database.types";
import { getSupabase } from "@/lib/supabase";
import type { StatusPedido } from "@/lib/types";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const clienteId = searchParams.get("cliente_id") ?? "";
  const produtoId = searchParams.get("produto_id") ?? "";
  const sb = getSupabase();

  let query = sb
    .from("pedidos")
    .select("*, clientes(id, nome), produtos(id, nome, preco)")
    .order("data_pedido", { ascending: false });

  if (status) query = query.eq("status", status as StatusPedido);
  if (clienteId) query = query.eq("cliente_id", clienteId);
  if (produtoId) query = query.eq("produto_id", produtoId);

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const result = search
    ? data.filter(
      (p) =>
        p.produtos?.nome?.toLowerCase().includes(search.toLowerCase()) ||
        p.clientes?.nome?.toLowerCase().includes(search.toLowerCase()),
    )
    : data;

  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as TablesInsert<"pedidos">;
  const sb = getSupabase();

  const { data, error } = await sb
    .from("pedidos")
    .insert(body)
    .select("*, clientes(id, nome)")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
