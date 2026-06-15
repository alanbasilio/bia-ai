import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { TablesUpdate } from "@/lib/database.types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const sb = getSupabase();

  const { data, error } = await sb
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 404 });
  return Response.json(data);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await request.json()) as TablesUpdate<"clientes">;
  const sb = getSupabase();

  const { data, error } = await sb
    .from("clientes")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const sb = getSupabase();

  const { count, error: countError } = await sb
    .from("pedidos")
    .select("*", { count: "exact", head: true })
    .eq("cliente_id", id);

  if (countError)
    return Response.json({ error: countError.message }, { status: 500 });

  if (count && count > 0) {
    return Response.json(
      {
        error: `Este cliente possui ${count} pedido${count > 1 ? "s" : ""} associado${count > 1 ? "s" : ""} e não pode ser excluído.`,
      },
      { status: 409 },
    );
  }

  const { error } = await sb.from("clientes").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
