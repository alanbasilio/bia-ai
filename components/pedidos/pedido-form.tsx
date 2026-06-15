"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerField } from "@/components/ui/date-picker";
import { useClientes } from "@/hooks/use-clientes";
import type { Pedido, PedidoInput } from "@/lib/types";

function maskBRL(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "") || "0";
  const cents = parseInt(digits.slice(0, 10), 10);
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseBRL(masked: string): number {
  const digits = masked.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) / 100 : 0;
}

const schema = z.object({
  cliente_id: z.string().uuid().nullable(),
  produto: z.string().min(1, "Produto obrigatório"),
  quantidade: z.coerce.number().int().min(1),
  valor: z.coerce.number().min(0),
  status: z.enum(["pago", "pendente", "enviado", "cancelado"]),
  data_pedido: z.string().min(1, "Data obrigatória"),
  forma_pagamento: z
    .enum(["pix", "cartao", "dinheiro", "transferencia"])
    .nullable(),
  observacoes: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface PedidoFormProps {
  defaultValues?: Pedido;
  onSubmit: (data: PedidoInput) => void;
  isPending: boolean;
}

export function PedidoForm({
  defaultValues,
  onSubmit,
  isPending,
}: PedidoFormProps) {
  const { data: clientes = [] } = useClientes();

  const form = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      cliente_id: defaultValues?.cliente_id ?? null,
      produto: defaultValues?.produto ?? "",
      quantidade: defaultValues?.quantidade ?? 1,
      valor: defaultValues?.valor ?? 0,
      status: defaultValues?.status ?? "pendente",
      data_pedido:
        defaultValues?.data_pedido ?? new Date().toISOString().split("T")[0],
      forma_pagamento: defaultValues?.forma_pagamento ?? null,
      observacoes: defaultValues?.observacoes ?? null,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => onSubmit(v as PedidoInput))}
        className="space-y-5"
      >
        {/* Identificação */}
        <FormField
          control={form.control}
          name="cliente_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === "_none" ? null : v)}
                value={field.value ?? "_none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_none">Sem cliente</SelectItem>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="produto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Brinco Argola Prata" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="border-border" />

        {/* Qtd (1/3) + Valor (2/3) */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qtd.</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      value={maskBRL(
                        String(Math.round((field.value as number) * 100)),
                      )}
                      onChange={(e) => field.onChange(parseBRL(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Status (1/2) + Data (1/2) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data_pedido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Forma de pagamento */}
        <FormField
          control={form.control}
          name="forma_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de Pagamento</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === "_none" ? null : v)}
                value={field.value ?? "_none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_none">Não informado</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="border-border" />

        {/* Observações */}
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Opcional"
                  rows={3}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-9" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
