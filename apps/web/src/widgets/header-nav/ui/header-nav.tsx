"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/model/auth-context";
import { Button, buttonVariants } from "@/shared/ui/button";

export function HeaderNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const navLinkClass = buttonVariants({ variant: "ghost", size: "sm" });

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            Expense Tracker
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/transactions" className={navLinkClass}>
              Транзакции
            </Link>
            <Link href="/categories" className={navLinkClass}>
              Категории
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-muted-foreground text-sm">{user.name}</span>
          )}
          <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
}
