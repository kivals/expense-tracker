export type PublicUser = { id: string; name: string; email: string };

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCategoryPayload = { name: string; color: string; icon: string };
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type AuthResponse = { accessToken: string; user: PublicUser };
export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  amount: string;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTransactionPayload = {
  amount: string | number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
};
export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export type TransactionsAggregate = {
  totalIncome: string;
  totalExpense: string;
  balance: string;
};

export type TransactionsListResponse = {
  items: Transaction[];
  aggregate: TransactionsAggregate;
};
