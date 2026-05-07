import { TransactionType } from '@prisma/client';

export class CreateTransactionCommand {
  constructor(
    public readonly amount: string,
    public readonly type: TransactionType,
    public readonly description: string,
    public readonly date: string,
    public readonly categoryId: string,
    public readonly userId: string,
  ) {}
}
