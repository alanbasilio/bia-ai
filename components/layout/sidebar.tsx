"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, ShoppingBag, Users } from "lucide-react";
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
    <aside className="flex flex-col w-60 h-screen border-r bg-sidebar px-3 py-4 gap-1 shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 px-3 py-2 mb-4">
        <LayoutDashboard className="size-5 text-sidebar-primary" />
        <span className="font-semibold text-sidebar-foreground">Bia AI</span>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-sidebar-foreground/50">Tema</span>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
