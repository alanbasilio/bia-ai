"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
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
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Excluir cliente"
      description={`Tem certeza que deseja excluir "${nome}"? Essa ação também pode afetar pedidos vinculados.`}
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
