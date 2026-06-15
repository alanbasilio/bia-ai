"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { ProdutoForm } from "./produto-form";
import { useCreateProduto, useUpdateProduto } from "@/hooks/use-produtos";
import type { Produto, ProdutoInput } from "@/lib/types";

interface ProdutoDialogProps {
  produto?: Produto;
  trigger: React.ReactNode;
}

export function ProdutoDialog({ produto, trigger }: ProdutoDialogProps) {
  const [open, setOpen] = useState(false);
  const create = useCreateProduto();
  const update = useUpdateProduto();
  const isPending = create.isPending || update.isPending;

  function handleSubmit(data: ProdutoInput) {
    if (produto) {
      update.mutate(
        { id: produto.id, ...data },
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
      title={produto ? "Editar Produto" : "Novo Produto"}
      className="max-w-md"
    >
      <ProdutoForm
        defaultValues={produto}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </ResponsiveDialog>
  );
}
