import { ICommand } from '@nestjs/cqrs';

export class DeleteTruckCommand implements ICommand {
  public constructor(public readonly id: string) {}
}
