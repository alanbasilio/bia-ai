"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Produto, ProdutoComContagem, ProdutoInput } from "@/lib/types";

const PRODUTOS_KEY = "produtos";

async function fetchProdutos(search: string): Promise<ProdutoComContagem[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const res = await fetch(`/api/produtos?${params}`);
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return res.json() as Promise<ProdutoComContagem[]>;
}

export function useProdutos(search = "") {
  return useQuery<ProdutoComContagem[]>({
    queryKey: [PRODUTOS_KEY, search],
    queryFn: () => fetchProdutos(search),
  });
}

export function useCreateProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProdutoInput) => {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { error } = (await res.json()) as { error: string };
        throw new Error(error ?? "Erro ao criar produto");
      }
      return res.json() as Promise<Produto>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUTOS_KEY] });
      toast.success("Produto criado com sucesso");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<ProdutoInput> & { id: string }) => {
      const res = await fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { error } = (await res.json()) as { error: string };
        throw new Error(error ?? "Erro ao atualizar produto");
      }
      return res.json() as Promise<Produto>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUTOS_KEY] });
      toast.success("Produto atualizado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const { error } = (await res.json()) as { error: string };
        throw new Error(error ?? "Erro ao excluir produto");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUTOS_KEY] });
      qc.invalidateQueries({ queryKey: ["pedidos"] });
      toast.success("Produto excluído");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
