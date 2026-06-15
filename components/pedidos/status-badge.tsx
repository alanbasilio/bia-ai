import { Badge } from "@/components/ui/badge";
import type { StatusPedido } from "@/lib/types";

const statusConfig: Record<
  StatusPedido,
  {
    label: string;
    variant: "success" | "warning" | "info" | "destructive";
  }
> = {
  pago: { label: "Pago", variant: "success" },
  enviado: { label: "Enviado", variant: "info" },
  pendente: { label: "Pendente", variant: "warning" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};

export function StatusBadge({ status }: { status: StatusPedido }) {
  const cfg = statusConfig[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
