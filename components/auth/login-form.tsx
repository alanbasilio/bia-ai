"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("bia@bia-ai.com");
  const [password, setPassword] = useState("Bi@2026");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/pedidos");
      router.refresh();
    } else {
      const { error: msg } = (await res.json()) as { error: string };
      setError(msg ?? "Erro ao entrar");
      setIsPending(false);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-sidebar px-12 py-14">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center justify-center w-9 h-9 rounded bg-sidebar-primary text-sidebar-primary-foreground">
              <span className="font-heading text-lg font-semibold leading-none">B</span>
            </div>
            <span className="font-heading text-xl font-semibold text-sidebar-accent-foreground tracking-wide">
              Bia AI
            </span>
          </div>

          <h2 className="font-heading text-4xl font-medium text-sidebar-accent-foreground leading-snug mb-4">
            Gestão de pedidos<br />e clientes
          </h2>
          <p className="text-sm text-sidebar-foreground/50 leading-relaxed">
            Seu painel de vendas de acessórios, organizado em um só lugar.
          </p>
        </div>

        <p className="text-[11px] text-sidebar-foreground/30 tracking-widest uppercase">
          © {new Date().getFullYear()} Bia AI
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background px-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-1 lg:hidden">
              <div className="flex items-center justify-center w-7 h-7 rounded bg-primary text-primary-foreground">
                <span className="font-heading text-sm font-semibold leading-none">B</span>
              </div>
              <span className="font-heading text-lg font-semibold">Bia AI</span>
            </div>
            <h1 className="font-heading text-3xl font-semibold text-foreground tracking-wide">
              Entrar
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse o painel de gestão
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 text-sm font-medium" disabled={isPending}>
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
