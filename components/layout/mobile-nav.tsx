"use client";

import { cn } from "@/lib/utils";
import { LogOut, Package, ShoppingBag, Sun, Moon, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const links = [
  { href: "/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/produtos", label: "Produtos", icon: Package },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-sidebar border-t border-sidebar-border">
      <div className="flex items-stretch h-16">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-sidebar-primary"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-5" />
              <span className="text-[9px] font-medium tracking-widest uppercase">
                {label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          className="flex-1 flex flex-col items-center justify-center gap-1 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
          <span className="text-[9px] font-medium tracking-widest uppercase">
            Tema
          </span>
        </button>

        <button
          type="button"
          className="flex-1 flex flex-col items-center justify-center gap-1 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="size-5" />
          <span className="text-[9px] font-medium tracking-widest uppercase">
            Sair
          </span>
        </button>
      </div>
    </nav>
  );
}
