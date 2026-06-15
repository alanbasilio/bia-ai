"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { ClienteForm } from "./cliente-form";
import { useCreateCliente, useUpdateCliente } from "@/hooks/use-clientes";
import type { Cliente, ClienteInput } from "@/lib/types";

interface ClienteDialogProps {
  cliente?: Cliente;
  trigger: React.ReactNode;
}

export function ClienteDialog({ cliente, trigger }: ClienteDialogProps) {
  const [open, setOpen] = useState(false);
  const create = useCreateCliente();
  const update = useUpdateCliente();
  const isPending = create.isPending || update.isPending;

  function handleSubmit(data: ClienteInput) {
    if (cliente) {
      update.mutate(
        { id: cliente.id, ...data },
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
      title={cliente ? "Editar Cliente" : "Novo Cliente"}
      className="max-w-md"
    >
      <ClienteForm
        defaultValues={cliente}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </ResponsiveDialog>
  );
}
