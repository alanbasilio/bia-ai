import { Badge } from "@/components/ui/badge";
import type { StatusPedido } from "@/lib/types";

const statusConfig: Record<StatusPedido, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pago:      { label: "Pago",      variant: "default" },
  enviado:   { label: "Enviado",   variant: "secondary" },
  pendente:  { label: "Pendente",  variant: "outline" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};

export function StatusBadge({ status }: { status: StatusPedido }) {
  const cfg = statusConfig[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
