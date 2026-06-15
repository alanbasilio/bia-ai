import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { PedidoInput } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const sb = getSupabase();

  const { data, error } = await sb
    .from("pedidos")
    .select("*, clientes(id, nome)")
    .eq("id", id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 404 });
  return Response.json(data);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body: Partial<PedidoInput> = await request.json();
  const sb = getSupabase();

  const { data, error } = await sb
    .from("pedidos")
    .update(body as never)
    .eq("id", id)
    .select("*, clientes(id, nome)")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const sb = getSupabase();

  const { error } = await sb.from("pedidos").delete().eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
