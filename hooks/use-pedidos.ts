"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Pedido, PedidoInput } from "@/lib/types";

const PEDIDOS_KEY = "pedidos";

async function fetchPedidos(search: string, clienteId: string): Promise<Pedido[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (clienteId) params.set("cliente_id", clienteId);
  const res = await fetch(`/api/pedidos?${params}`);
  if (!res.ok) throw new Error("Erro ao buscar pedidos");
  return res.json();
}

export function usePedidos(search = "", clienteId = "") {
  return useQuery<Pedido[]>({
    queryKey: [PEDIDOS_KEY, search, clienteId],
    queryFn: () => fetchPedidos(search, clienteId),
  });
}

export function useCreatePedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PedidoInput) => {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Erro ao criar pedido");
      }
      return res.json() as Promise<Pedido>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PEDIDOS_KEY] });
      toast.success("Pedido criado com sucesso");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<PedidoInput> & { id: string }) => {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Erro ao atualizar pedido");
      }
      return res.json() as Promise<Pedido>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PEDIDOS_KEY] });
      toast.success("Pedido atualizado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir pedido");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PEDIDOS_KEY] });
      toast.success("Pedido excluído");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
