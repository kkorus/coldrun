import { ICommand } from '@nestjs/cqrs';
import type { TruckStatus } from '../../domain/truck-status';

export class CreateTruckCommand implements ICommand {
  public constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly status: TruckStatus,
    public readonly description: string | undefined,
  ) {}
}
