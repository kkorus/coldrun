import { Injectable } from '@nestjs/common';
import type {
  CreateTruckInput,
  ListTrucksCriteria,
  TruckListResult,
} from '../../domain/truck';
import { Truck } from '../../domain/truck';

@Injectable()
export abstract class TruckRepositoryPort {
  abstract create(input: CreateTruckInput): Promise<Truck>;

  abstract findById(id: string): Promise<Truck | null>;

  abstract findByCode(code: string): Promise<Truck | null>;

  abstract findMany(criteria: ListTrucksCriteria): Promise<TruckListResult>;

  abstract save(truck: Truck): Promise<Truck>;

  abstract deleteById(id: string): Promise<boolean>;
}
