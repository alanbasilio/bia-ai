"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useDeletePedido } from "@/hooks/use-pedidos";

interface DeletePedidoDialogProps {
  id: string;
  produto: string;
  trigger: React.ReactNode;
}

export function DeletePedidoDialog({
  id,
  produto,
  trigger,
}: DeletePedidoDialogProps) {
  const [open, setOpen] = useState(false);
  const del = useDeletePedido();

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Excluir pedido"
      description={`Tem certeza que deseja excluir o pedido de "${produto}"? Essa ação não pode ser desfeita.`}
      className="max-w-sm"
    >
      <div className="flex gap-2 pt-2 pb-1">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          disabled={del.isPending}
          onClick={() => del.mutate(id, { onSuccess: () => setOpen(false) })}
        >
          {del.isPending ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
