import { IQuery } from '@nestjs/cqrs';

export type PingTrucksResult = {
  readonly message: string;
};

export class PingTrucksQuery implements IQuery {}
