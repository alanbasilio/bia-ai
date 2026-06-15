"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProduto } from "@/hooks/use-produtos";

interface DeleteProdutoDialogProps {
  id: string;
  nome: string;
  trigger: React.ReactNode;
}

export function DeleteProdutoDialog({
  id,
  nome,
  trigger,
}: DeleteProdutoDialogProps) {
  const [open, setOpen] = useState(false);
  const del = useDeleteProduto();

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Excluir produto"
      description={`Tem certeza que deseja excluir "${nome}"? Os pedidos vinculados a este produto não serão excluídos.`}
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
