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
import type { Cliente, ClienteInput } from "@/lib/types";

function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskInstagram(raw: string): string {
  const stripped = raw.startsWith("@") ? raw.slice(1) : raw;
  const clean = stripped.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 30);
  return clean ? `@${clean}` : "";
}

const nullableStr = z
  .string()
  .transform((v) => v.trim() || null)
  .nullable();

const schema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  instagram: nullableStr,
  whatsapp: nullableStr,
  endereco: nullableStr,
  observacoes: nullableStr,
});

type FormValues = z.infer<typeof schema>;

interface ClienteFormProps {
  defaultValues?: Cliente;
  onSubmit: (data: ClienteInput) => void;
  isPending: boolean;
}

export function ClienteForm({
  defaultValues,
  onSubmit,
  isPending,
}: ClienteFormProps) {
  const form = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      nome: defaultValues?.nome ?? "",
      instagram: defaultValues?.instagram ?? "",
      whatsapp: defaultValues?.whatsapp ?? "",
      endereco: defaultValues?.endereco ?? "",
      observacoes: defaultValues?.observacoes ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => onSubmit(v as ClienteInput))}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instagram (1/2) + WhatsApp (1/2) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@usuario"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(maskInstagram(e.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(81) 99999-9999"
                    inputMode="numeric"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(maskPhone(e.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input
                  placeholder="Rua, bairro, cidade"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {...field}
                  value={field.value ?? ""}
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
