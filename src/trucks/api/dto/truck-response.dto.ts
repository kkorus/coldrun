import type { Truck, TruckListResult } from '../../domain/truck';
import type { TruckStatus } from '../../domain/truck-status';

export type TruckResponseDto = {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly status: TruckStatus;
  readonly description?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type ListTrucksResponseDto = {
  readonly items: readonly TruckResponseDto[];
  readonly total: number;
};

export function toTruckResponseDto(truck: Truck): TruckResponseDto {
  return {
    id: truck.id,
    code: truck.code,
    name: truck.name,
    status: truck.status,
    description: truck.description,
    createdAt: truck.createdAt.toISOString(),
    updatedAt: truck.updatedAt.toISOString(),
  };
}

export function toListTrucksResponseDto(
  result: TruckListResult,
): ListTrucksResponseDto {
  return {
    items: result.items.map((t) => toTruckResponseDto(t)),
    total: result.total,
  };
}
