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
import type { Produto, ProdutoInput } from "@/lib/types";

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

function parseBRL(masked: string): number | null {
  const digits = masked.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) / 100 : null;
}

const schema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  preco: z.coerce.number().nullable(),
  descricao: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface ProdutoFormProps {
  defaultValues?: Produto;
  onSubmit: (data: ProdutoInput) => void;
  isPending: boolean;
}

export function ProdutoForm({
  defaultValues,
  onSubmit,
  isPending,
}: ProdutoFormProps) {
  const form = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      nome: defaultValues?.nome ?? "",
      preco: defaultValues?.preco ?? null,
      descricao: defaultValues?.descricao ?? null,
    },
  });

  const precoValue = form.watch("preco");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => onSubmit(v as ProdutoInput))}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Brinco Argola Prata" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={
                    field.value != null
                      ? maskBRL(String(Math.round((field.value as number) * 100)))
                      : ""
                  }
                  onChange={(e) => field.onChange(parseBRL(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
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
