"use client";

import { cn } from "@/lib/utils";
import { LogOut, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/clientes", label: "Clientes", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex flex-col w-56 h-screen bg-sidebar shrink-0 overflow-y-auto">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <span className="font-heading text-base font-semibold leading-none">B</span>
          </div>
          <div className="min-w-0">
            <p className="font-heading text-lg font-semibold text-sidebar-accent-foreground leading-none tracking-wide">
              Bia AI
            </p>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5 tracking-widest uppercase">
              Gestão
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-sidebar-primary" />
              )}
              <Icon className={cn("size-4 shrink-0", isActive ? "text-sidebar-primary" : "")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3 space-y-1">
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-[10px] text-sidebar-foreground/40 tracking-widest uppercase">Tema</span>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 px-3 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground h-9 text-xs"
          onClick={handleLogout}
        >
          <LogOut className="size-3.5 shrink-0" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
