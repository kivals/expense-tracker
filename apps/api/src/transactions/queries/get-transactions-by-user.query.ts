export class GetTransactionsByUserQuery {
  constructor(
    public readonly userId: string,
    public readonly month?: number,
    public readonly year?: number,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}
