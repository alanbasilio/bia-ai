"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeletePedido } from "@/hooks/use-pedidos";

interface DeletePedidoDialogProps {
  id: string;
  produto: string;
  trigger: React.ReactNode;
}

export function DeletePedidoDialog({ id, produto, trigger }: DeletePedidoDialogProps) {
  const [open, setOpen] = useState(false);
  const del = useDeletePedido();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir pedido</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o pedido de{" "}
            <strong>{produto}</strong>? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={del.isPending}
            onClick={() =>
              del.mutate(id, { onSuccess: () => setOpen(false) })
            }
          >
            {del.isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
