import { ICommand } from '@nestjs/cqrs';
import type { TruckStatus } from '../../domain/truck-status';

export class UpdateTruckCommand implements ICommand {
  public constructor(
    public readonly id: string,
    public readonly code: string | undefined,
    public readonly name: string | undefined,
    public readonly status: TruckStatus | undefined,
    public readonly description: string | undefined,
  ) {}
}
