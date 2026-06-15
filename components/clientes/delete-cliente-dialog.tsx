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
import { useDeleteCliente } from "@/hooks/use-clientes";

interface DeleteClienteDialogProps {
  id: string;
  nome: string;
  trigger: React.ReactNode;
}

export function DeleteClienteDialog({
  id,
  nome,
  trigger,
}: DeleteClienteDialogProps) {
  const [open, setOpen] = useState(false);
  const del = useDeleteCliente();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir cliente</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir <strong>{nome}</strong>? Essa ação
            também pode afetar pedidos vinculados a este cliente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={del.isPending}
            onClick={() => del.mutate(id, { onSuccess: () => setOpen(false) })}
          >
            {del.isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
