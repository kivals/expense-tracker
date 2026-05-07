import { TransactionType } from '@prisma/client';

export class UpdateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount?: string,
    public readonly type?: TransactionType,
    public readonly description?: string,
    public readonly date?: string,
    public readonly categoryId?: string,
  ) {}
}
