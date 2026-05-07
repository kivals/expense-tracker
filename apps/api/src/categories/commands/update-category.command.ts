export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name?: string,
    public readonly color?: string,
    public readonly icon?: string,
  ) {}
}
