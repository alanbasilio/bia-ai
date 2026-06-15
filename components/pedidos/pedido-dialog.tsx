"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PedidoForm } from "./pedido-form";
import { useCreatePedido, useUpdatePedido } from "@/hooks/use-pedidos";
import type { Pedido, PedidoInput } from "@/lib/types";

interface PedidoDialogProps {
  pedido?: Pedido;
  trigger: React.ReactNode;
}

export function PedidoDialog({ pedido, trigger }: PedidoDialogProps) {
  const [open, setOpen] = useState(false);
  const create = useCreatePedido();
  const update = useUpdatePedido();
  const isPending = create.isPending || update.isPending;

  function handleSubmit(data: PedidoInput) {
    if (pedido) {
      update.mutate(
        { id: pedido.id, ...data },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      create.mutate(data, { onSuccess: () => setOpen(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-semibold tracking-wide">
            {pedido ? "Editar Pedido" : "Novo Pedido"}
          </DialogTitle>
        </DialogHeader>
        <PedidoForm
          defaultValues={pedido}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
