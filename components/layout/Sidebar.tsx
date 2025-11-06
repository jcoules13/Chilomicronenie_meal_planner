"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Carrot,
  UtensilsCrossed,
  ShoppingCart,
  Dumbbell,
  Calendar,
  LineChart,
  User,
  Clock,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/aliments", label: "Aliments", icon: Carrot },
  { href: "/menus", label: "Menus", icon: UtensilsCrossed },
  { href: "/courses", label: "Courses", icon: ShoppingCart },
  { href: "/sport", label: "Sport", icon: Dumbbell },
  { href: "/journal", label: "Journal", icon: Calendar },
  { href: "/analyses", label: "Analyses", icon: LineChart },
  { href: "/profil", label: "Profil", icon: User },
  { href: "/rendez-vous", label: "Rendez-vous", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        {/* Logo / Title */}
        <div className="border-b p-6">
          <h1 className="text-xl font-bold text-primary">
            Nutrition & Santé
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gestion personnalisée
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground text-center">
            v0.1.0 - Phase 1
          </p>
        </div>
      </div>
    </aside>
  );
}
