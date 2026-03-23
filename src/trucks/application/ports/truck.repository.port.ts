import { Injectable } from '@nestjs/common';
import type {
  CreateTruckInput,
  ListTrucksCriteria,
  Truck,
  TruckListResult,
  UpdateTruckInput,
} from '../../domain/truck';

@Injectable()
export abstract class TruckRepositoryPort {
  abstract create(input: CreateTruckInput): Promise<Truck>;

  abstract findById(id: string): Promise<Truck | null>;

  abstract findByCode(code: string): Promise<Truck | null>;

  abstract findMany(criteria: ListTrucksCriteria): Promise<TruckListResult>;

  abstract update(id: string, input: UpdateTruckInput): Promise<Truck | null>;

  abstract deleteById(id: string): Promise<boolean>;
}
