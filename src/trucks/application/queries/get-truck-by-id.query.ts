import { IQuery } from '@nestjs/cqrs';

export class GetTruckByIdQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
