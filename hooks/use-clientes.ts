"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Cliente, ClienteInput } from "@/lib/types";

const CLIENTES_KEY = "clientes";

async function fetchClientes(search: string): Promise<Cliente[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const res = await fetch(`/api/clientes?${params}`);
  if (!res.ok) throw new Error("Erro ao buscar clientes");
  return res.json() as Promise<Cliente[]>;
}

export function useClientes(search = "") {
  return useQuery({
    queryKey: [CLIENTES_KEY, search],
    queryFn: () => fetchClientes(search),
  });
}

export function useCreateCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ClienteInput) => {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { error } = (await res.json()) as { error: string };
        throw new Error(error ?? "Erro ao criar cliente");
      }
      return res.json() as Promise<Cliente>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CLIENTES_KEY] });
      toast.success("Cliente criado com sucesso");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<ClienteInput> & { id: string }) => {
      const res = await fetch(`/api/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const { error } = (await res.json()) as { error: string };
        throw new Error(error ?? "Erro ao atualizar cliente");
      }
      return res.json() as Promise<Cliente>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CLIENTES_KEY] });
      toast.success("Cliente atualizado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const { error } = (await res.json()) as { error: string };
        throw new Error(error ?? "Erro ao excluir cliente");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CLIENTES_KEY] });
      toast.success("Cliente excluído");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
