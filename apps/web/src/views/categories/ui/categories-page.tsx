"use client";

import { useRequireAuth } from "@/features/auth/model/use-require-auth";
import { HeaderNav } from "@/widgets/header-nav/ui/header-nav";

export function CategoriesPage() {
  const { user, isLoading } = useRequireAuth();
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Загрузка...
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <HeaderNav />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-semibold">Категории</h1>
        <p className="text-muted-foreground text-sm mt-2">В разработке.</p>
      </main>
    </div>
  );
}
