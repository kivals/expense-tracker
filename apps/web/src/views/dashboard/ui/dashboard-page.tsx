"use client";

import { useRequireAuth } from "@/features/auth/model/use-require-auth";
import { useCategories } from "@/features/categories/model/use-categories";
import { useRecentTransactions } from "@/features/transactions/model/use-recent-transactions";
import { TransactionList } from "@/features/transactions/ui/transaction-list";
import { TransactionListPagination } from "@/features/transactions/ui/transaction-list-pagination";
import { HeaderNav } from "@/widgets/header-nav/ui/header-nav";
import { Card, CardContent, CardDescription, CardTitle } from "@/shared/ui/card";

const amountFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatAmount(value: string): string {
  return amountFormatter.format(Number(value));
}

export function DashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const isAuthed = Boolean(user);
  const { byId, isLoading: categoriesLoading } = useCategories(isAuthed);
  const {
    items,
    aggregate,
    isLoading: txLoading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = useRecentTransactions(10, isAuthed);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeaderNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        <section>
          <h1 className="text-2xl font-semibold">Привет, {user.name}</h1>
          <p className="text-muted-foreground text-sm">
            Сводка ваших финансов
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="py-4">
              <CardDescription>Доходы</CardDescription>
              <CardTitle className="text-emerald-600 tabular-nums">
                +{formatAmount(aggregate.totalIncome)}
              </CardTitle>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <CardDescription>Расходы</CardDescription>
              <CardTitle className="text-red-600 tabular-nums">
                -{formatAmount(aggregate.totalExpense)}
              </CardTitle>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <CardDescription>Баланс</CardDescription>
              <CardTitle className="tabular-nums">
                {formatAmount(aggregate.balance)}
              </CardTitle>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Последние транзакции</h2>
          <TransactionList
            items={items}
            categoriesById={byId}
            isLoading={txLoading || categoriesLoading}
            error={error}
          />
          {totalPages > 1 && (
            <TransactionListPagination
              page={page}
              totalPages={totalPages}
              onPrev={prevPage}
              onNext={nextPage}
              disabled={txLoading}
            />
          )}
        </section>
      </main>
    </div>
  );
}
