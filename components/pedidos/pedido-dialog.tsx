"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
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
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={pedido ? "Editar Pedido" : "Novo Pedido"}
      className="max-w-lg"
    >
      <PedidoForm
        defaultValues={pedido}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </ResponsiveDialog>
  );
}
