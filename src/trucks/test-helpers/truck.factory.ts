import { Truck } from '../domain/truck';
import { TruckStatus } from '../domain/truck-status';

let idCounter = 0;

export function buildTruck(
  overrides: Partial<{
    id: string;
    code: string;
    name: string;
    status: TruckStatus;
    description: string | undefined;
    createdAt: Date;
    updatedAt: Date;
  }> = {},
): Truck {
  idCounter += 1;
  return new Truck(
    overrides.id ?? `truck-id-${idCounter}`,
    overrides.code ?? `CODE${idCounter}`,
    overrides.name ?? 'Test Truck',
    overrides.status ?? TruckStatus.OUT_OF_SERVICE,
    overrides.description,
    overrides.createdAt ?? new Date('2024-01-01T00:00:00Z'),
    overrides.updatedAt ?? new Date('2024-01-01T00:00:00Z'),
  );
}
