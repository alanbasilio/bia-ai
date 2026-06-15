"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-semibold tracking-wide">
            {cliente ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>
        <ClienteForm
          defaultValues={cliente}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
